import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword, confirmPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: "Email and new password are required." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long." }, { status: 400 });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      // Return 200 for security to prevent user enumeration
      return NextResponse.json({
        success: true,
        message: "If an account with this email exists, password update instructions have been processed.",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "PASSWORD_RESET",
        details: `Password reset successfully for ${user.email}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully. Please log in with your new credentials.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}

