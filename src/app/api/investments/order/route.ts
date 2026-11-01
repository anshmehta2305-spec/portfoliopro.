import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const {
      type, // 'PURCHASE', 'REDEMPTION', 'SWITCH'
      fundId,
      destFundId,
      amount,
      units: reqUnits,
      holdingId,
      clientId: targetClientId,
    } = body;

    if (!type || !["PURCHASE", "REDEMPTION", "SWITCH"].includes(type)) {
      return NextResponse.json({ error: "Invalid order type. Must be PURCHASE, REDEMPTION, or SWITCH." }, { status: 400 });
    }

    // Resolve client
    let client = null;
    if (targetClientId) {
      client = await db.client.findUnique({ where: { id: targetClientId } });
    } else if (session?.user?.email) {
      client = await db.client.findFirst({ where: { email: session.user.email } });
    } else {
      client = await db.client.findFirst();
    }

    if (!client) {
      return NextResponse.json({ error: "Client record not found." }, { status: 404 });
    }

    const orderAmount = Number(amount);
    const todayStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    // --- 1. LUMPSUM PURCHASE ---
    if (type === "PURCHASE") {
      if (!fundId) {
        return NextResponse.json({ error: "Mutual Fund selection is required." }, { status: 400 });
      }
      if (isNaN(orderAmount) || orderAmount < 1000) {
        return NextResponse.json({ error: "Minimum lumpsum purchase is ₹1,000." }, { status: 400 });
      }

      const fund = await db.fund.findUnique({ where: { id: fundId } });
      if (!fund) {
        return NextResponse.json({ error: "Selected fund does not exist." }, { status: 404 });
      }

      const allocatedUnits = Number((orderAmount / fund.nav).toFixed(3));
      const folioNumber = `FOLIO/${fund.amfiCode}/${client.pan.slice(0, 4)}/${Math.floor(1000 + Math.random() * 9000)}`;

      // Record transaction
      const trans = await db.transaction.create({
        data: {
          clientId: client.id,
          folioNumber,
          schemeName: fund.name,
          type: "PURCHASE",
          amount: orderAmount,
          units: allocatedUnits,
          nav: fund.nav,
          transDate: todayStr,
          status: "SUCCESS",
          platform: "BSE_STAR",
        },
      });

      // Update / Create Holding
      const existing = await db.holding.findFirst({
        where: { clientId: client.id, fundId: fund.id },
      });

      if (existing) {
        const newUnits = existing.units + allocatedUnits;
        const newInvested = existing.investedValue + orderAmount;
        const newCurrent = Number((newUnits * fund.nav).toFixed(2));
        const absReturn = Number((((newCurrent - newInvested) / newInvested) * 100).toFixed(2));

        await db.holding.update({
          where: { id: existing.id },
          data: {
            units: newUnits,
            investedValue: newInvested,
            currentValue: newCurrent,
            absoluteReturn: absReturn,
          },
        });
      } else {
        await db.holding.create({
          data: {
            clientId: client.id,
            fundId: fund.id,
            folioNumber,
            units: allocatedUnits,
            avgNav: fund.nav,
            currentNav: fund.nav,
            investedValue: orderAmount,
            currentValue: orderAmount,
            absoluteReturn: 0.0,
            xirr: 15.0,
          },
        });
      }

      await db.client.update({
        where: { id: client.id },
        data: {
          totalAum: { increment: orderAmount },
          totalCost: { increment: orderAmount },
        },
      });

      return NextResponse.json({
        success: true,
        message: `Lumpsum purchase of ₹${orderAmount.toLocaleString("en-IN")} in ${fund.name} executed successfully.`,
        transaction: trans,
      });
    }

    // --- 2. REDEMPTION ---
    if (type === "REDEMPTION") {
      if (!holdingId) {
        return NextResponse.json({ error: "Holding selection is required for redemption." }, { status: 400 });
      }

      const holding = await db.holding.findUnique({
        where: { id: holdingId },
        include: { fund: true },
      });

      if (!holding || holding.clientId !== client.id) {
        return NextResponse.json({ error: "Holding not found or unauthorized." }, { status: 404 });
      }

      let unitsToRedeem = Number(reqUnits);
      let redeemAmount = orderAmount;

      if (!unitsToRedeem && orderAmount) {
        unitsToRedeem = Number((orderAmount / holding.currentNav).toFixed(3));
      } else if (unitsToRedeem && !orderAmount) {
        redeemAmount = Number((unitsToRedeem * holding.currentNav).toFixed(2));
      }

      if (unitsToRedeem <= 0 || unitsToRedeem > holding.units) {
        return NextResponse.json({ error: `Insufficient units. Available units: ${holding.units.toFixed(3)}.` }, { status: 400 });
      }

      const remainingUnits = holding.units - unitsToRedeem;
      const trans = await db.transaction.create({
        data: {
          clientId: client.id,
          folioNumber: holding.folioNumber,
          schemeName: holding.fund.name,
          type: "REDEMPTION",
          amount: redeemAmount,
          units: unitsToRedeem,
          nav: holding.currentNav,
          transDate: todayStr,
          status: "SUCCESS",
          platform: "BSE_STAR",
        },
      });

      if (remainingUnits <= 0.001) {
        await db.holding.delete({ where: { id: holding.id } });
      } else {
        const proportion = remainingUnits / holding.units;
        const newInvested = Number((holding.investedValue * proportion).toFixed(2));
        const newCurrent = Number((remainingUnits * holding.currentNav).toFixed(2));
        await db.holding.update({
          where: { id: holding.id },
          data: {
            units: remainingUnits,
            investedValue: newInvested,
            currentValue: newCurrent,
          },
        });
      }

      await db.client.update({
        where: { id: client.id },
        data: {
          totalAum: { decrement: redeemAmount },
        },
      });

      return NextResponse.json({
        success: true,
        message: `Redemption order for ₹${redeemAmount.toLocaleString("en-IN")} (${unitsToRedeem.toFixed(3)} units) processed. Proceeds will credit to your registered bank account in T+2 business days.`,
        transaction: trans,
      });
    }

    // --- 3. SWITCH ---
    if (type === "SWITCH") {
      if (!holdingId || !destFundId) {
        return NextResponse.json({ error: "Source holding and destination fund are both required for switch." }, { status: 400 });
      }

      const sourceHolding = await db.holding.findUnique({
        where: { id: holdingId },
        include: { fund: true },
      });

      if (!sourceHolding || sourceHolding.clientId !== client.id) {
        return NextResponse.json({ error: "Source holding not found." }, { status: 404 });
      }

      const destFund = await db.fund.findUnique({ where: { id: destFundId } });
      if (!destFund) {
        return NextResponse.json({ error: "Destination fund not found." }, { status: 404 });
      }

      if (isNaN(orderAmount) || orderAmount < 1000 || orderAmount > sourceHolding.currentValue) {
        return NextResponse.json({ error: `Switch amount must be between ₹1,000 and available holding value ₹${sourceHolding.currentValue.toLocaleString("en-IN")}.` }, { status: 400 });
      }

      const sourceUnitsToDeduct = Number((orderAmount / sourceHolding.currentNav).toFixed(3));
      const destUnitsToAdd = Number((orderAmount / destFund.nav).toFixed(3));

      // Record Switch transaction
      const trans = await db.transaction.create({
        data: {
          clientId: client.id,
          folioNumber: sourceHolding.folioNumber,
          schemeName: `SWITCH: ${sourceHolding.fund.name} -> ${destFund.name}`,
          type: "SWITCH",
          amount: orderAmount,
          units: destUnitsToAdd,
          nav: destFund.nav,
          transDate: todayStr,
          status: "SUCCESS",
          platform: "BSE_STAR",
        },
      });

      // Update source holding
      const remainingUnits = sourceHolding.units - sourceUnitsToDeduct;
      if (remainingUnits <= 0.001) {
        await db.holding.delete({ where: { id: sourceHolding.id } });
      } else {
        await db.holding.update({
          where: { id: sourceHolding.id },
          data: {
            units: remainingUnits,
            currentValue: Number((remainingUnits * sourceHolding.currentNav).toFixed(2)),
          },
        });
      }

      // Upsert destination holding
      const existingDestHolding = await db.holding.findFirst({
        where: { clientId: client.id, fundId: destFund.id },
      });

      if (existingDestHolding) {
        await db.holding.update({
          where: { id: existingDestHolding.id },
          data: {
            units: existingDestHolding.units + destUnitsToAdd,
            investedValue: existingDestHolding.investedValue + orderAmount,
            currentValue: Number(((existingDestHolding.units + destUnitsToAdd) * destFund.nav).toFixed(2)),
          },
        });
      } else {
        await db.holding.create({
          data: {
            clientId: client.id,
            fundId: destFund.id,
            folioNumber: `FOLIO/${destFund.amfiCode}/${client.pan.slice(0, 4)}/${Math.floor(1000 + Math.random() * 9000)}`,
            units: destUnitsToAdd,
            avgNav: destFund.nav,
            currentNav: destFund.nav,
            investedValue: orderAmount,
            currentValue: orderAmount,
            absoluteReturn: 0.0,
            xirr: 15.0,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: `Successfully switched ₹${orderAmount.toLocaleString("en-IN")} from ${sourceHolding.fund.name} to ${destFund.name}.`,
        transaction: trans,
      });
    }

    return NextResponse.json({ error: "Unsupported operation" }, { status: 400 });
  } catch (error) {
    console.error("Order execution error:", error);
    return NextResponse.json({ error: "Failed to process investment order." }, { status: 500 });
  }
}

