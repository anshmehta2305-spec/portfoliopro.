import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { maskPAN } from "@/lib/masking";
import bcrypt from "bcryptjs";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("q")?.toLowerCase();

    // Determine querying identity
    const userRole = (session?.user as any)?.role || "PUBLIC";
    const userArn = (session?.user as any)?.arnCode;
    const userEmail = session?.user?.email;

    let whereClause: any = {};

    if (userRole === "ADVISOR") {
      // Distributor isolation: strictly clients assigned to this advisor's ARN
      whereClause.assignedAdvisor = userArn || "ARN-189420";
    } else if (userRole === "INVESTOR") {
      // Investor can only see their own client
      whereClause.email = userEmail;
    } else if (userRole !== "ADMIN") {
      // Allow demo query or require login
      const advisorFilter = searchParams.get("arn");
      if (advisorFilter) {
        whereClause.assignedAdvisor = advisorFilter;
      }
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { pan: { contains: search.toUpperCase() } },
      ];
    }

    const clients = await db.client.findMany({
      where: whereClause,
      include: {
        sips: true,
        holdings: { include: { fund: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const sanitizedClients = clients.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      maskedPan: maskPAN(c.pan),
      pan: c.pan,
      kycStatus: c.kycStatus,
      riskProfile: c.riskProfile,
      totalAum: c.totalAum,
      totalCost: c.totalCost,
      xirr: c.xirr,
      assignedAdvisor: c.assignedAdvisor,
      activeSipCount: c.sips.length,
      holdingCount: c.holdings.length,
    }));

    return NextResponse.json({
      success: true,
      count: sanitizedClients.length,
      clients: sanitizedClients,
    });
  } catch (error) {
    console.error("Fetch clients error:", error);
    return NextResponse.json({ error: "Failed to fetch clients." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { name, email, phone, pan, riskProfile = "MODERATE", assignedAdvisor } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Client Name must be at least 2 characters." }, { status: 400 });
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const upperPan = pan ? pan.trim().toUpperCase() : "";
    if (!upperPan || !PAN_REGEX.test(upperPan)) {
      return NextResponse.json({ error: "Valid 10-character PAN is required (e.g. ABCDE1234F)." }, { status: 400 });
    }

    // Check duplicate
    const existing = await db.client.findFirst({
      where: {
        OR: [{ email: email.trim().toLowerCase() }, { pan: upperPan }],
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Client with this Email or PAN already exists." }, { status: 409 });
    }

    // Determine advisor ARN
    const advisorArn = (session?.user as any)?.arnCode || assignedAdvisor || "ARN-189420";

    // Create user account for client
    const defaultPassword = await bcrypt.hash("password123", 10);
    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash: defaultPassword,
        role: "INVESTOR",
        phone: phone || "+91 98000 00000",
        isActive: true,
      },
    });

    // Create Client
    const client = await db.client.create({
      data: {
        userId: user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone || "+91 98000 00000",
        pan: upperPan,
        kycStatus: "VERIFIED",
        riskProfile,
        assignedAdvisor: advisorArn,
        totalAum: 0,
        totalCost: 0,
        xirr: 0,
      },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "CLIENT_ONBOARDED",
        details: `Advisor ${advisorArn} onboarded client ${name} (${upperPan})`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Client onboarded successfully. Default password is 'password123'.",
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          maskedPan: maskPAN(client.pan),
          assignedAdvisor: client.assignedAdvisor,
          kycStatus: client.kycStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Client onboarding failed." }, { status: 500 });
  }
}
