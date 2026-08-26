"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Plus,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  Award,
  Calendar,
  X,
  Droplets,
  Bug,
  Users,
  Search,
  Flame,
  Moon,
  Sun,
  ClipboardCheck,
  Lock,
  Banknote,
  Utensils,
  Store,
} from "lucide-react";
import { useFranchise } from "@/lib/franchise-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { cn } from "@/components/ui/cn";

export default function CompliancePage() {
  const { filteredCompliance, outlets, updateCompliance, selectedOutletId, role, activeOutlet } = useFranchise();
  const isSuperAdmin = role === "SUPER_ADMIN";

  const [activeTab, setActiveTab] = useState<"opening" | "closing" | "history">("opening");
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [checklistCompletedMsg, setChecklistCompletedMsg] = useState("");

  // ── MORNING OPENING CHECKLIST STATE ──────────────────────────────────────
  const [openingFreezerTemp, setOpeningFreezerTemp] = useState("-18.8");
  const [openingChillerTemp, setOpeningChillerTemp] = useState("3.2");
  const [openingSpit1Weight, setOpeningSpit1Weight] = useState("32.5");
  const [openingSpit2Weight, setOpeningSpit2Weight] = useState("18.0");
  const [openingOilTpm, setOpeningOilTpm] = useState("14.0");
  const [openingCashFloatChecked, setOpeningCashFloatChecked] = useState(true);
  const [openingStaffGrooming, setOpeningStaffGrooming] = useState(true);
  const [openingFssaiDisplay, setOpeningFssaiDisplay] = useState(true);
  const [openingManagerSign, setOpeningManagerSign] = useState("Farhan Q. (Outlet Mgr)");

  // ── NIGHT CLOSING CHECKLIST STATE ────────────────────────────────────────
  const [closingCoalExtinguished, setClosingCoalExtinguished] = useState(true);
  const [closingMeatWeighed, setClosingMeatWeighed] = useState("4.2");
  const [closingKitchenSanitized, setClosingKitchenSanitized] = useState(true);
  const [closingCashCounted, setClosingCashCounted] = useState(true);
  const [closingZReportDone, setClosingZReportDone] = useState(true);
  const [closingShutterLocked, setClosingShutterLocked] = useState(true);
  const [closingManagerSign, setClosingManagerSign] = useState("Farhan Q. (Outlet Mgr)");

  // Standard Audit Modal State
  const [outletId, setOutletId] = useState(selectedOutletId === "all" ? "bandra-west" : selectedOutletId);
  const [inspectedBy, setInspectedBy] = useState("QA Officer Natasha");
  const [deepFreezerTemp, setDeepFreezerTemp] = useState("-18.6");
  const [chillerTemp, setChillerTemp] = useState("3.4");
  const [spitCoreTemp, setSpitCoreTemp] = useState("78.2");
  const [oilPolarCompound, setOilPolarCompound] = useState("15.2");
  const [fssaiDisplay, setFssaiDisplay] = useState(true);
  const [staffHairnets, setStaffHairnets] = useState(true);
  const [pestControl, setPestControl] = useState(true);
  const [waterQuality, setWaterQuality] = useState(true);
  const [remarks, setRemarks] = useState("All kitchen workstations sanitized, food temperature compliant.");

  const handleMorningChecklistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetO = activeOutlet || outlets[0];

    updateCompliance({
      outletId: targetO.id,
      outletName: targetO.name,
      inspectedBy: `${openingManagerSign} (Opening Audit)`,
      deepFreezerTemp: parseFloat(openingFreezerTemp) || -18.8,
      chillerTemp: parseFloat(openingChillerTemp) || 3.2,
      spitCoreTemp: 78.5,
      oilPolarCompoundPercent: parseFloat(openingOilTpm) || 14.0,
      fssaiDisplayVerified: openingFssaiDisplay,
      staffHairnetsGloves: openingStaffGrooming,
      pestControlVerified: true,
      waterQualityTested: true,
      remarks: `Morning Opening 2-Min Audit: Float ₹2000 OK, Spit 1 (${openingSpit1Weight}kg), Spit 2 (${openingSpit2Weight}kg).`,
    });

    setChecklistCompletedMsg("Morning Opening Audit Verified & Signed Off! Ready for trading.");
    setTimeout(() => setChecklistCompletedMsg(""), 4000);
  };

  const handleNightChecklistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetO = activeOutlet || outlets[0];

    updateCompliance({
      outletId: targetO.id,
      outletName: targetO.name,
      inspectedBy: `${closingManagerSign} (Closing EOD Audit)`,
      deepFreezerTemp: parseFloat(openingFreezerTemp) || -18.8,
      chillerTemp: parseFloat(openingChillerTemp) || 3.2,
      spitCoreTemp: 76.0,
      oilPolarCompoundPercent: parseFloat(openingOilTpm) || 14.0,
      fssaiDisplayVerified: true,
      staffHairnetsGloves: true,
      pestControlVerified: true,
      waterQualityTested: true,
      remarks: `Night Closing EOD Audit: Coal extinguished, ${closingMeatWeighed}kg leftover meat in cold storage, Z-Report signed, shutter locked.`,
    });

    setChecklistCompletedMsg("Night Closing Audit Signed Off! Store securely closed.");
    setTimeout(() => setChecklistCompletedMsg(""), 4000);
  };

  const handleAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetO = outlets.find((o) => o.id === outletId) || outlets[0];
    updateCompliance({
      outletId: targetO.id,
      outletName: targetO.name,
      inspectedBy,
      deepFreezerTemp: parseFloat(deepFreezerTemp) || -18.5,
      chillerTemp: parseFloat(chillerTemp) || 3.5,
      spitCoreTemp: parseFloat(spitCoreTemp) || 78.0,
      oilPolarCompoundPercent: parseFloat(oilPolarCompound) || 16.0,
      fssaiDisplayVerified: fssaiDisplay,
      staffHairnetsGloves: staffHairnets,
      pestControlVerified: pestControl,
      waterQualityTested: waterQuality,
      remarks,
    });

    setShowAddModal(false);
  };

  const displayedCompliance = filteredCompliance.filter((c) => {
    return (
      c.outletName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.inspectedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.date.includes(searchQuery)
    );
  });

  return (
    <div className="space-y-6">
      {/* ── TOP HEADER ─────────────────────────────────────────────────────── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                Store Operations Quality Control
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              Daily Store Opening & Closing Audit Checklists
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {activeOutlet?.name || "Bandra West Flagship"} · 2-minute digital checklist for store managers before opening & closing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#28282c] hover:bg-[#333] text-zinc-200 hover:text-white font-bold text-xs gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Full Quality Audit</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs: Morning Opening / Night Closing / Audit History */}
        <div className="pt-3 border-t border-[#2a2a2c] flex flex-wrap items-center gap-2">
          {[
            { id: "opening", label: "🌅 Morning Store Opening (2-Min)", icon: Sun },
            { id: "closing", label: "🌙 Night Store Closing (2-Min)", icon: Moon },
            { id: "history", label: "📋 FSSAI Audit Log History", icon: FileCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30"
                  : "bg-[#141416] text-zinc-400 border border-[#303030] hover:text-white"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {checklistCompletedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{checklistCompletedMsg}</span>
        </div>
      )}

      {/* ── TAB 1: MORNING STORE OPENING 2-MIN CHECKLIST ──────────────────── */}
      {activeTab === "opening" && (
        <form onSubmit={handleMorningChecklistSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Temperatures & Spit Weights (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-4 shadow-sm">
              <span className="text-xs font-black text-orange-400 uppercase tracking-wider flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                <span>1. Critical Temperature Telemetry Check</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#141416] border border-[#303030] space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-300 block">Deep Freezer (≤ -18°C)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={openingFreezerTemp}
                      onChange={(e) => setOpeningFreezerTemp(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#1d1d20] border border-[#383838] font-mono text-sm font-black text-white focus:outline-none focus:border-orange-500"
                    />
                    <span className="text-xs text-zinc-400 font-bold">°C</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold block">✓ Safe Frozen Storage</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#141416] border border-[#303030] space-y-1.5">
                  <label className="text-[11px] font-bold text-zinc-300 block">Cold Chiller (1°C - 4.5°C)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={openingChillerTemp}
                      onChange={(e) => setOpeningChillerTemp(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#1d1d20] border border-[#383838] font-mono text-sm font-black text-white focus:outline-none focus:border-orange-500"
                    />
                    <span className="text-xs text-zinc-400 font-bold">°C</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold block">✓ Marinated Cones Safe</span>
                </div>
              </div>

              {/* Spit Mounting Weights */}
              <div className="pt-2 border-t border-[#2a2a2c] space-y-3">
                <span className="text-xs font-black text-orange-400 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  <span>2. Spit Roaster Mounting Weights</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#141416] border border-[#303030] space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-300 block">Spit #1 Chicken (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={openingSpit1Weight}
                      onChange={(e) => setOpeningSpit1Weight(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#1d1d20] border border-[#383838] font-mono text-sm font-black text-orange-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#141416] border border-[#303030] space-y-1.5">
                    <label className="text-[11px] font-bold text-zinc-300 block">Spit #2 Special (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={openingSpit2Weight}
                      onChange={(e) => setOpeningSpit2Weight(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#1d1d20] border border-[#383838] font-mono text-sm font-black text-orange-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Oil Quality, Float & Grooming Verification (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-4 shadow-sm">
              <span className="text-xs font-black text-orange-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>3. Food Safety, Float & Staff Compliance</span>
              </span>

              <div className="space-y-2.5">
                {/* Fryer Oil Polar Compounds */}
                <div className="p-3.5 rounded-2xl bg-[#141416] border border-[#303030] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Fryer Oil Polar Compound (TPM ≤ 24%)</span>
                    <span className="text-[10px] text-zinc-400">Tested via digital oil tester</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={openingOilTpm}
                      onChange={(e) => setOpeningOilTpm(e.target.value)}
                      className="w-16 h-9 px-2 text-center rounded-xl bg-[#1d1d20] border border-[#383838] font-mono text-xs font-black text-emerald-400 focus:outline-none"
                    />
                    <span className="text-xs text-zinc-400 font-bold">%</span>
                  </div>
                </div>

                {/* Cash Float Verification */}
                <label className="p-3.5 rounded-2xl bg-[#141416] border border-[#303030] flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Counter Cash Float (₹2,000 Verified)</span>
                    <span className="text-[10px] text-zinc-400">Physical ₹10, ₹20, ₹50, ₹100 change in till</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={openingCashFloatChecked}
                    onChange={(e) => setOpeningCashFloatChecked(e.target.checked)}
                    className="w-5 h-5 rounded-lg accent-orange-600 cursor-pointer"
                  />
                </label>

                {/* Staff Grooming & Hairnets */}
                <label className="p-3.5 rounded-2xl bg-[#141416] border border-[#303030] flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Staff Uniform, Hairnets & Gloves</span>
                    <span className="text-[10px] text-zinc-400">Clean aprons, trimmed nails, head caps on</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={openingStaffGrooming}
                    onChange={(e) => setOpeningStaffGrooming(e.target.checked)}
                    className="w-5 h-5 rounded-lg accent-orange-600 cursor-pointer"
                  />
                </label>

                {/* FSSAI Display Board */}
                <label className="p-3.5 rounded-2xl bg-[#141416] border border-[#303030] flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">FSSAI License & Hygiene Rating Display</span>
                    <span className="text-[10px] text-zinc-400">Prominently visible at customer counter</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={openingFssaiDisplay}
                    onChange={(e) => setOpeningFssaiDisplay(e.target.checked)}
                    className="w-5 h-5 rounded-lg accent-orange-600 cursor-pointer"
                  />
                </label>
              </div>

              {/* Manager Digital Signature */}
              <div className="pt-2 border-t border-[#2a2a2c] space-y-2">
                <label className="text-[11px] font-bold text-zinc-400">Store Manager Sign-off</label>
                <input
                  type="text"
                  value={openingManagerSign}
                  onChange={(e) => setOpeningManagerSign(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#383838] text-xs text-white font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-600/30 gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Sign Off Morning Opening</span>
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* ── TAB 2: NIGHT STORE CLOSING 2-MIN CHECKLIST ────────────────────── */}
      {activeTab === "closing" && (
        <form onSubmit={handleNightChecklistSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Fire Extinguishing & Leftover Meat (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-4 shadow-sm">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4" />
                <span>1. Hardwood Charcoal & Fire Safety Protocol</span>
              </span>

              <div className="space-y-3">
                <label className="p-4 rounded-2xl bg-[#141416] border border-[#303030] flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Coal Embers Extinguished & Ash Chute Sealed</span>
                    <span className="text-[10px] text-zinc-400">Zero glowing coals, fire damper closed tight</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={closingCoalExtinguished}
                    onChange={(e) => setClosingCoalExtinguished(e.target.checked)}
                    className="w-5 h-5 rounded-lg accent-orange-600 cursor-pointer"
                  />
                </label>

                {/* Leftover Spit Meat Weighing */}
                <div className="p-4 rounded-2xl bg-[#141416] border border-[#303030] space-y-2">
                  <label className="text-xs font-bold text-white block">
                    Leftover Spit Meat Weighed & Stored (kg)
                  </label>
                  <p className="text-[10px] text-zinc-400">
                    Carved off spit cone, packed in food-grade container, dated & placed in deep chiller.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="number"
                      step="0.1"
                      value={closingMeatWeighed}
                      onChange={(e) => setClosingMeatWeighed(e.target.value)}
                      className="w-24 h-10 px-3 rounded-xl bg-[#1d1d20] border border-[#383838] font-mono text-sm font-black text-orange-400 focus:outline-none"
                    />
                    <span className="text-xs text-zinc-400 font-bold">kg Leftover</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Cash Count, Z-Report & Lockup (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-4 shadow-sm">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>2. Cash Drawer, Z-Report & Shutter Lock</span>
              </span>

              <div className="space-y-2.5">
                <label className="p-3.5 rounded-2xl bg-[#141416] border border-[#303030] flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Kitchen Deep Sanitization Completed</span>
                    <span className="text-[10px] text-zinc-400">Chopping boards, knives & Toum dispensers sanitized</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={closingKitchenSanitized}
                    onChange={(e) => setClosingKitchenSanitized(e.target.checked)}
                    className="w-5 h-5 rounded-lg accent-orange-600 cursor-pointer"
                  />
                </label>

                <label className="p-3.5 rounded-2xl bg-[#141416] border border-[#303030] flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Physical Drawer Cash Counted & Balanced</span>
                    <span className="text-[10px] text-zinc-400">Cash matched with register with zero discrepancy</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={closingCashCounted}
                    onChange={(e) => setClosingCashCounted(e.target.checked)}
                    className="w-5 h-5 rounded-lg accent-orange-600 cursor-pointer"
                  />
                </label>

                <label className="p-3.5 rounded-2xl bg-[#141416] border border-[#303030] flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">EOD Z-Report Generated & Dispatched</span>
                    <span className="text-[10px] text-zinc-400">Daily sales report transmitted to Brand HQ</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={closingZReportDone}
                    onChange={(e) => setClosingZReportDone(e.target.checked)}
                    className="w-5 h-5 rounded-lg accent-orange-600 cursor-pointer"
                  />
                </label>

                <label className="p-3.5 rounded-2xl bg-[#141416] border border-[#303030] flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-white block">Rolling Shutters & Security Lock Engaged</span>
                    <span className="text-[10px] text-zinc-400">CCTV active, night lights on, double padlocks locked</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={closingShutterLocked}
                    onChange={(e) => setClosingShutterLocked(e.target.checked)}
                    className="w-5 h-5 rounded-lg accent-orange-600 cursor-pointer"
                  />
                </label>
              </div>

              {/* Manager Digital Signature */}
              <div className="pt-2 border-t border-[#2a2a2c] space-y-2">
                <label className="text-[11px] font-bold text-zinc-400">Store Manager Sign-off</label>
                <input
                  type="text"
                  value={closingManagerSign}
                  onChange={(e) => setClosingManagerSign(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#383838] text-xs text-white font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete EOD Night Closing & Lock Store</span>
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* ── TAB 3: AUDIT LOG HISTORY ───────────────────────────────────────── */}
      {activeTab === "history" && (
        <div className="rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] overflow-hidden shadow-sm space-y-4 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-base font-black text-white">FSSAI & Hygiene Quality Log Records</h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search auditor, branch, date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#141416] border border-[#383838] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#27272a] bg-[#141416] text-zinc-400 font-black uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Date & Inspector</th>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Freezer / Chiller</th>
                  <th className="py-3 px-4">Spit / Oil TPM</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272a] text-xs">
                {displayedCompliance.map((item) => (
                  <tr key={item.id} className="hover:bg-[#202024] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{item.date}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{item.inspectedBy}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-zinc-200">
                      {item.outletName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span className="text-zinc-200">{item.deepFreezerTemp}°C</span> /{" "}
                      <span className="text-zinc-400">{item.chillerTemp}°C</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <span className="text-orange-400 font-bold">{item.spitCoreTemp}°C</span> /{" "}
                      <span className="text-zinc-300">{item.oilPolarCompoundPercent}%</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-black text-sm text-emerald-400">
                      {item.overallScore}%
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: FULL SAFETY AUDIT ────────────────────────────────────────── */}
      {showAddModal && (
        <Dialog open={true} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-md bg-[#18181b] border border-[#383838] text-white p-6 rounded-3xl space-y-4">
            <DialogHeader className="pb-2 border-b border-[#2d2d30]">
              <DialogTitle className="text-base font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Log Master Quality & Hygiene Audit</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAuditSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">Branch Outlet</label>
                <select
                  value={outletId}
                  onChange={(e) => setOutletId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#383838] text-xs text-white font-bold"
                >
                  {outlets.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400">Deep Freezer (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={deepFreezerTemp}
                    onChange={(e) => setDeepFreezerTemp(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#383838] text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400">Spit Core (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={spitCoreTemp}
                    onChange={(e) => setSpitCoreTemp(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#383838] text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400">Remarks</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#383838] text-xs text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowAddModal(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4">
                  Save Audit
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
