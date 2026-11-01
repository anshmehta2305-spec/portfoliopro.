import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    let notifications: any[] = [];
    if (userId) {
      notifications = await db.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
    } else {
      // Fallback for demo
      notifications = await db.notification.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      });
    }

    return NextResponse.json({
      success: true,
      unreadCount: notifications.filter((n) => !n.isRead).length,
      notifications,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, markAll } = await req.json();
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (markAll && userId) {
      await db.notification.updateMany({
        where: { userId },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: "All notifications marked as read." });
    }

    if (id) {
      await db.notification.update({
        where: { id },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: "Notification marked as read." });
    }

    return NextResponse.json({ error: "Invalid request parameters." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notification status." }, { status: 500 });
  }
}

