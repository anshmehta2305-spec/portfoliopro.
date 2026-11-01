import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateGoalSIP } from "@/lib/calculators";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const client = session?.user?.email
      ? await db.client.findFirst({ where: { email: session.user.email } })
      : await db.client.findFirst();

    if (!client) {
      return NextResponse.json({ goals: [] });
    }

    const goals = await db.goal.findMany({
      where: { clientId: client.id },
      orderBy: { targetYear: "asc" },
    });

    return NextResponse.json({ success: true, goals });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { title, category = "WEALTH", targetAmount, currentAmount = 0, targetYear, clientId: targetClientId } = body;

    if (!title || title.trim().length < 2) {
      return NextResponse.json({ error: "Goal title must be at least 2 characters." }, { status: 400 });
    }

    const target = Number(targetAmount);
    if (isNaN(target) || target <= 0) {
      return NextResponse.json({ error: "Target amount must be a positive number." }, { status: 400 });
    }

    const currentYear = new Date().getFullYear();
    const year = Number(targetYear);
    if (isNaN(year) || year <= currentYear) {
      return NextResponse.json({ error: `Target year must be in the future (after ${currentYear}).` }, { status: 400 });
    }

    let client = null;
    if (targetClientId) {
      client = await db.client.findUnique({ where: { id: targetClientId } });
    } else if (session?.user?.email) {
      client = await db.client.findFirst({ where: { email: session.user.email } });
    } else {
      client = await db.client.findFirst();
    }

    if (!client) {
      return NextResponse.json({ error: "Client profile not found" }, { status: 404 });
    }

    const yearsLeft = year - currentYear;
    // Calculate required monthly SIP assuming conservative 12% equity return
    const sipCalculation = calculateGoalSIP({
      targetAmount: target,
      currentSavings: Number(currentAmount) || 0,
      yearsToGoal: yearsLeft,
      expectedReturnPercent: 12,
    });

    const goal = await db.goal.create({
      data: {
        clientId: client.id,
        title: title.trim(),
        category,
        targetAmount: target,
        currentAmount: Number(currentAmount) || 0,
        targetYear: year,
        monthlySipRequired: sipCalculation.requiredMonthlySIP,
        status: "ON_TRACK",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Goal '${title}' saved. Recommended SIP: ₹${sipCalculation.requiredMonthlySIP.toLocaleString("en-IN")}/mo.`,
      goal,
    });
  } catch (error) {
    console.error("Create goal error:", error);
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}

