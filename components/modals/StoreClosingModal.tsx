"use client";

import React, { useState } from "react";
import { useFranchise } from "@/lib/franchise-context";
import { Moon, Banknote, Flame, AlertTriangle, CheckCircle2, X, Printer } from "lucide-react";

interface StoreClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StoreClosingModal({ isOpen, onClose }: StoreClosingModalProps) {
  const { closeStoreDay, outletTenderTotals, dailySession, activeOutlet } = useFranchise();

  const [actualCashCounted, setActualCashCounted] = useState<number>(outletTenderTotals.expectedCashInDrawer);
  const [closingMeatLeftKg, setClosingMeatLeftKg] = useState<number>(2.5);
  const [managerNotes, setManagerNotes] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [zReportId, setZReportId] = useState<string>("");

  if (!isOpen) return null;

  const discrepancy = actualCashCounted - outletTenderTotals.expectedCashInDrawer;
  const isMatch = Math.abs(discrepancy) < 5;

  const handleCloseDay = (e: React.FormEvent) => {
    e.preventDefault();
    const zNum = `IK-Z-${Math.floor(10000 + Math.random() * 90000)}`;
    setZReportId(zNum);
    closeStoreDay({
      actualCashCounted,
      closingMeatLeftKg,
      notes: managerNotes,
      outletId: activeOutlet?.id,
    });
    setIsCompleted(true);
  };

  const handlePrintZReport = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#161618] border border-[#303030] p-6 shadow-2xl space-y-6 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#282828] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">🌙 End of Day Store Close (Z-Report)</h2>
              <p className="text-xs text-zinc-400">Cash Audit & Spit Reconciliation · {activeOutlet?.name || "Bandra West Flagship"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#222] hover:bg-[#333] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isCompleted ? (
          <form onSubmit={handleCloseDay} className="space-y-4">
            {/* Real-time Ledger Breakdown */}
            <div className="p-4 rounded-2xl bg-[#1f1f22] border border-[#303030] space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Opening Cash Float:</span>
                <span className="font-mono font-bold text-zinc-200">₹{outletTenderTotals.openingCash.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>+ Cash Sales Today:</span>
                <span className="font-mono font-bold text-emerald-400">+₹{outletTenderTotals.cashSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>- Petty Cash Expenses:</span>
                <span className="font-mono font-bold text-rose-400">-₹{outletTenderTotals.pettyCashExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>- Safe Drops (Vault Skims):</span>
                <span className="font-mono font-bold text-amber-400">-₹{outletTenderTotals.safeDropsTotal.toLocaleString()}</span>
              </div>
              <div className="border-t border-[#333] pt-2 flex justify-between font-bold">
                <span className="text-white">Expected Physical Cash in Drawer:</span>
                <span className="font-mono text-sm text-emerald-400 font-black">
                  ₹{outletTenderTotals.expectedCashInDrawer.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actual Physical Cash Counted */}
            <div className="p-4 rounded-2xl bg-[#1f1f22] border border-[#303030] space-y-2">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-400" />
                Actual Physical Cash Counted in Drawer (₹)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={actualCashCounted}
                onChange={(e) => setActualCashCounted(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl bg-[#161618] border border-[#383838] text-white font-mono text-base font-black focus:outline-none focus:border-emerald-500"
                required
              />

              {/* Discrepancy Status */}
              <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                isMatch ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
              }`}>
                {isMatch ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>✅ Perfect Match! ₹0 discrepancy in register.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      ⚠️ Discrepancy of {discrepancy > 0 ? `+₹${discrepancy} (Overage)` : `-₹${Math.abs(discrepancy)} (Shortage)`}.
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Closing Leftover Meat Weight */}
            <div className="p-4 rounded-2xl bg-[#1f1f22] border border-[#303030] space-y-2">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Remaining Meat Left on Spit at Close (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.1"
                  value={closingMeatLeftKg}
                  onChange={(e) => setClosingMeatLeftKg(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#161618] border border-[#383838] text-orange-400 font-mono text-sm font-black focus:outline-none focus:border-orange-500"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono">kg</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Morning spit: {dailySession.spit1MountedKg}kg &rarr; Meat carved: {(dailySession.spit1MountedKg - closingMeatLeftKg).toFixed(1)}kg.
              </p>
            </div>

            {/* Manager Notes */}
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">EOD Manager Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Clean closing, 0 food wastage, spit roasters sanitized."
                value={managerNotes}
                onChange={(e) => setManagerNotes(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#1f1f22] border border-[#303030] text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#222] hover:bg-[#2c2c30] text-zinc-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Moon className="w-4 h-4" />
                <span>Lock Day & Generate Z-Report</span>
              </button>
            </div>
          </form>
        ) : (
          /* Z-Report Summary Print View */
          <div className="space-y-4 text-center py-2 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Daily Z-Report #{zReportId} Generated!</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Store day is officially closed and archived to Brand HQ.</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1f1f22] border border-[#303030] text-xs space-y-2 text-left font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Gross Sales:</span>
                <span className="text-white font-bold">₹{outletTenderTotals.totalGrossRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Total Orders Punched:</span>
                <span className="text-white font-bold">{outletTenderTotals.totalOrdersToday} orders</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Cash Counted:</span>
                <span className="text-emerald-400 font-bold">₹{actualCashCounted.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Meat Carved:</span>
                <span className="text-orange-400 font-bold">{(dailySession.spit1MountedKg - closingMeatLeftKg).toFixed(1)} kg</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrintZReport}
                className="px-5 py-2.5 rounded-xl bg-[#28282c] hover:bg-[#333] text-zinc-200 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Z-Report Slip</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
