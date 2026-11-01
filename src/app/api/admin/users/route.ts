import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        arnCode: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, count: users.length, users });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;

    if (userRole && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 403 });
    }

    const { userId, isActive, role } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: {
        ...(typeof isActive === "boolean" && { isActive }),
        ...(role && { role }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    await db.auditLog.create({
      data: {
        userId: (session?.user as any)?.id || null,
        action: "ADMIN_USER_UPDATED",
        details: `User ${updated.email} status updated: active=${updated.isActive}, role=${updated.role}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${updated.name} updated successfully.`,
      user: updated,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}

