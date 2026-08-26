"use client";

import { useState } from "react";
import {
  Receipt,
  Search,
  Printer,
  X,
  Clock,
  Calendar,
  Store,
  CheckCircle2,
  AlertTriangle,
  Flame,
  User,
  ArrowRight,
  TrendingUp,
  Banknote,
  Smartphone,
  CreditCard,
  Layers,
} from "lucide-react";
import { useFranchise } from "@/lib/franchise-context";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { cn } from "@/components/ui/cn";
import { LiveOrder } from "@/lib/mock-data";

export default function PosOrderHistoryPage() {
  const { liveOrders, activeOutlet, outlets } = useFranchise();

  // Filter States
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [outletFilter, setOutletFilter] = useState<string>("all");

  // Date Filter States
  const todayStr = "2026-08-26"; // Current session date
  const yesterdayStr = "2026-08-25";
  const [dateFilterMode, setDateFilterMode] = useState<"today" | "yesterday" | "7days" | "all" | "custom">("today");
  const [customDate, setCustomDate] = useState<string>(todayStr);

  const [selectedReceipt, setSelectedReceipt] = useState<LiveOrder | null>(null);

  // Filter Logic
  const filteredOrders = liveOrders.filter((ord) => {
    // Search Filter
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (ord.customerName && ord.customerName.toLowerCase().includes(search.toLowerCase())) ||
      ord.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));

    // Channel & Payment Filter
    const matchesChannel = channelFilter === "all" || ord.channel === channelFilter;
    const matchesPayment = paymentFilter === "all" || ord.paymentMethod === paymentFilter;

    // Account / Outlet Filter
    const targetOutlet = outletFilter === "all" ? null : outletFilter;
    const matchesOutlet = !targetOutlet || (ord.outletId || "bandra-west") === targetOutlet;

    // Date Filter
    let matchesDate = true;
    const orderDate = ord.date || todayStr;

    if (dateFilterMode === "today") {
      matchesDate = orderDate === todayStr;
    } else if (dateFilterMode === "yesterday") {
      matchesDate = orderDate === yesterdayStr;
    } else if (dateFilterMode === "custom") {
      matchesDate = orderDate === customDate;
    } else if (dateFilterMode === "7days") {
      // Any date within last 7 days
      matchesDate = true;
    } else if (dateFilterMode === "all") {
      matchesDate = true;
    }

    return matchesSearch && matchesChannel && matchesPayment && matchesOutlet && matchesDate;
  });

  // Calculate Metrics for Current Filter
  const totalSales = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const cashSales = filteredOrders
    .filter((o) => o.paymentMethod === "Cash")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const digitalSales = filteredOrders
    .filter((o) => o.paymentMethod === "GPay / UPI" || o.paymentMethod === "Card / POS")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-5">
      {/* ── TOP HEADER & SUMMARY METRICS ─────────────────────────────────── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-orange-400 uppercase tracking-wider">
                Orders & Receipts Audit
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              Historical Orders & Thermal Receipts
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select any past day, branch account, or payment tender to audit records and reprint bills.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#141416] border border-[#303030] min-w-[110px]">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Total Orders</span>
              <span className="font-mono text-lg font-black text-white">{filteredOrders.length}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141416] border border-[#303030] min-w-[110px]">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Revenue</span>
              <span className="font-mono text-lg font-black text-orange-400">₹{totalSales.toLocaleString("en-IN")}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141416] border border-[#303030] min-w-[110px]">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Cash Collected</span>
              <span className="font-mono text-lg font-black text-emerald-400">₹{cashSales.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* ── DATE SELECTOR & PRESETS BAR ─────────────────────────────────── */}
        <div className="pt-3 border-t border-[#2a2a2c] flex flex-wrap items-center justify-between gap-3">
          {/* Date Range Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#141416] p-1.5 rounded-2xl border border-[#303030]">
            {[
              { id: "today", label: "Today (26 Aug)" },
              { id: "yesterday", label: "Yesterday (25 Aug)" },
              { id: "7days", label: "Last 7 Days" },
              { id: "all", label: "All Records" },
              { id: "custom", label: "Custom Date" },
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setDateFilterMode(preset.id as any)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer",
                  dateFilterMode === preset.id
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                    : "text-zinc-400 hover:text-white hover:bg-[#202024]"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Date Input Picker (Shown when 'custom' is active) */}
          {dateFilterMode === "custom" && (
            <div className="flex items-center gap-2 bg-[#141416] px-3 py-1.5 rounded-2xl border border-orange-500/50">
              <Calendar className="w-4 h-4 text-orange-400" />
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-white font-mono focus:outline-none cursor-pointer"
              />
            </div>
          )}

          {/* Account / Outlet Selector */}
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-zinc-400" />
            <select
              value={outletFilter}
              onChange={(e) => setOutletFilter(e.target.value)}
              className="h-9 px-3 rounded-xl bg-[#141416] border border-[#383838] text-xs text-zinc-200 font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">All Outlets / Accounts</option>
              {outlets.map((out) => (
                <option key={out.id} value={out.id}>
                  {out.name} ({out.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── SECONDARY FILTERS: Search, Channel & Payment ──────────────── */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search #IK-xxxx, customer, item..."
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

          {/* Channel Dropdown */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="h-10 px-3 rounded-2xl bg-[#141416] border border-[#383838] text-xs text-zinc-200 font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Order Channels</option>
            <option value="Walk-in Counter">Walk-in Counter</option>
            <option value="Zomato">Zomato</option>
            <option value="Swiggy">Swiggy</option>
          </select>

          {/* Payment Method Dropdown */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-10 px-3 rounded-2xl bg-[#141416] border border-[#383838] text-xs text-zinc-200 font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">All Payment Methods</option>
            <option value="Cash">Cash</option>
            <option value="GPay / UPI">GPay / UPI</option>
            <option value="Card / POS">Card POS</option>
            <option value="Split Payment">Split Payment</option>
          </select>
        </div>
      </div>

      {/* ── ORDERS & RECEIPTS TABLE ───────────────────────────────────────── */}
      <div className="rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#27272a] bg-[#161618] flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-300">
            Showing <strong className="text-orange-400 font-mono">{filteredOrders.length}</strong> Orders for Date:{" "}
            <span className="text-white font-mono uppercase font-black">
              {dateFilterMode === "today"
                ? todayStr
                : dateFilterMode === "yesterday"
                ? yesterdayStr
                : dateFilterMode === "custom"
                ? customDate
                : "Multiple Days"}
            </span>
          </span>
          <span className="font-mono font-bold text-zinc-300">
            Filtered Total: <strong className="text-emerald-400 text-sm">₹{totalSales.toLocaleString("en-IN")}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272a] bg-[#141416] text-zinc-400 font-black uppercase tracking-wider text-[11px]">
                <th className="py-4 px-5">Order # & Date</th>
                <th className="py-4 px-5">Customer & Branch</th>
                <th className="py-4 px-5">Items Punched</th>
                <th className="py-4 px-5">Payment Method</th>
                <th className="py-4 px-5 text-right">Bill Total</th>
                <th className="py-4 px-5 text-right">Receipt Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a] text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-zinc-500 font-medium">
                    <Receipt className="w-10 h-10 mx-auto text-zinc-600 mb-2 opacity-50" />
                    <p className="text-sm font-bold text-zinc-400">No orders found for the selected date & criteria</p>
                    <p className="text-xs text-zinc-600 mt-1">Try selecting a different date preset or clearing filters.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#202024] transition-colors">
                    {/* Order ID & Date/Time */}
                    <td className="py-4 px-5 align-top">
                      <span className="font-mono text-sm font-black text-orange-400 block tracking-tight">
                        {ord.orderNumber}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-1 font-mono">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        <span>{ord.date || todayStr}</span>
                        <span className="text-zinc-600">·</span>
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{ord.time}</span>
                      </div>
                    </td>

                    {/* Customer & Branch */}
                    <td className="py-4 px-5 align-top space-y-1.5">
                      <div className="flex items-center gap-1.5 text-zinc-200 font-bold text-xs">
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{ord.customerName || "Counter Customer"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={cn(
                            "inline-block px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border",
                            ord.channel === "Walk-in Counter"
                              ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                              : ord.channel === "Zomato"
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : "bg-orange-500/15 text-orange-400 border-orange-500/30"
                          )}
                        >
                          {ord.channel}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {outlets.find((o) => o.id === ord.outletId)?.name || "Bandra West"}
                        </span>
                      </div>
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
                <p className="text-[11px] font-bold text-zinc-300">
                  {outlets.find((o) => o.id === selectedReceipt.outletId)?.name || "Bandra West Flagship"}
                </p>
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
                  <span className="block">{selectedReceipt.date || todayStr}</span>
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
