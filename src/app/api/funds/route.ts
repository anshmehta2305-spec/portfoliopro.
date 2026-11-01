import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase();
  const category = searchParams.get("category");
  const amc = searchParams.get("amc");
  const risk = searchParams.get("risk");

  try {
    const where: Record<string, unknown> = {};

    if (category && category !== "ALL") {
      where.category = category;
    }
    if (amc && amc !== "ALL") {
      where.amc = amc;
    }
    if (risk && risk !== "ALL") {
      where.riskLevel = risk;
    }

    let funds = await db.fund.findMany({
      where,
      orderBy: { threeYearReturn: "desc" },
    });

    if (search) {
      funds = funds.filter(
        (f) =>
          f.name.toLowerCase().includes(search) ||
          f.amc.toLowerCase().includes(search) ||
          f.category.toLowerCase().includes(search) ||
          f.amfiCode.includes(search)
      );
    }

    return NextResponse.json({ success: true, count: funds.length, funds });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch funds" }, { status: 500 });
  }
}

