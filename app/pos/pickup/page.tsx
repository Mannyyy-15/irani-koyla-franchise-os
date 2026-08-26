"use client";

import { useState } from "react";
import {
  Bike,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Phone,
  Car,
  PackageCheck,
  X,
  Filter,
  ArrowRight,
  TrendingUp,
  KeyRound,
  ShoppingBag,
} from "lucide-react";
import { useFranchise } from "@/lib/franchise-context";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { cn } from "@/components/ui/cn";
import { RiderPickupOrder } from "@/lib/mock-data";

export default function PosRiderPickupPage() {
  const { riderOrders, verifyRiderOtp, updateRiderStatus, activeOutlet } = useFranchise();

  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");

  // OTP Modal State
  const [selectedOrderForOtp, setSelectedOrderForOtp] = useState<RiderPickupOrder | null>(null);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccessMsg, setOtpSuccessMsg] = useState("");

  const outletRiders = activeOutlet
    ? (riderOrders || []).filter((r) => r.outletId === activeOutlet.id)
    : (riderOrders || []);

  const filteredRiders = outletRiders.filter((rdr) => {
    const matchesSearch =
      rdr.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      rdr.riderName.toLowerCase().includes(search.toLowerCase()) ||
      rdr.customerName.toLowerCase().includes(search.toLowerCase()) ||
      rdr.bagToken.toLowerCase().includes(search.toLowerCase()) ||
      rdr.vehicleNumber.toLowerCase().includes(search.toLowerCase());

    const matchesChannel = channelFilter === "all" || rdr.channel === channelFilter;
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? rdr.status !== "Handed Over"
        : rdr.status === statusFilter;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  const activeCount = outletRiders.filter((r) => r.status !== "Handed Over").length;
  const arrivedCount = (riderOrders || []).filter((r) => r.status === "Rider Arrived").length;
  const completedCount = (riderOrders || []).filter((r) => r.status === "Handed Over").length;

  const handleOpenOtpModal = (order: RiderPickupOrder) => {
    setSelectedOrderForOtp(order);
    setEnteredOtp("");
    setOtpError("");
    setOtpSuccessMsg("");
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedOrderForOtp) return;

    if (enteredOtp.length < 4) {
      setOtpError("Please enter all 4 digits of the rider OTP.");
      return;
    }

    const result = verifyRiderOtp(selectedOrderForOtp.id, enteredOtp);
    if (result.success) {
      setOtpSuccessMsg(result.message);
      setOtpError("");
      setTimeout(() => {
        setSelectedOrderForOtp(null);
      }, 1200);
    } else {
      setOtpError(result.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── TOP HEADER & RIDER STATS BANNER ──────────────────────────────── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Bike className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-orange-400 uppercase tracking-wider">
                Counter Dispatch Station
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              Zomato & Swiggy Rider Pickup Board
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {activeOutlet?.name || "Bandra West Flagship"} · Real-time rider ETA tracking & anti-mixup OTP verification
            </p>
          </div>

          {/* Quick Counter Badges */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#141416] border border-[#303030] min-w-[110px]">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Pending Bags</span>
              <span className="font-mono text-xl font-black text-white">{activeCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 min-w-[110px]">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">At Counter</span>
              <span className="font-mono text-xl font-black text-emerald-400">{arrivedCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141416] border border-[#303030] min-w-[110px]">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Handed Over</span>
              <span className="font-mono text-xl font-black text-zinc-300">{completedCount}</span>
            </div>
          </div>
        </div>

        {/* ── FILTER & SEARCH BAR ────────────────────────────────────────── */}
        <div className="pt-3 border-t border-[#2a2a2c] flex flex-wrap items-center justify-between gap-3">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#141416] p-1.5 rounded-2xl border border-[#303030]">
            {[
              { id: "active", label: `Active Queue (${activeCount})` },
              { id: "Rider Arrived", label: `At Counter (${arrivedCount})` },
              { id: "Handed Over", label: `Handed Over (${completedCount})` },
              { id: "all", label: "All Deliveries" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer",
                  statusFilter === tab.id
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                    : "text-zinc-400 hover:text-white hover:bg-[#202024]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 flex-1 max-w-md">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order #, rider name, bag token..."
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

            {/* Channel Filter */}
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="h-10 px-3 rounded-2xl bg-[#141416] border border-[#383838] text-xs text-zinc-200 font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">All Channels</option>
              <option value="Zomato">Zomato Only</option>
              <option value="Swiggy">Swiggy Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── RIDER PICKUP CARDS GRID ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredRiders.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-3xl bg-[#1a1a1c] border border-[#2e2e30]">
            <PackageCheck className="w-12 h-12 mx-auto text-zinc-600 mb-2 opacity-50" />
            <p className="text-sm font-bold text-zinc-300">No delivery riders in queue</p>
            <p className="text-xs text-zinc-500 mt-1">When Zomato or Swiggy orders arrive, they will appear here live.</p>
          </div>
        ) : (
          filteredRiders.map((order) => {
            const isArrived = order.status === "Rider Arrived";
            const isHandedOver = order.status === "Handed Over";
            const isPreparing = order.status === "Preparing";

            return (
              <div
                key={order.id}
                className={cn(
                  "p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 shadow-sm",
                  isArrived
                    ? "bg-[#1f1a16] border-emerald-500/60 shadow-emerald-950/30 ring-1 ring-emerald-500/30"
                    : isHandedOver
                    ? "bg-[#141416] border-[#27272a] opacity-70"
                    : "bg-[#1a1a1c] border-[#303030] hover:border-[#404040]"
                )}
              >
                {/* Header: Bag Token & Channel Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black bg-[#252528] px-2.5 py-1 rounded-xl text-orange-400 border border-[#383838]">
                      {order.bagToken}
                    </span>
                    <span className="font-mono text-sm font-black text-white">
                      {order.orderNumber}
                    </span>
                  </div>

                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider border",
                      order.channel === "Zomato"
                        ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                        : "bg-orange-500/15 text-orange-400 border-orange-500/30"
                    )}
                  >
                    {order.channel}
                  </span>
                </div>

                {/* Live ETA Banner */}
                <div
                  className={cn(
                    "p-3 rounded-2xl border flex items-center justify-between",
                    isArrived
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 animate-pulse"
                      : isHandedOver
                      ? "bg-[#161618] border-[#27272a] text-zinc-400"
                      : order.etaMinutes <= 3
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                      : "bg-[#141416] border-[#27272a] text-zinc-300"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-black">
                      {isArrived
                        ? "Rider Arrived at Counter!"
                        : isHandedOver
                        ? `Handed Over at ${order.handedOverAt || "Earlier"}`
                        : `Rider ${order.etaMinutes} mins away — Wrap ready?`}
                    </span>
                  </div>
                  {!isHandedOver && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                      {isArrived ? "Action Needed" : "In Transit"}
                    </span>
                  )}
                </div>

                {/* Rider Details & Bike Plate */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-[#141416] border border-[#27272a] text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Bike className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{order.riderName}</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                      <Car className="w-3 h-3 text-zinc-500" />
                      {order.vehicleNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="text-zinc-500">Customer: <strong className="text-zinc-300 font-medium">{order.customerName}</strong></span>
                    <span className="text-zinc-500">{order.riderPhone}</span>
                  </div>
                </div>

                {/* Items in Bag List */}
                <div className="space-y-1 py-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Packed Items ({order.items.length}):
                  </span>
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-zinc-200">
                      <span className="truncate">{it.quantity}x {it.name}</span>
                    </div>
                  ))}
                </div>

                {/* Action: OTP Verification / Handoff */}
                <div className="pt-2 border-t border-[#27272a]">
                  {isHandedOver ? (
                    <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Delivery Dispatched</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleOpenOtpModal(order)}
                      className={cn(
                        "w-full h-11 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all",
                        isArrived
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30"
                          : "bg-[#252528] hover:bg-orange-600 text-zinc-200 hover:text-white"
                      )}
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Verify Rider OTP & Hand Over</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── MODAL: Anti-Mixup Rider 4-Digit OTP Verification ────────────────── */}
      {selectedOrderForOtp && (
        <Dialog open={true} onOpenChange={() => setSelectedOrderForOtp(null)}>
          <DialogContent className="max-w-md bg-[#18181b] border border-[#383838] text-white p-6 rounded-3xl shadow-2xl space-y-4">
            <DialogHeader className="pb-3 border-b border-[#2d2d30] flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <DialogTitle className="text-base font-black text-white">
                  Verify {selectedOrderForOtp.channel} Rider OTP
                </DialogTitle>
              </div>
            </DialogHeader>

            {/* Bag Match Banner */}
            <div className="p-4 rounded-2xl bg-[#141416] border border-[#303030] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Hand Over Bag</span>
                <span className="font-mono text-2xl font-black text-orange-400">{selectedOrderForOtp.bagToken}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Order #</span>
                <span className="font-mono text-base font-black text-white">{selectedOrderForOtp.orderNumber}</span>
              </div>
            </div>

            {/* Rider Identity Check */}
            <div className="p-3 rounded-2xl bg-[#202024] border border-[#303030] text-xs space-y-1">
              <div className="flex justify-between font-bold text-zinc-200">
                <span>Rider: {selectedOrderForOtp.riderName}</span>
                <span className="font-mono text-zinc-400">{selectedOrderForOtp.vehicleNumber}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Customer: {selectedOrderForOtp.customerName}</span>
                <span>{selectedOrderForOtp.riderPhone}</span>
              </div>
            </div>

            {/* OTP Input Form */}
            <form onSubmit={handleVerifyOtp} className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Ask Rider for 4-Digit Delivery Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={4}
                    autoFocus
                    placeholder="• • • •"
                    value={enteredOtp}
                    onChange={(e) => {
                      setEnteredOtp(e.target.value);
                      setOtpError("");
                    }}
                    className="w-full h-14 text-center font-mono text-2xl font-black tracking-[0.5em] rounded-2xl bg-[#121214] border-2 border-emerald-500/60 text-emerald-400 focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 text-center font-mono">
                  [Demo OTP Code: <strong className="text-zinc-400">{selectedOrderForOtp.otp}</strong>]
                </p>
              </div>

              {otpError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              {otpSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{otpSuccessMsg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForOtp(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#27272a] hover:bg-[#333] text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={enteredOtp.length < 4}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Bag Handoff</span>
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
