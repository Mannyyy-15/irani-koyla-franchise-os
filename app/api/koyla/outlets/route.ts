import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { franchiseOutlets } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ success: true, source: "mock", data: [] });
    }

    const outlets = await db.select().from(franchiseOutlets);
    return NextResponse.json({ success: true, source: "database", data: outlets });
  } catch (error: any) {
    console.error("[API Outlets GET Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
