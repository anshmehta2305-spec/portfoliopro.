import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const {
      amfiCode,
      name,
      category,
      amc,
      nav,
      oneYearReturn = 15.0,
      threeYearReturn = 12.0,
      fiveYearReturn = 10.0,
      expenseRatio = 0.75,
      aumCrores = 5000.0,
      riskLevel = "Very High",
    } = body;

    if (!amfiCode || !name || !category || !amc || !nav) {
      return NextResponse.json({ error: "AMFI Code, Fund Name, Category, AMC, and initial NAV are required." }, { status: 400 });
    }

    const parsedNav = Number(nav);
    if (isNaN(parsedNav) || parsedNav <= 0) {
      return NextResponse.json({ error: "NAV must be a positive number." }, { status: 400 });
    }

    const todayStr = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const fund = await db.fund.create({
      data: {
        amfiCode: amfiCode.trim(),
        name: name.trim(),
        category: category.trim(),
        amc: amc.trim(),
        nav: parsedNav,
        navDate: todayStr,
        oneYearReturn: Number(oneYearReturn) || 0,
        threeYearReturn: Number(threeYearReturn) || 0,
        fiveYearReturn: Number(fiveYearReturn) || 0,
        expenseRatio: Number(expenseRatio) || 0,
        aumCrores: Number(aumCrores) || 0,
        riskLevel,
      },
    });

    // Record NAV History
    await db.navHistory.create({
      data: {
        fundId: fund.id,
        nav: parsedNav,
        navDate: todayStr,
      },
    });

    await db.auditLog.create({
      data: {
        userId: (session?.user as any)?.id || null,
        action: "FUND_CREATED",
        details: `Fund created: ${fund.name} (AMFI: ${fund.amfiCode}) with NAV ₹${parsedNav}`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Fund ${fund.name} registered successfully.`,
        fund,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A fund with this AMFI Code already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to add fund." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { fundId, newNav, navDate } = await req.json();

    if (!fundId || !newNav) {
      return NextResponse.json({ error: "fundId and newNav are required." }, { status: 400 });
    }

    const parsedNav = Number(newNav);
    if (isNaN(parsedNav) || parsedNav <= 0) {
      return NextResponse.json({ error: "NAV must be a positive number." }, { status: 400 });
    }

    const dateStr = navDate || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const updated = await db.fund.update({
      where: { id: fundId },
      data: {
        nav: parsedNav,
        navDate: dateStr,
      },
    });

    // Save to NavHistory
    await db.navHistory.create({
      data: {
        fundId,
        nav: parsedNav,
        navDate: dateStr,
      },
    });

    // Update all holdings holding this fund
    const holdings = await db.holding.findMany({ where: { fundId } });
    for (const h of holdings) {
      const newCurrentValue = Number((h.units * parsedNav).toFixed(2));
      const absReturn = Number((((newCurrentValue - h.investedValue) / h.investedValue) * 100).toFixed(2));
      await db.holding.update({
        where: { id: h.id },
        data: {
          currentNav: parsedNav,
          currentValue: newCurrentValue,
          absoluteReturn: absReturn,
        },
      });
    }

    await db.auditLog.create({
      data: {
        userId: (session?.user as any)?.id || null,
        action: "NAV_UPDATED",
        details: `NAV updated for fund ${updated.name} to ₹${parsedNav} as of ${dateStr}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `NAV for ${updated.name} updated to ₹${parsedNav}. Holdings recalculated.`,
      fund: updated,
    });
  } catch (error) {
    console.error("NAV update error:", error);
    return NextResponse.json({ error: "Failed to update NAV." }, { status: 500 });
  }
}

