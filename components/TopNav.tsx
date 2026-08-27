"use client";

import {
  Bell,
  Search,
  Menu,
  Plus,
  X,
  Flame,
  Store,
  Receipt,
  ShieldCheck,
  WalletCards,
  ChevronDown,
  UserCheck,
  Sparkles,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Building,
  RefreshCw,
  LogOut,
  ShoppingBag,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFranchise } from "@/lib/franchise-context";
import { cn } from "@/components/ui/cn";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { logout } from "@/app/actions/auth";

function titleFromPath(pathname: string): string {
  const segs = pathname.split("/").filter(Boolean);
  const last = segs[segs.length - 1] ?? "overview";
  switch (last) {
    case "admin":
      return "Overview";
    case "pos":
      return "Billing POS";
    case "outlets":
      return "Outlets";
    case "yield":
      return "Meat & Spits";
    case "sales":
      return "Daily Sales";
    case "royalties":
      return "Royalties";
    case "menu":
      return "Menu & Recipes";
    case "supply-chain":
      return "Stock & Supplies";
    case "audit":
      return "Audit History";
    case "settings":
      return "Settings";
    case "monthly":
      return "Monthly Performance";
    default:
      return last.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }
}

export default function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const title = titleFromPath(pathname);

  const {
    role,
    selectedOutletId,
    setSelectedOutletId,
    outlets,
    activeOutlet,
    addMeatBatch,
    closeShift,
    updateCompliance,
  } = useFranchise();

  const [quickActionModal, setQuickActionModal] = useState<"meat" | "shift" | "temp" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const { supplyOrders } = useFranchise();

  // Dynamic Live Notifications for HQ and Franchisee
  const baseNotifications = role === "SUPER_ADMIN"
    ? [
        ...(supplyOrders.filter((o) => o.status === "pending").map((o) => ({
          id: `notif-order-${o.id}`,
          type: "order",
          title: `New Stock Order · ${o.outletName}`,
          desc: `${o.orderNumber} (${o.totalQuantity} items · ₹${o.totalAmount.toLocaleString("en-IN")}) waiting for approval.`,
          time: o.createdAt || "Just now",
        }))),
        {
          id: "notif-shifts-active",
          type: "alert",
          title: "Daily Store Shifts Active",
          desc: "4 franchise outlets are actively billing on counter POS.",
          time: "10m ago",
        },
        {
          id: "notif-royalties-ready",
          type: "info",
          title: "Monthly Royalty Invoices Ready",
          desc: "August 2026 statements generated across all franchise network hubs.",
          time: "1h ago",
        },
      ]
    : [
        ...(supplyOrders.filter((o) => o.outletId === activeOutlet?.id && o.status === "dispatched").map((o) => ({
          id: `notif-disp-${o.id}`,
          type: "urgent",
          title: "Cold-Chain Van Dispatched!",
          desc: `Shipment ${o.trackingNumber || o.orderNumber} is on the way. Confirm with your 4-digit OTP.`,
          time: "In Transit",
        }))),
        ...(supplyOrders.filter((o) => o.outletId === activeOutlet?.id && o.status === "approved").map((o) => ({
          id: `notif-appr-${o.id}`,
          type: "order",
          title: "Stock Requisition Approved",
          desc: `Order ${o.orderNumber} approved by Brand HQ for dispatch.`,
          time: "Today",
        }))),
        {
          id: "notif-daily-target",
          type: "info",
          title: "Daily Store Targets",
          desc: `Target today: ₹${activeOutlet?.dailyTargetSales.toLocaleString("en-IN") || "50,000"} · Maintain >92% Spit Yield.`,
          time: "Morning",
        },
      ];

  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const notificationsList = baseNotifications.filter((n) => !dismissedIds.includes(n.id));
  const unreadNotificationsCount = notificationsList.length;

  const handleDismissNotification = (id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  };

  const handleClearAllNotifications = () => {
    setDismissedIds(baseNotifications.map((n) => n.id));
  };

  // Form states for Quick Action
  const [spitMeatType, setSpitMeatType] = useState<"Koyla Marinated Chicken" | "Smoked Charcoal Mutton">("Koyla Marinated Chicken");
  const [spitWeightKg, setSpitWeightKg] = useState("32.5");
  const [spitOutletId, setSpitOutletId] = useState(selectedOutletId === "all" ? "bandra-west" : selectedOutletId);

  const [shiftGrossSales, setShiftGrossSales] = useState("58400");
  const [shiftCashActual, setShiftCashActual] = useState("16500");
  const [shiftUpi, setShiftUpi] = useState("24800");
  const [shiftSwiggy, setShiftSwiggy] = useState("9800");
  const [shiftZomato, setShiftZomato] = useState("7300");

  const [tempFreezer, setTempFreezer] = useState("-18.5");
  const [tempSpitCore, setTempSpitCore] = useState("78.0");
  const [tempOilTpm, setTempOilTpm] = useState("16.2");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleQuickAddMeat = (e: React.FormEvent) => {
    e.preventDefault();
    const targetO = outlets.find((o) => o.id === spitOutletId) || outlets[0];
    const weight = parseFloat(spitWeightKg) || 30;
    const batchNum = `IK-${targetO.code.split("-")[1]}-${Date.now().toString().slice(-4)}`;
    
    addMeatBatch({
      batchNumber: batchNum,
      outletId: targetO.id,
      outletName: targetO.name,
      meatType: spitMeatType,
      spitId: "Spit-01 (Main Spit)",
      timeLoaded: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      rawMeatReceivedKg: Number((weight * 1.05).toFixed(1)),
      marinationLossKg: Number((weight * 0.04).toFixed(1)),
      skewerWeightKg: weight,
      cookedWeightKg: Number((weight * 0.85).toFixed(1)),
      wrapsProduced: Math.round(weight * 8.2),
      jumboWrapsProduced: Math.round(weight * 2.1),
      plattersProduced: Math.round(weight * 0.8),
      wasteScrapsKg: Number((weight * 0.03).toFixed(1)),
      targetYieldKg: Number((weight * 0.90).toFixed(1)),
      coreTempCelsius: 78.5,
      loggedBy: "Quick Action Roaster",
      notes: "Logged via fast header toolbar.",
    });

    setQuickActionModal(null);
    showToast(`Logged Spit Batch ${batchNum} (${weight} kg) for ${targetO.name}!`);
  };

  const handleQuickCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    const targetO = outlets.find((o) => o.id === spitOutletId) || outlets[0];
    const gross = parseFloat(shiftGrossSales) || 50000;
    const cash = parseFloat(shiftCashActual) || 15000;
    const upi = parseFloat(shiftUpi) || 20000;
    const swiggy = parseFloat(shiftSwiggy) || 9000;
    const zomato = parseFloat(shiftZomato) || 6000;

    closeShift({
      outletId: targetO.id,
      outletName: targetO.name,
      date: new Date().toISOString().split("T")[0],
      shiftType: "Evening Shift (05:00 PM - 01:00 AM)",
      cashierName: "Aman Siddiqui",
      openingCash: 5000,
      cashSalesExpected: gross - (upi + swiggy + zomato),
      cashInDrawerActual: cash,
      cashDifference: cash - (gross - (upi + swiggy + zomato)),
      upiSales: upi,
      swiggySales: swiggy,
      zomatoSales: zomato,
      posCardSales: 0,
      pettyCashExpenses: 650,
      totalOrders: Math.round(gross / 295),
      totalGrossSales: gross,
      discountsGiven: 1200,
      netRevenue: gross - 1200,
    });

    setQuickActionModal(null);
    showToast(`Reconciled & closed Evening Shift for ${targetO.name} (Gross: ₹${gross.toLocaleString()})!`);
  };

  const handleQuickTempAudit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetO = outlets.find((o) => o.id === spitOutletId) || outlets[0];

    updateCompliance({
      outletId: targetO.id,
      outletName: targetO.name,
      inspectedBy: "Manager On-Duty",
      deepFreezerTemp: parseFloat(tempFreezer) || -18.5,
      chillerTemp: 3.5,
      spitCoreTemp: parseFloat(tempSpitCore) || 78.0,
      oilPolarCompoundPercent: parseFloat(tempOilTpm) || 16.0,
      fssaiDisplayVerified: true,
      staffHairnetsGloves: true,
      pestControlVerified: true,
      waterQualityTested: true,
      remarks: "Logged via Quick Header Toolbar.",
    });

    setQuickActionModal(null);
    showToast(`Logged food safety temperature check for ${targetO.name}!`);
  };

  return (
    <>
      <header className="z-30 mx-3 mt-3 sm:mx-4 sm:mt-4 lg:mx-6 lg:mt-5 flex h-14 sm:h-16 shrink-0 items-center gap-3 rounded-[20px] bg-white/90 dark:bg-[#1f1f1f]/95 backdrop-blur-xl px-4 sm:px-5 shadow-[0_2px_12px_rgba(0,0,0,0.07)] dark:shadow-none dark:border dark:border-[#303030]">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden -ml-2 inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#303030] cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Store Title / Breadcrumb */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm text-white tracking-tight">
            {title}
          </span>
          {role === "FRANCHISE_OWNER" && activeOutlet && (
            <span className="text-[11px] font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-lg">
              {activeOutlet.name}
            </span>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 relative">
          {/* Quick POS access for Franchise Partner */}
          {role === "FRANCHISE_OWNER" && (
            <Link
              href="/pos"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-black text-white shadow-sm transition-all"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Counter POS</span>
            </Link>
          )}

          {/* Global Search Bar */}
          <div className="group relative hidden w-48 text-left md:block lg:w-64">
            <Search className="pointer-events-none absolute inset-y-0 left-3 h-full w-4 text-zinc-500 group-hover:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="h-9 w-full rounded-xl border border-[#303030] bg-[#161618] pl-9 pr-4 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Quick Action + */}
          <button
            type="button"
            onClick={() => setQuickActionModal("meat")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#303030] bg-[#161618] text-zinc-300 hover:text-white hover:border-orange-500/50 transition-all cursor-pointer"
            title="Quick Action"
          >
            <Plus className="h-4 w-4" />
          </button>

          {/* Notifications Trigger & Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#303030] bg-[#161618] text-zinc-300 hover:text-white hover:border-orange-500/50 transition-all cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-orange-600 text-[9px] font-black text-white flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Live Notification Dropdown Menu */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#1a1a1c] border border-[#2e2e30] shadow-2xl p-4 z-50 text-white animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-[#2e2e30] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-orange-500" />
                    <span className="font-bold text-xs uppercase tracking-wider text-white">Notifications</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {notificationsList.length} recent
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {notificationsList.length > 0 ? (
                    notificationsList.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "p-3 rounded-xl border transition-all text-xs space-y-1 relative group",
                          n.type === "urgent"
                            ? "bg-red-950/20 border-red-500/30 text-red-200"
                            : n.type === "order"
                            ? "bg-orange-950/20 border-orange-500/30 text-orange-200"
                            : "bg-[#161618] border-[#2e2e30] text-zinc-300"
                        )}
                      >
                        <div className="flex items-center justify-between pr-5">
                          <strong className="text-white text-xs font-semibold">{n.title}</strong>
                          <span className="text-[10px] text-zinc-500 font-mono">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-snug">{n.desc}</p>

                        {/* Individual Delete / Dismiss Button */}
                        <button
                          type="button"
                          onClick={() => handleDismissNotification(n.id)}
                          className="absolute right-2 top-2 p-1 text-zinc-500 hover:text-red-400 rounded-md hover:bg-white/5 transition-all cursor-pointer opacity-70 group-hover:opacity-100"
                          title="Delete notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-zinc-500">
                      No new notifications right now.
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-[#2e2e30] flex justify-between items-center text-[11px]">
                  {notificationsList.length > 0 ? (
                    <button
                      onClick={handleClearAllNotifications}
                      className="text-zinc-400 hover:text-red-400 font-bold cursor-pointer flex items-center gap-1"
                    >
                      <span>Clear all</span>
                    </button>
                  ) : (
                    <span className="text-zinc-500 font-mono">
                      {role === "SUPER_ADMIN" ? "HQ Feed" : "Store Alerts"}
                    </span>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-orange-400 hover:text-orange-300 font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Logout */}
          <button
            type="button"
            onClick={async () => {
              try {
                await logout();
              } catch {}
              router.push("/login");
            }}
            title="Sign out"
            className="inline-flex h-9 px-2.5 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-xs shadow-sm hover:opacity-90 transition-all cursor-pointer gap-1"
          >
            <span>{role === "SUPER_ADMIN" ? "HQ Admin" : "Partner"}</span>
            <LogOut className="w-3 h-3 ml-0.5 opacity-80" />
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 text-white border border-amber-500/40 shadow-2xl backdrop-blur-xl">
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Quick Action Dialog */}
      {quickActionModal && (
        <Dialog open={true} onOpenChange={() => setQuickActionModal(null)}>
          <DialogContent className="max-w-md bg-[#1f1f1f] border border-[#303030] text-white p-6 rounded-3xl">
            <DialogHeader>
              <div className="flex items-center justify-between border-b border-[#303030] pb-3">
                <DialogTitle className="text-base font-black flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <span>Franchise Operational Entry</span>
                </DialogTitle>
                <button
                  onClick={() => setQuickActionModal(null)}
                  className="p-1 text-[#b8b8c5]/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </DialogHeader>

            {/* Sub-tab picker */}
            <div className="grid grid-cols-3 gap-2 mt-4 p-1 bg-[#161618] border border-[#303030] rounded-xl">
              <button
                type="button"
                onClick={() => setQuickActionModal("meat")}
                className={cn(
                  "py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer",
                  quickActionModal === "meat" ? "bg-amber-600 text-white shadow" : "text-[#b8b8c5]/70 hover:text-white"
                )}
              >
                Spit Batch
              </button>
              <button
                type="button"
                onClick={() => setQuickActionModal("shift")}
                className={cn(
                  "py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer",
                  quickActionModal === "shift" ? "bg-amber-600 text-white shadow" : "text-[#b8b8c5]/70 hover:text-white"
                )}
              >
                Shift Tender
              </button>
              <button
                type="button"
                onClick={() => setQuickActionModal("temp")}
                className={cn(
                  "py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer",
                  quickActionModal === "temp" ? "bg-amber-600 text-white shadow" : "text-[#b8b8c5]/70 hover:text-white"
                )}
              >
                Food Safety
              </button>
            </div>

            {/* Form: Meat Batch */}
            {quickActionModal === "meat" && (
              <form onSubmit={handleQuickAddMeat} className="space-y-3.5 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Franchise Outlet</label>
                  <select
                    value={spitOutletId}
                    onChange={(e) => setSpitOutletId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#38383f] bg-slate-50 dark:bg-[#1f1f1f] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {outlets.map((o) => (
                      <option key={o.id} value={o.id}>{o.name} ({o.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Meat Recipe Selection</label>
                  <select
                    value={spitMeatType}
                    onChange={(e) => setSpitMeatType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#38383f] bg-slate-50 dark:bg-[#1f1f1f] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Koyla Marinated Chicken">Koyla Marinated Chicken (Signature)</option>
                    <option value="Smoked Charcoal Mutton">Smoked Charcoal Mutton (Prime Cut)</option>
                    <option value="Special Spiced Chicken">Special Spiced Chicken (Spicy Blend)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Net Loaded Spit Cone Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={spitWeightKg}
                    onChange={(e) => setSpitWeightKg(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#38383f] bg-slate-50 dark:bg-[#1f1f1f] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. 32.5"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Expected Yield: ~{Math.round(parseFloat(spitWeightKg || "0") * 8.2)} wraps</span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setQuickActionModal(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-500 text-white font-bold">
                    🔥 Start Spit Roasting
                  </Button>
                </div>
              </form>
            )}

            {/* Form: Shift Closing */}
            {quickActionModal === "shift" && (
              <form onSubmit={handleQuickCloseShift} className="space-y-3.5 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Franchise Outlet</label>
                  <select
                    value={spitOutletId}
                    onChange={(e) => setSpitOutletId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#38383f] bg-slate-50 dark:bg-[#1f1f1f] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {outlets.map((o) => (
                      <option key={o.id} value={o.id}>{o.name} ({o.code})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Total Gross Sales (₹)</label>
                    <input
                      type="number"
                      value={shiftGrossSales}
                      onChange={(e) => setShiftGrossSales(e.target.value)}
                      required
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#38383f] bg-slate-50 dark:bg-[#1f1f1f] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Cash in Drawer (₹)</label>
                    <input
                      type="number"
                      value={shiftCashActual}
                      onChange={(e) => setShiftCashActual(e.target.value)}
                      required
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#38383f] bg-slate-50 dark:bg-[#1f1f1f] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">UPI (GPay/PhonePe)</label>
                    <input
                      type="number"
                      value={shiftUpi}
                      onChange={(e) => setShiftUpi(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-[#38383f] bg-slate-50 dark:bg-[#1f1f1f] text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Swiggy Orders</label>
                    <input
                      type="number"
                      value={shiftSwiggy}
                      onChange={(e) => setShiftSwiggy(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-[#38383f] bg-slate-50 dark:bg-[#1f1f1f] text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Zomato Orders</label>
                    <input
                      type="number"
                      value={shiftZomato}
                      onChange={(e) => setShiftZomato(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-[#38383f] bg-slate-50 dark:bg-[#1f1f1f] text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setQuickActionModal(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                    Reconcile & Close Shift
                  </Button>
                </div>
              </form>
            )}

            {/* Form: Temp Audit */}
            {quickActionModal === "temp" && (
              <form onSubmit={handleQuickTempAudit} className="space-y-3.5 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Franchise Outlet</label>
                  <select
                    value={spitOutletId}
                    onChange={(e) => setSpitOutletId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#38383f] bg-slate-50 dark:bg-[#1f1f1f] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {outlets.map((o) => (
                      <option key={o.id} value={o.id}>{o.name} ({o.code})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Spit Core (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempSpitCore}
                      onChange={(e) => setTempSpitCore(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-[#38383f] bg-slate-50 dark:bg-[#1f1f1f] text-xs font-bold text-amber-400"
                    />
                    <span className="text-[9px] text-slate-500">Min 75°C</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Freezer (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempFreezer}
                      onChange={(e) => setTempFreezer(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-[#38383f] bg-slate-50 dark:bg-[#1f1f1f] text-xs font-bold text-cyan-400"
                    />
                    <span className="text-[9px] text-slate-500">Max -18°C</span>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 mb-1">Oil TPM (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempOilTpm}
                      onChange={(e) => setTempOilTpm(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-[#38383f] bg-slate-50 dark:bg-[#1f1f1f] text-xs font-bold text-emerald-400"
                    />
                    <span className="text-[9px] text-slate-500">Max 24%</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setQuickActionModal(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold">
                    🛡️ Record QA Compliance
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
