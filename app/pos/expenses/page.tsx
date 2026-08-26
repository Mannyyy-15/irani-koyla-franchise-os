"use client";

import { useState } from "react";
import {
  Banknote,
  PlusCircle,
  Clock,
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowDownCircle,
  Receipt,
  FileText,
  Trash2,
  Store,
  Tag,
  Flame,
} from "lucide-react";
import { useFranchise } from "@/lib/franchise-context";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

export default function PosExpensesPage() {
  const { pettyCashList, addPettyCashExpense, outletTenderTotals, activeOutlet } = useFranchise();

  const [category, setCategory] = useState<
    "Ice & Perishables" | "Fresh Herbs & Veg" | "Cleaning Supplies" | "Staff Refreshment" | "Emergency Packaging" | "Other"
  >("Ice & Perishables");
  const [amount, setAmount] = useState<string>("150");
  const [reason, setReason] = useState<string>("");
  const [paidBy, setPaidBy] = useState<string>("Imran S. (Cashier)");
  const [toastMessage, setToastMessage] = useState<string>("");

  const quickPresets = [
    { label: "2x Ice Bags", amount: "150", category: "Ice & Perishables" as const, reason: "Crushed ice bags for beverage cooler" },
    { label: "Fresh Mint & Herbs", amount: "120", category: "Fresh Herbs & Veg" as const, reason: "Fresh mint leaves & green chillies for toum" },
    { label: "Cleaning Cloth & Soap", amount: "180", category: "Cleaning Supplies" as const, reason: "Microfiber wiping cloths & dishwash soap" },
    { label: "Staff Tea / Milk", amount: "90", category: "Staff Refreshment" as const, reason: "Milk packets for afternoon staff chai" },
    { label: "Emergency Foil & Bags", amount: "250", category: "Emergency Packaging" as const, reason: "Aluminium foil roll from local market" },
  ];

  const handleLogExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    addPettyCashExpense({
      amount: amt,
      category,
      reason: reason.trim() || `${category} emergency purchase`,
      paidBy: paidBy.trim() || "Cashier",
      outletId: activeOutlet?.id || "bandra-west",
    });

    setToastMessage(`Logged ₹${amt} expense for ${category}`);
    setTimeout(() => setToastMessage(""), 3500);

    setReason("");
  };

  const handleApplyPreset = (preset: typeof quickPresets[0]) => {
    setAmount(preset.amount);
    setCategory(preset.category);
    setReason(preset.reason);
  };

  const totalPettyOutflow = pettyCashList.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-5">
      {/* ── TOP HEADER & LIVE DRAWER LEDGER BANNER ──────────────────────── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Banknote className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-rose-400 uppercase tracking-wider">
                Cash Drawer Outflow Ledger
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              Petty Cash & Daily Minor Expenses
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {activeOutlet?.name || "Bandra West Flagship"} · Log all counter minor cash purchases so physical drawer balances 100% at night.
            </p>
          </div>

          {/* Real-Time Drawer Reconciliation Formula */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#141416] border border-[#303030]">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Opening Float</span>
              <span className="font-mono text-base font-black text-white">
                ₹{outletTenderTotals.openingCash.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#141416] border border-[#303030]">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">+ Cash Sales</span>
              <span className="font-mono text-base font-black text-emerald-400">
                +₹{outletTenderTotals.cashSales.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/30">
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">- Petty Outflow</span>
              <span className="font-mono text-base font-black text-rose-400">
                -₹{totalPettyOutflow.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">= Drawer Cash</span>
              <span className="font-mono text-base font-black text-amber-300">
                ₹{outletTenderTotals.expectedCashInDrawer.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── EXPENSE LOGGING WORKSPACE (TWO COLUMNS) ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Quick Preset Chips & Expense Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Fast Preset Buttons */}
          <div className="p-5 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-3 shadow-sm">
            <span className="text-xs font-black text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-orange-400" />
              <span>1-Click Minor Expense Presets</span>
            </span>

            <div className="space-y-1.5">
              {quickPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="w-full p-2.5 rounded-2xl bg-[#141416] border border-[#303030] hover:border-orange-500/50 hover:bg-[#1c1c20] text-left transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-orange-400 block transition-colors">
                      {preset.label}
                    </span>
                    <span className="text-[10px] text-zinc-500 block truncate max-w-[220px]">
                      {preset.reason}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                    ₹{preset.amount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Entry Form */}
          <form onSubmit={handleLogExpense} className="p-5 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-3.5 shadow-sm">
            <span className="text-xs font-black text-zinc-300 uppercase tracking-wider block">
              Log Minor Cash Outflow
            </span>

            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400">Expense Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-10 px-3 rounded-2xl bg-[#141416] border border-[#383838] text-xs text-white font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="Ice & Perishables">Ice & Perishables</option>
                <option value="Fresh Herbs & Veg">Fresh Herbs & Veg</option>
                <option value="Cleaning Supplies">Cleaning Supplies</option>
                <option value="Staff Refreshment">Staff Refreshment</option>
                <option value="Emergency Packaging">Emergency Packaging</option>
                <option value="Other">Other Minor Purchase</option>
              </select>
            </div>

            {/* Amount Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400">Amount Paid from Drawer (₹)</label>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-[#141416] border-2 border-rose-500/40 font-mono text-lg font-black text-rose-400 focus:outline-none focus:border-rose-500 transition-colors shadow-inner"
              />
            </div>

            {/* Reason / Memo */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400">Purpose / Receipt Memo</label>
              <input
                type="text"
                placeholder="e.g. 2 bags of ice from ice plant"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-10 px-3 rounded-2xl bg-[#141416] border border-[#383838] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Paid By Cashier */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400">Cashier / Staff Name</label>
              <input
                type="text"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                className="w-full h-10 px-3 rounded-2xl bg-[#141416] border border-[#383838] text-xs text-white font-medium focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/30 gap-2 cursor-pointer mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Petty Cash Outflow</span>
            </Button>
          </form>
        </div>

        {/* RIGHT COLUMN: Chronological Petty Cash Ledger Table (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#27272a] bg-[#161618] flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-300">
              Today&apos;s Petty Cash Outflow Log ({pettyCashList.length})
            </span>
            <span className="font-mono font-bold text-zinc-300">
              Total Outflow: <strong className="text-rose-400 text-sm">-₹{totalPettyOutflow.toLocaleString("en-IN")}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#27272a] bg-[#141416] text-zinc-400 font-black uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-4">Time & Staff</th>
                  <th className="py-4 px-4">Category & Purpose</th>
                  <th className="py-4 px-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a] text-xs">
                {pettyCashList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-16 text-center text-zinc-500 font-medium">
                      No petty cash expenses recorded today.
                    </td>
                  </tr>
                ) : (
                  pettyCashList.map((item) => (
                    <tr key={item.id} className="hover:bg-[#202024] transition-colors">
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-1.5 text-zinc-200 font-bold text-xs">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{item.timestamp}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">
                          {item.paidBy}
                        </span>
                      </td>

                      <td className="py-4 px-4 align-top space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[#252528] text-zinc-300 border border-[#383838]">
                          {item.category}
                        </span>
                        <p className="text-xs text-zinc-200 font-medium leading-tight">
                          {item.reason}
                        </p>
                      </td>

                      <td className="py-4 px-4 align-top text-right">
                        <span className="font-mono text-base font-black text-rose-400 block">
                          -₹{item.amount.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono block">
                          Cash Float
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
