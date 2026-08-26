import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { meatBatchesDb } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const outletId = searchParams.get("outletId");

    if (!db) {
      return NextResponse.json({ success: true, source: "mock", data: [] });
    }

    let query = db.select().from(meatBatchesDb);
    if (outletId && outletId !== "all") {
      const batches = await query
        .where(eq(meatBatchesDb.outletId, outletId))
        .orderBy(desc(meatBatchesDb.createdAt))
        .limit(50);
      return NextResponse.json({ success: true, source: "database", data: batches });
    }

    const allBatches = await query.orderBy(desc(meatBatchesDb.createdAt)).limit(50);
    return NextResponse.json({ success: true, source: "database", data: allBatches });
  } catch (error: any) {
    console.error("[API Batches GET Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      batchNumber,
      outletId,
      meatType,
      spitId,
      date,
      timeLoaded,
      rawMeatReceivedKg,
      marinationLossKg,
      skewerWeightKg,
      cookedWeightKg,
      wrapsProduced,
      jumboWrapsProduced,
      plattersProduced,
      wasteScrapsKg,
      targetYieldKg,
      actualYieldPercent,
      coreTempCelsius,
      status,
      loggedBy,
      notes,
    } = body;

    if (!id || !batchNumber || !outletId) {
      return NextResponse.json({ success: false, error: "Missing required batch fields" }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ success: true, source: "in_memory_fallback", batchId: id });
    }

    await db.insert(meatBatchesDb).values({
      id,
      batchNumber,
      outletId,
      meatType: meatType || "Koyla Marinated Chicken",
      spitId: spitId || "Spit-01 (Main Front)",
      date: date || new Date().toISOString().split("T")[0],
      timeLoaded: timeLoaded || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      rawMeatReceivedKg: Number(rawMeatReceivedKg || 0),
      marinationLossKg: Number(marinationLossKg || 0),
      skewerWeightKg: Number(skewerWeightKg || 0),
      cookedWeightKg: Number(cookedWeightKg || 0),
      wrapsProduced: Number(wrapsProduced || 0),
      jumboWrapsProduced: Number(jumboWrapsProduced || 0),
      plattersProduced: Number(plattersProduced || 0),
      wasteScrapsKg: Number(wasteScrapsKg || 0),
      targetYieldKg: Number(targetYieldKg || 0),
      actualYieldPercent: Number(actualYieldPercent || 0),
      coreTempCelsius: Number(coreTempCelsius || 78.5),
      status: status || "roasting",
      loggedBy: loggedBy || "Master Spit Carver",
      notes: notes || "",
    });

    return NextResponse.json({ success: true, source: "database", batchId: id });
  } catch (error: any) {
    console.error("[API Batches POST Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
