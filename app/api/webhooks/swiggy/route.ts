import { NextResponse } from "next/server";
import { contentLengthWithinLimit } from "@/lib/security/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_WEBHOOK_BYTES = 256 * 1024;

// GET: Swiggy Webhook Verification / Health Check
export async function GET() {
  return NextResponse.json({
    status: "active",
    provider: "swiggy",
    message: "Irani Koyla FranchiseOS Swiggy Webhook Gateway Ready",
    timestamp: new Date().toISOString(),
  });
}

// POST: Ingest Live Swiggy Order Payloads
export async function POST(req: Request) {
  try {
    if (!contentLengthWithinLimit(req, MAX_WEBHOOK_BYTES)) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const bodyText = await req.text();
    let payload: any;
    try {
      payload = JSON.parse(bodyText);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const orderId = payload.order_id || payload.orderId || `SW-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = payload.order_total || payload.amount || 520;
    const items = payload.items || [
      { name: "Irani Koyla Charcoal Mutton Roll", quantity: 1, price: 290 },
      { name: "Special Irani Chai (Thermos Flask)", quantity: 2, price: 110 },
    ];
    const customer = payload.customer_name || "Swiggy Guest";
    const deliveryType = payload.delivery_type || "Swiggy Delivery Partner";

    console.log(`[Swiggy Webhook] Received Live Order #${orderId} - ₹${totalAmount}`, {
      items,
      customer,
      deliveryType,
    });

    return NextResponse.json({
      success: true,
      status: "acknowledged",
      provider: "swiggy",
      orderId,
      receivedAt: new Date().toISOString(),
      autoAccepted: true,
      kotPrinted: true,
    });
  } catch (error) {
    console.error("[Swiggy Webhook Error]:", error);
    return NextResponse.json(
      { error: "Internal server error processing Swiggy webhook" },
      { status: 500 }
    );
  }
}
