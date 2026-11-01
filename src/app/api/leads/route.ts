import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");

  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (format === "csv") {
      const headers = "ID,Name,Email,Phone,ARN,City,Stage,Score,Source,CreatedAt\n";
      const rows = leads
        .map(
          (l) =>
            `"${l.id}","${l.name}","${l.email}","${l.phone}","${l.arn || ""}","${l.city || ""}","${l.stage}",${l.score},"${l.source}","${l.createdAt.toISOString()}"`
        )
        .join("\n");

      return new Response(headers + rows, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="portfolio-pro-leads.csv"',
        },
      });
    }

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, mobile, phone, arn, city, interestedIn, source, notes } = body;

    const contactPhone = mobile || phone;
    if (!name || !email || !contactPhone) {
      return NextResponse.json({ error: "Name, email, and mobile are required" }, { status: 400 });
    }

    // Lead scoring logic
    let score = 40;
    if (arn && arn.trim().length > 3) score += 30; // Real MFD ARN
    if (interestedIn && interestedIn.length > 2) score += 20; // High intent
    if (city && ["Mumbai", "Delhi", "Bengaluru", "Ahmedabad", "Pune", "Kolkata", "Chennai"].includes(city)) score += 10;

    const interestString = Array.isArray(interestedIn) ? interestedIn.join(", ") : (interestedIn || "");

    const lead = await db.lead.create({
      data: {
        name,
        email,
        phone: contactPhone,
        arn: arn || null,
        city: city || null,
        interestedIn: interestString,
        stage: "NEW",
        score,
        source: source || "CONTACT_PAGE",
        notes: notes || null,
      },
    });

    // Auto-confirmation email to the Lead
    await sendEmail({
      to: email,
      subject: "Welcome to Portfolio Pro - Wealth Tech Platform Brochure & Next Steps",
      html: `
        <div style="font-family: Georgia, serif; color: #0B1F3A; padding: 24px;">
          <h2 style="color: #0B1F3A;">Thank you for connecting with Portfolio Pro, ${name}!</h2>
          <p>We received your interest in our white-labeled mutual fund software and MFD technology suite.</p>
          <p>Our senior wealth tech consultant will reach out to you within one business day to discuss how you can scale your AUM, digitize client onboarding via e-Mandates, and streamline BSE StarMF execution.</p>
          <p style="margin-top: 24px; font-style: italic; color: #B08D57;">"Invest Smarter. Grow Together."</p>
          <hr style="border: 1px solid #D9D4C7;" />
          <p style="font-size: 11px; color: #777;">Portfolio Pro Technologies Private Limited | AMFI Registered</p>
        </div>
      `,
    });

    // Sales Alert
    await sendEmail({
      to: process.env.SALES_EMAIL || "sales@portfoliopro.in",
      subject: `[NEW HOT LEAD: Score ${score}] ${name} (${contactPhone})`,
      html: `
        <h3>New Lead Registered</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${contactPhone}</p>
        <p><strong>ARN:</strong> ${arn || "N/A"}</p>
        <p><strong>City:</strong> ${city || "N/A"}</p>
        <p><strong>Interested In:</strong> ${interestString}</p>
        <p><strong>Lead Score:</strong> ${score}/100</p>
      `,
    });

    return NextResponse.json({ success: true, leadId: lead.id, score }, { status: 201 });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}

