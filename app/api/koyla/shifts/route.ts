import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shiftRegistersDb } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const outletId = searchParams.get("outletId");

    if (!db) {
      return NextResponse.json({ success: true, source: "mock", data: [] });
    }

    let query = db.select().from(shiftRegistersDb);
    if (outletId && outletId !== "all") {
      const shifts = await query
        .where(eq(shiftRegistersDb.outletId, outletId))
        .orderBy(desc(shiftRegistersDb.createdAt))
        .limit(30);
      return NextResponse.json({ success: true, source: "database", data: shifts });
    }

    const allShifts = await query.orderBy(desc(shiftRegistersDb.createdAt)).limit(30);
    return NextResponse.json({ success: true, source: "database", data: allShifts });
  } catch (error: any) {
    console.error("[API Shifts GET Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      outletId,
      date,
      shiftType,
      cashierName,
      openingCash,
      cashSalesExpected,
      cashInDrawerActual,
      cashDifference,
      upiSales,
      swiggySales,
      zomatoSales,
      posCardSales,
      pettyCashExpenses,
      totalOrders,
      totalGrossSales,
      discountsGiven,
      netRevenue,
      status,
      reconciledAt,
    } = body;

    if (!id || !outletId || !cashierName) {
      return NextResponse.json({ success: false, error: "Missing required shift register fields" }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ success: true, source: "in_memory_fallback", shiftId: id });
    }

    await db.insert(shiftRegistersDb).values({
      id,
      outletId,
      date: date || new Date().toISOString().split("T")[0],
      shiftType: shiftType || "Full Day Register",
      cashierName,
      openingCash: Math.round(Number(openingCash || 2000)),
      cashSalesExpected: Math.round(Number(cashSalesExpected || 0)),
      cashInDrawerActual: Math.round(Number(cashInDrawerActual || 0)),
      cashDifference: Math.round(Number(cashDifference || 0)),
      upiSales: Math.round(Number(upiSales || 0)),
      swiggySales: Math.round(Number(swiggySales || 0)),
      zomatoSales: Math.round(Number(zomatoSales || 0)),
      posCardSales: Math.round(Number(posCardSales || 0)),
      pettyCashExpenses: Math.round(Number(pettyCashExpenses || 0)),
      totalOrders: Math.round(Number(totalOrders || 0)),
      totalGrossSales: Math.round(Number(totalGrossSales || 0)),
      discountsGiven: Math.round(Number(discountsGiven || 0)),
      netRevenue: Math.round(Number(netRevenue || 0)),
      status: status || "reconciled",
      reconciledAt: reconciledAt || new Date().toISOString(),
    });

    return NextResponse.json({ success: true, source: "database", shiftId: id });
  } catch (error: any) {
    console.error("[API Shifts POST Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
