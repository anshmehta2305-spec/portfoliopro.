import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { maskPAN } from "@/lib/masking";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const client = await db.client.findUnique({
      where: { id },
      include: {
        holdings: { include: { fund: true } },
        sips: { include: { fund: true } },
        transactions: { orderBy: { createdAt: "desc" } },
        goals: true,
        documents: true,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      client: {
        ...client,
        maskedPan: maskPAN(client.pan),
      },
    });
  } catch (error) {
    console.error("Fetch client detail error:", error);
    return NextResponse.json({ error: "Failed to fetch client details." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { phone, riskProfile, kycStatus, name } = body;

    const existing = await db.client.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const updated = await db.client.update({
      where: { id },
      data: {
        ...(phone && { phone }),
        ...(riskProfile && { riskProfile }),
        ...(kycStatus && { kycStatus }),
        ...(name && { name }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Client profile updated successfully.",
      client: updated,
    });
  } catch (error) {
    console.error("Update client error:", error);
    return NextResponse.json({ error: "Failed to update client." }, { status: 500 });
  }
}
