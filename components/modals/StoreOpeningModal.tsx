"use client";

import React, { useState } from "react";
import { useFranchise } from "@/lib/franchise-context";
import { Sun, Banknote, Flame, Users, CheckCircle2, X } from "lucide-react";

interface StoreOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StoreOpeningModal({ isOpen, onClose }: StoreOpeningModalProps) {
  const { startFreshDay, activeOutlet } = useFranchise();

  const [openingFloat, setOpeningFloat] = useState<number>(2000);
  const [spit1MountedKg, setSpit1MountedKg] = useState<number>(28.0);
  const [spit2MountedKg, setSpit2MountedKg] = useState<number>(15.0);
  const [cashierName, setCashierName] = useState<string>("Imran Siddiqui");
  const [spitMasterName, setSpitMasterName] = useState<string>("Chef Raheem");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startFreshDay({
      openingFloat,
      spit1MountedKg,
      spit2MountedKg,
      cashierName,
      spitMasterName,
      outletId: activeOutlet?.id,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#161618] border border-[#303030] p-6 shadow-2xl space-y-6 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#282828] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">☀️ Open Store & Set Morning Float</h2>
              <p className="text-xs text-zinc-400">Start fresh daily session · {activeOutlet?.name || "Bandra West Flagship"}</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cash Drawer Float */}
          <div className="p-4 rounded-2xl bg-[#1f1f22] border border-[#303030] space-y-2">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-400" />
              Opening Physical Cash Float in Register (₹)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="100"
                value={openingFloat}
                onChange={(e) => setOpeningFloat(Number(e.target.value))}
                className="w-full h-11 px-3.5 rounded-xl bg-[#161618] border border-[#383838] text-emerald-400 font-mono text-base font-black focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
              <div className="flex gap-1.5 shrink-0">
                {[1000, 2000, 3000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setOpeningFloat(amt)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#28282c] hover:bg-emerald-600/20 text-zinc-300 hover:text-emerald-300 text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-zinc-500">Initial change in notes (10s, 20s, 50s, 100s) counted into the drawer.</p>
          </div>

          {/* Spit Mounting Weights */}
          <div className="p-4 rounded-2xl bg-[#1f1f22] border border-[#303030] space-y-3">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              Morning Spit Meat Cones Mounted (kg)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">Spit #1 (Chicken Koyla)</span>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="60"
                    step="0.5"
                    value={spit1MountedKg}
                    onChange={(e) => setSpit1MountedKg(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#383838] text-orange-400 font-mono text-sm font-black focus:outline-none focus:border-orange-500"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono">kg</span>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">Spit #2 (Peri-Peri / Mutton)</span>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    step="0.5"
                    value={spit2MountedKg}
                    onChange={(e) => setSpit2MountedKg(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#383838] text-amber-400 font-mono text-sm font-black focus:outline-none focus:border-amber-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono">kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shift Staff On Duty */}
          <div className="p-4 rounded-2xl bg-[#1f1f22] border border-[#303030] space-y-3">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              Opening Shift Staff
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">Register Cashier</span>
                <input
                  type="text"
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#383838] text-zinc-200 text-xs font-bold focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">Lead Spit Master</span>
                <input
                  type="text"
                  value={spitMasterName}
                  onChange={(e) => setSpitMasterName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#383838] text-zinc-200 text-xs font-bold focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-black shadow-lg shadow-orange-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Fire Up Spits & Open Store</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
