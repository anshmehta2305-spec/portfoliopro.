import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const includeUnapproved = searchParams.get("includeUnapproved") === "true";

  try {
    const testimonials = await db.testimonial.findMany({
      where: includeUnapproved ? {} : { isApproved: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { authorName, designation, companyName, location, rating, feedback } = body;

    if (!authorName || !designation || !companyName || !feedback) {
      return NextResponse.json({ error: "Please fill all required review fields" }, { status: 400 });
    }

    const testimonial = await db.testimonial.create({
      data: {
        authorName,
        designation,
        companyName,
        location: location || "India",
        rating: Number(rating) || 5,
        feedback,
        isApproved: false, // Requires admin moderation as requested
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your testimonial has been submitted and will appear upon review.",
      testimonialId: testimonial.id,
    });
  } catch (error) {
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, isApproved } = body;

    const updated = await db.testimonial.update({
      where: { id },
      data: { isApproved },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

