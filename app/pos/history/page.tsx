"use client";

import { useState } from "react";
import {
  Receipt,
  Search,
  Printer,
  X,
  FileText,
  CreditCard,
  ShoppingBag,
  Clock,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  User,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useFranchise } from "@/lib/franchise-context";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { cn } from "@/components/ui/cn";
import { LiveOrder } from "@/lib/mock-data";

export default function PosOrderHistoryPage() {
  const { liveOrders, activeOutlet } = useFranchise();
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [selectedReceipt, setSelectedReceipt] = useState<LiveOrder | null>(null);
  const [voidOrder, setVoidOrder] = useState<LiveOrder | null>(null);
  const [voidReason, setVoidReason] = useState("");

  const filteredOrders = liveOrders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (ord.customerName && ord.customerName.toLowerCase().includes(search.toLowerCase())) ||
      ord.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchesChannel = channelFilter === "all" || ord.channel === channelFilter;
    const matchesPayment = paymentFilter === "all" || ord.paymentMethod === paymentFilter;
    return matchesSearch && matchesChannel && matchesPayment;
  });

  const totalSales = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Fast Register Summary */}
      <div className="p-5 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-xs font-black text-orange-400 uppercase tracking-wider">
              Orders & Receipts Ledger
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Live Tickets, Cash Ledger & Reprints
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {activeOutlet?.name || "Bandra West Flagship"} · Real-time tickets recorded today
          </p>
        </div>

        {/* Live Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search #IK-xxxx, customer, shawarma..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-2xl bg-[#141416] border border-[#383838] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-medium transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="h-10 px-3 rounded-2xl bg-[#141416] border border-[#383838] text-xs text-zinc-200 font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="Walk-in Counter">Walk-in Counter</option>
            <option value="Zomato">Zomato</option>
            <option value="Swiggy">Swiggy</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-10 px-3 rounded-2xl bg-[#141416] border border-[#383838] text-xs text-zinc-200 font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Payments</option>
            <option value="Cash">Cash</option>
            <option value="GPay / UPI">GPay / UPI</option>
            <option value="Card / POS">Card POS</option>
            <option value="Split Payment">Split Payment</option>
          </select>
        </div>
      </div>

      {/* Large Visible Orders Table */}
      <div className="rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#27272a] bg-[#161618] flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-300">
            Showing <strong className="text-orange-400 font-mono">{filteredOrders.length}</strong> Punched Orders
          </span>
          <span className="font-mono font-bold text-zinc-300">
            Filtered Total: <strong className="text-emerald-400 text-sm">₹{totalSales.toLocaleString("en-IN")}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272a] bg-[#141416] text-zinc-400 font-black uppercase tracking-wider text-[11px]">
                <th className="py-4 px-5">Order # & Timestamp</th>
                <th className="py-4 px-5">Customer & Channel</th>
                <th className="py-4 px-5">Items Punched</th>
                <th className="py-4 px-5">Payment Method</th>
                <th className="py-4 px-5 text-right">Bill Total</th>
                <th className="py-4 px-5 text-right">Receipt Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a] text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 font-medium">
                    No orders matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#202024] transition-colors">
                    {/* Order ID & Time */}
                    <td className="py-4 px-5 align-top">
                      <span className="font-mono text-sm font-black text-orange-400 block tracking-tight">
                        {ord.orderNumber}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-1 font-medium">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{ord.time}</span>
                      </div>
                    </td>

                    {/* Customer & Channel */}
                    <td className="py-4 px-5 align-top space-y-1.5">
                      <div className="flex items-center gap-1.5 text-zinc-200 font-bold text-xs">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{ord.customerName || "Counter Customer"}</span>
                      </div>
                      <span
                        className={cn(
                          "inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border",
                          ord.channel === "Walk-in Counter"
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            : ord.channel === "Zomato"
                            ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                            : "bg-orange-500/15 text-orange-400 border-orange-500/30"
                        )}
                      >
                        {ord.channel}
                      </span>
                    </td>

                    {/* Items Punched (Large & Clear) */}
                    <td className="py-4 px-5 align-top max-w-sm">
                      <div className="space-y-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-baseline gap-2 text-zinc-200 text-xs leading-relaxed">
                            <span className="font-mono font-black text-orange-400 bg-[#252528] px-1.5 py-0.5 rounded border border-[#383838] text-[11px] shrink-0">
                              {it.quantity}x
                            </span>
                            <span className="font-semibold">{it.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-5 align-top">
                      <span
                        className={cn(
                          "inline-block px-3 py-1 rounded-xl text-xs font-black font-mono border",
                          ord.paymentMethod === "Cash"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : ord.paymentMethod === "GPay / UPI"
                            ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                            : ord.paymentMethod === "Card / POS"
                            ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                            : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        )}
                      >
                        {ord.paymentMethod}
                      </span>
                    </td>

                    {/* Bill Total (Large Bold) */}
                    <td className="py-4 px-5 align-top text-right">
                      <span className="font-mono text-base font-black text-white block">
                        ₹{ord.totalAmount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                        Completed
                      </span>
                    </td>

                    {/* Action: View & Reprint Thermal Bill */}
                    <td className="py-4 px-5 align-top text-right">
                      <Button
                        size="sm"
                        onClick={() => setSelectedReceipt(ord)}
                        className="h-9 px-3.5 rounded-xl bg-[#28282c] hover:bg-orange-600 text-zinc-200 hover:text-white text-xs font-bold gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Bill</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL: Large High-Contrast Thermal Receipt View ─────────────────────── */}
      {selectedReceipt && (
        <Dialog open={true} onOpenChange={() => setSelectedReceipt(null)}>
          <DialogContent className="max-w-md bg-[#18181b] border border-[#383838] text-white p-6 rounded-3xl shadow-2xl">
            <DialogHeader className="pb-3 border-b border-[#2d2d30] flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-orange-400" />
                <DialogTitle className="text-base font-black text-white">
                  Thermal Receipt #{selectedReceipt.orderNumber}
                </DialogTitle>
              </div>
            </DialogHeader>

            {/* Printable Paper Card */}
            <div id="reprint-thermal-slip" className="p-5 rounded-2xl bg-[#0f0f10] border border-[#2d2d30] font-mono text-xs text-zinc-100 space-y-4">
              {/* Receipt Brand Header */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-zinc-700">
                <h3 className="text-base font-black text-orange-400">IRANI KOYLA SHAWARMA</h3>
                <p className="text-[11px] font-bold text-zinc-300">{activeOutlet?.name || "Bandra West Flagship"}</p>
                <p className="text-[10px] text-zinc-500">Shop 1-2, Mohak City Plaza, Central Spine</p>
                <p className="text-[10px] text-zinc-500">GSTIN: 27AABCI4920F1ZV | FSSAI: 11524008000492</p>
              </div>

              {/* Order Meta */}
              <div className="flex justify-between text-[11px] text-zinc-300 pb-2 border-b border-dashed border-zinc-700">
                <div>
                  <span className="block font-bold text-white">Order: {selectedReceipt.orderNumber}</span>
                  <span className="text-zinc-400">Cust: {selectedReceipt.customerName}</span>
                </div>
                <div className="text-right">
                  <span className="block">{new Date().toLocaleDateString("en-IN")}</span>
                  <span className="text-zinc-400">{selectedReceipt.time}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 py-1">
                {selectedReceipt.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white">{it.quantity}x {it.name}</span>
                    </div>
                    <span className="font-bold text-zinc-200">₹{(it.quantity * it.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-2 border-t-2 border-dashed border-zinc-700 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-zinc-300">
                  <span>Payment Tender:</span>
                  <span className="text-emerald-400">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-white pt-1">
                  <span>GRAND TOTAL:</span>
                  <span className="text-orange-400 text-base">₹{selectedReceipt.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-2 border-t border-dashed border-zinc-800 text-[10px] text-zinc-500">
                <p>Thank you for dining at Irani Koyla!</p>
                <p>Spit Roasted over 100% Natural Hardwood Charcoal</p>
              </div>
            </div>

            {/* Print Trigger Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setSelectedReceipt(null)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Close
              </Button>
              <Button
                onClick={handlePrint}
                className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs px-5 rounded-xl shadow-lg shadow-orange-600/30 gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Thermal Receipt</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
