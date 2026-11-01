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

    const limit = Number(req.nextUrl.searchParams.get("limit")) || 50;

    const logs = await db.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { email: true, name: true, role: true } },
      },
    });

    return NextResponse.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch audit logs." }, { status: 500 });
  }
}

