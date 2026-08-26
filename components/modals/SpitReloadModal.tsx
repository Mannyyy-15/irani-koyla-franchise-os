"use client";

import React, { useState } from "react";
import { useFranchise } from "@/lib/franchise-context";
import { Flame, CheckCircle2, X, PlusCircle, Scale, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SpitReloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpitReloadModal({ isOpen, onClose }: SpitReloadModalProps) {
  const { addSpitMeatReload, dailySession, activeOutlet } = useFranchise();

  const [quantityKg, setQuantityKg] = useState<number>(20);
  const [meatType, setMeatType] = useState<string>("Chicken Koyla Marinated");
  const [batchCode, setBatchCode] = useState<string>("MB-20260826-01");
  const [addedBy, setAddedBy] = useState<string>(dailySession.spitMasterName || "Chef Raheem");
  const [notes, setNotes] = useState<string>("Spit ran empty; mounted fresh batch cone");
  const [successMsg, setSuccessMsg] = useState<string>("");

  if (!isOpen) return null;

  const quickPresets = [15, 20, 25, 30];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantityKg || quantityKg <= 0) return;

    addSpitMeatReload({
      quantityKg,
      meatType,
      batchCode,
      addedBy,
      notes,
    });

    setSuccessMsg(`Mounted +${quantityKg}kg fresh ${meatType} cone onto spit!`);
    setTimeout(() => {
      setSuccessMsg("");
      onClose();
    }, 1200);
  };

  const initialKg = dailySession.spitMountedKg || dailySession.spit1MountedKg || 28.0;
  const previousReloads = (dailySession.spitReloads || []).reduce((sum, r) => sum + r.quantityKg, 0);
  const currentTotal = initialKg + previousReloads;
  const newTotalAfterThis = currentTotal + (quantityKg || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#161618] border border-[#303030] p-6 shadow-2xl space-y-5 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#282828] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">🍗 Mount / Reload Meat onto Spit</h2>
              <p className="text-xs text-zinc-400">Add fresh cone when spit gets empty · {activeOutlet?.name || "Bandra West Flagship"}</p>
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

        {/* Live Spit Load Summary */}
        <div className="p-4 rounded-2xl bg-[#1f1f22] border border-[#303030] flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block">Spit Loaded Today</span>
            <span className="font-mono text-base font-black text-white">{currentTotal.toFixed(1)} kg</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-orange-400 uppercase tracking-wider font-bold block">After This Reload</span>
            <span className="font-mono text-base font-black text-orange-400">+{quantityKg}kg &rarr; {newTotalAfterThis.toFixed(1)} kg</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quantity Input with Quick Chips */}
          <div className="p-4 rounded-2xl bg-[#1f1f22] border border-[#303030] space-y-2.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-orange-400" />
                <span>Quantity to Mount (kg)</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">1 Cone = 15kg to 30kg</span>
            </label>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  min="1"
                  max="60"
                  step="0.5"
                  required
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Number(e.target.value))}
                  className="w-full h-11 px-4 rounded-xl bg-[#161618] border-2 border-orange-500/40 font-mono text-xl font-black text-orange-400 focus:outline-none focus:border-orange-500 transition-colors shadow-inner"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-zinc-400">kg</span>
              </div>

              {/* 1-Click Preset Chips */}
              <div className="flex gap-1.5 shrink-0">
                {quickPresets.map((kg) => (
                  <button
                    key={kg}
                    type="button"
                    onClick={() => setQuantityKg(kg)}
                    className="px-2.5 py-2 rounded-xl bg-[#28282c] hover:bg-orange-600/20 text-zinc-300 hover:text-orange-400 text-xs font-mono font-bold transition-colors cursor-pointer border border-[#383838]"
                  >
                    +{kg}kg
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Meat Type & Batch Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400">Meat Type</label>
              <select
                value={meatType}
                onChange={(e) => setMeatType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#1f1f22] border border-[#383838] text-xs text-white font-bold focus:outline-none focus:border-orange-500"
              >
                <option value="Chicken Koyla Marinated">Chicken Koyla Marinated</option>
                <option value="Smoked Mutton Cone">Smoked Mutton Cone</option>
                <option value="Peri-Peri Chicken">Peri-Peri Chicken</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400">Central Batch Code</label>
              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#1f1f22] border border-[#383838] text-xs text-zinc-200 font-mono font-bold focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Spit Master / Staff Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400">Spit Master / Chef on Duty</label>
            <input
              type="text"
              value={addedBy}
              onChange={(e) => setAddedBy(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#1f1f22] border border-[#383838] text-xs text-zinc-200 font-bold focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#222] hover:bg-[#2c2c30] text-zinc-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-black shadow-lg shadow-orange-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Confirm Spit Reload (+{quantityKg}kg)</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
