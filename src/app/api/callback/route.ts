import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, arn, city } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and Phone are mandatory" }, { status: 400 });
    }

    const callback = await db.callbackRequest.create({
      data: {
        name,
        phone,
        city: city || null,
        status: "PENDING",
      },
    });

    // Also register or update Lead pipeline
    await db.lead.create({
      data: {
        name,
        email: `${phone.replace(/\D/g, "")}@callback-lead.in`,
        phone,
        arn: arn || null,
        city: city || null,
        stage: "NEW",
        score: arn ? 70 : 50,
        source: "HERO_CALLBACK_FORM",
        notes: `Call back requested by ${name}. ARN: ${arn || "Not provided"}. City: ${city || "N/A"}`,
      },
    });

    // Send notification to Sales
    await sendEmail({
      to: process.env.SALES_EMAIL || "sales@portfoliopro.in",
      subject: `[PRIORITY CALLBACK] ${name} (${phone})`,
      html: `
        <h2>New Call Back Request Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>ARN:</strong> ${arn || "None"}</p>
        <p><strong>City:</strong> ${city || "None"}</p>
        <p>Timestamp: ${new Date().toLocaleString()}</p>
      `,
    });

    return NextResponse.json({ success: true, callbackId: callback.id });
  } catch (error) {
    console.error("Callback API error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

