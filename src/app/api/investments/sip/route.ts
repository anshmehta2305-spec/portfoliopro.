import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { fundId, amount, sipDate = 10, clientId: targetClientId } = body;

    if (!fundId) {
      return NextResponse.json({ error: "Mutual Fund selection is required." }, { status: 400 });
    }

    const sipAmount = Number(amount);
    if (isNaN(sipAmount) || sipAmount < 500) {
      return NextResponse.json({ error: "Minimum SIP amount is ₹500." }, { status: 400 });
    }

    const day = Number(sipDate);
    if (isNaN(day) || day < 1 || day > 28) {
      return NextResponse.json({ error: "SIP execution date must be between 1 and 28." }, { status: 400 });
    }

    // Resolve client
    let client = null;
    if (targetClientId) {
      client = await db.client.findUnique({ where: { id: targetClientId } });
    } else if (session?.user?.email) {
      client = await db.client.findFirst({ where: { email: session.user.email } });
    } else {
      // Fallback to first verified client for test demo
      client = await db.client.findFirst();
    }

    if (!client) {
      return NextResponse.json({ error: "Client profile not found." }, { status: 404 });
    }

    const fund = await db.fund.findUnique({ where: { id: fundId } });
    if (!fund) {
      return NextResponse.json({ error: "Selected mutual fund does not exist." }, { status: 404 });
    }

    const folioNumber = `FOLIO/${fund.amfiCode}/${client.pan.slice(0, 4)}/${Math.floor(1000 + Math.random() * 9000)}`;
    const mandateId = `BSE_EMAND_${Math.floor(100000 + Math.random() * 900000)}`;

    // Create SIP
    const sip = await db.sIP.create({
      data: {
        clientId: client.id,
        fundId: fund.id,
        folioNumber,
        amount: sipAmount,
        frequency: "MONTHLY",
        sipDate: day,
        startDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        nextExecutionDate: `${String(day).padStart(2, "0")}-Dec-2026`,
        status: "ACTIVE",
        mandateId,
      },
    });

    // Create initial execution transaction
    const units = Number((sipAmount / fund.nav).toFixed(3));
    await db.transaction.create({
      data: {
        clientId: client.id,
        folioNumber,
        schemeName: fund.name,
        type: "SIP",
        amount: sipAmount,
        units,
        nav: fund.nav,
        transDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        status: "SUCCESS",
        platform: "BSE_STAR",
      },
    });

    // Upsert holding
    const existingHolding = await db.holding.findFirst({
      where: { clientId: client.id, fundId: fund.id },
    });

    if (existingHolding) {
      const newUnits = existingHolding.units + units;
      const newInvested = existingHolding.investedValue + sipAmount;
      const newCurrent = Number((newUnits * fund.nav).toFixed(2));
      const absReturn = Number((((newCurrent - newInvested) / newInvested) * 100).toFixed(2));

      await db.holding.update({
        where: { id: existingHolding.id },
        data: {
          units: newUnits,
          investedValue: newInvested,
          currentValue: newCurrent,
          currentNav: fund.nav,
          absoluteReturn: absReturn,
        },
      });
    } else {
      await db.holding.create({
        data: {
          clientId: client.id,
          fundId: fund.id,
          folioNumber,
          units,
          avgNav: fund.nav,
          currentNav: fund.nav,
          investedValue: sipAmount,
          currentValue: sipAmount,
          absoluteReturn: 0.0,
          xirr: 15.0,
        },
      });
    }

    // Update client AUM
    await db.client.update({
      where: { id: client.id },
      data: {
        totalAum: { increment: sipAmount },
        totalCost: { increment: sipAmount },
      },
    });

    // Create Notification
    if (client.userId) {
      await db.notification.create({
        data: {
          userId: client.userId,
          title: "New SIP Mandate Registered",
          message: `SIP of ₹${sipAmount.toLocaleString("en-IN")}/month initiated in ${fund.name}. Next debit date is ${day}th of month.`,
          type: "SUCCESS",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: `SIP of ₹${sipAmount.toLocaleString("en-IN")}/month successfully activated for ${fund.name}.`,
        sip,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SIP creation error:", error);
    return NextResponse.json({ error: "Failed to create SIP." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { sipId, status } = await req.json();
    if (!sipId || !status || !["ACTIVE", "PAUSED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Valid sipId and status (ACTIVE, PAUSED, CANCELLED) are required." }, { status: 400 });
    }

    const updated = await db.sIP.update({
      where: { id: sipId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: `SIP status changed to ${status}.`,
      sip: updated,
    });
  } catch (error) {
    console.error("SIP update error:", error);
    return NextResponse.json({ error: "Failed to update SIP." }, { status: 500 });
  }
}

