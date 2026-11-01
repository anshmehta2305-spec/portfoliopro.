import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// Indian PAN regex: 5 uppercase letters, 4 digits, 1 uppercase letter
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, pan, role = "INVESTOR", arnCode } = body;

    // 1. Required field validations
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Full Name must be at least 2 characters long." }, { status: 400 });
    }

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    // 2. Phone validation
    const cleanPhone = phone ? phone.replace(/[\s\-\+]/g, "").slice(-10) : "";
    if (cleanPhone && !PHONE_REGEX.test(cleanPhone)) {
      return NextResponse.json({ error: "Please provide a valid 10-digit Indian mobile number." }, { status: 400 });
    }

    // 3. PAN validation for investors
    const upperPan = pan ? pan.trim().toUpperCase() : "";
    if (role === "INVESTOR") {
      if (!upperPan || !PAN_REGEX.test(upperPan)) {
        return NextResponse.json({ error: "Invalid PAN format. Must be 5 letters, 4 numbers, 1 letter (e.g. ABCDE1234F)." }, { status: 400 });
      }
    }

    // 4. Duplicate checks
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    if (upperPan) {
      const existingClient = await db.client.findUnique({ where: { pan: upperPan } });
      if (existingClient) {
        return NextResponse.json({ error: "An account with this PAN already exists." }, { status: 409 });
      }
    }

    // 5. Create User & Client record
    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = role === "ADVISOR" ? "ADVISOR" : "INVESTOR";

    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: assignedRole,
        phone: cleanPhone ? `+91 ${cleanPhone}` : null,
        arnCode: assignedRole === "ADVISOR" ? (arnCode?.trim().toUpperCase() || "ARN-PENDING") : null,
        isActive: true,
      },
    });

    // If investor, create initial Client profile
    let client = null;
    if (assignedRole === "INVESTOR") {
      client = await db.client.create({
        data: {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || "+91 00000 00000",
          pan: upperPan,
          kycStatus: "PENDING",
          riskProfile: "MODERATE",
          assignedAdvisor: "ARN-189420", // Default to primary advisory desk
        },
      });

      // Welcome Notification
      await db.notification.create({
        data: {
          userId: user.id,
          title: "Welcome to Portfolio Pro!",
          message: "Your investment account is registered. Complete your online KYC to begin transacting in mutual funds.",
          type: "INFO",
        },
      });
    }

    // Audit log
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_REGISTERED",
        details: `New ${assignedRole} registered: ${user.email}`,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. You can now log in.",
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed due to a server error." }, { status: 500 });
  }
}

