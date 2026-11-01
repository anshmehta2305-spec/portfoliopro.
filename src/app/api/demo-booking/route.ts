import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, companyName, arn, selectedDate, selectedSlot } = body;

    if (!name || !email || !phone || !selectedDate || !selectedSlot) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    const booking = await db.demoBooking.create({
      data: {
        name,
        email,
        phone,
        companyName: companyName || null,
        arn: arn || null,
        selectedDate,
        selectedSlot,
        status: "CONFIRMED",
      },
    });

    // Also register in Lead Pipeline
    await db.lead.create({
      data: {
        name,
        email,
        phone,
        arn: arn || null,
        city: companyName || null,
        stage: "DEMO_SCHEDULED",
        score: 80,
        source: "BOOK_DEMO_PAGE",
        notes: `Demo booked for ${selectedDate} at ${selectedSlot}. Company: ${companyName || "N/A"}`,
      },
    });

    // Confirmation email to MFD
    await sendEmail({
      to: email,
      subject: `Demo Confirmed: Portfolio Pro Wealth Tech Walkthrough (${selectedDate})`,
      html: `
        <div style="font-family: Georgia, serif; color: #0B1F3A; padding: 24px;">
          <h2>Your Live Demo is Confirmed, ${name}</h2>
          <p>We look forward to demonstrating how Portfolio Pro can transform your distribution practice.</p>
          <div style="background: #FAF7F0; padding: 16px; border: 1px solid #B08D57; margin: 16px 0;">
            <p><strong>Date:</strong> ${selectedDate}</p>
            <p><strong>Time Slot:</strong> ${selectedSlot}</p>
            <p><strong>Format:</strong> 1-on-1 Screen Share & Live Q&A</p>
          </div>
          <p>A Google Meet calendar invite will be sent to this email address shortly.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 });
  } catch (error) {
    console.error("Demo booking error:", error);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}

