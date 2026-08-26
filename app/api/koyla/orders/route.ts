import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { liveOrdersDb } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const outletId = searchParams.get("outletId");

    if (!db) {
      return NextResponse.json({ success: true, source: "mock", data: [] });
    }

    let query = db.select().from(liveOrdersDb);
    if (outletId && outletId !== "all") {
      const orders = await query
        .where(eq(liveOrdersDb.outletId, outletId))
        .orderBy(desc(liveOrdersDb.createdAt))
        .limit(100);
      return NextResponse.json({ success: true, source: "database", data: orders });
    }

    const allOrders = await query.orderBy(desc(liveOrdersDb.createdAt)).limit(100);
    return NextResponse.json({ success: true, source: "database", data: allOrders });
  } catch (error: any) {
    console.error("[API Orders GET Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, orderNumber, outletId, customerName, channel, paymentMethod, itemsJson, totalAmount, status, time } = body;

    if (!id || !orderNumber || !outletId || !itemsJson || totalAmount === undefined) {
      return NextResponse.json({ success: false, error: "Missing required order fields" }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ success: true, source: "in_memory_fallback", orderId: id });
    }

    await db.insert(liveOrdersDb).values({
      id,
      orderNumber,
      outletId,
      customerName: customerName || "Counter Guest",
      channel: channel || "Walk-in Counter",
      paymentMethod: paymentMethod || "Cash",
      itemsJson: typeof itemsJson === "string" ? itemsJson : JSON.stringify(itemsJson),
      totalAmount: Math.round(Number(totalAmount)),
      status: status || "Completed",
      time: time || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    });

    return NextResponse.json({ success: true, source: "database", orderId: id });
  } catch (error: any) {
    console.error("[API Orders POST Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
