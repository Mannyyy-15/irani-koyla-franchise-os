"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  Clock,
  Banknote,
  Flame,
  Layers,
  Store,
  LogOut,
  ShoppingBag,
  Wifi,
  WifiOff,
  PlusCircle,
  ArrowDownCircle,
} from "lucide-react";
import { useFranchise } from "@/lib/franchise-context";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { SpitReloadModal } from "@/components/modals/SpitReloadModal";
import { logout } from "@/app/actions/auth";
import { cn } from "@/components/ui/cn";

export default function PosTopNav({
  onMenuClick,
  sidebarCollapsed = false,
  onToggleSidebar,
}: {
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { activeOutlet, outlets, outletTenderTotals, liveOrders, addPettyCashExpense, performSafeDrop, dailySession } = useFranchise();
  const currentOutlet = activeOutlet || outlets[0];

  const [currentTime, setCurrentTime] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [offlineCount, setOfflineCount] = useState(0);

  // Modals for Petty Cash, Safe Drop, and Spit Reload
  const [showPettyModal, setShowPettyModal] = useState(false);
  const [showSafeDropModal, setShowSafeDropModal] = useState(false);
  const [showSpitReloadModal, setShowSpitReloadModal] = useState(false);

  // Petty Cash Form State
  const [pettyAmount, setPettyAmount] = useState("150");
  const [pettyCategory, setPettyCategory] = useState<"Ice & Perishables" | "Fresh Herbs & Veg" | "Cleaning Supplies" | "Staff Refreshment" | "Emergency Packaging" | "Other">("Ice & Perishables");
  const [pettyReason, setPettyReason] = useState("");

  // Safe Drop Form State
  const [safeDropAmount, setSafeDropAmount] = useState("5000");
  const [safeDropVault, setSafeDropVault] = useState("Front Vault #01");
  const [safeDropNotes, setSafeDropNotes] = useState("Mid-shift cash skim");

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);

    // Online/Offline Listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      
      const storedOffline = localStorage.getItem("koyla_offline_orders");
      if (storedOffline) {
        try {
          const parsed = JSON.parse(storedOffline);
          setOfflineCount(parsed.length);
        } catch {}
      }
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  const handleSyncOffline = () => {
    localStorage.removeItem("koyla_offline_orders");
    setOfflineCount(0);
  };

  const handleSavePettyCash = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(pettyAmount);
    if (!amt || amt <= 0) return;

    addPettyCashExpense({
      amount: amt,
      category: pettyCategory,
      reason: pettyReason.trim() || `${pettyCategory} purchase`,
      paidBy: "Imran S. (Cashier)",
      outletId: currentOutlet.id,
    });

    setShowPettyModal(false);
    setPettyReason("");
  };

  const handleSaveSafeDrop = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(safeDropAmount);
    if (!amt || amt <= 0) return;

    performSafeDrop({
      amount: amt,
      authorizedBy: "Farhan Q. (Outlet Mgr)",
      safeNumber: safeDropVault,
      outletId: currentOutlet.id,
      notes: safeDropNotes.trim(),
    });

    setShowSafeDropModal(false);
  };

  const isExcessCash = outletTenderTotals.expectedCashInDrawer >= 15000;

  return (
    <>
      <header className="z-30 mx-3 mt-3 sm:mx-4 sm:mt-3 lg:mx-5 lg:mt-3 flex h-14 sm:h-16 shrink-0 items-center justify-between gap-3 rounded-2xl bg-[#1f1f1f] border border-[#303030] px-3 sm:px-4 shadow-xl" suppressHydrationWarning>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Menu Button */}
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#161618] border border-[#303030] text-zinc-300 hover:text-white cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Terminal Title & Brand Identity */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Flame className="w-4 h-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-white text-xs sm:text-sm tracking-tight truncate max-w-[160px] sm:max-w-[220px]">
                Irani Koyla Shawarma
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold mt-0.5">
                Counter POS Terminal
              </span>
            </div>
          </div>
        </div>

        {/* Center Live Clock & Drawer Cash KPIs */}
        <div className="hidden md:flex items-center gap-2">
          {/* Real-time Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161618] border border-[#303030] text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-white font-bold">{currentTime || "Loading..."}</span>
          </div>

          {/* Running Expected Cash in Drawer */}
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all",
            isExcessCash
              ? "bg-rose-950/30 border-rose-500/50 text-rose-300 animate-pulse"
              : "bg-[#161618] border-[#303030] text-zinc-300"
          )}>
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Drawer Cash:</span>
            <span className="font-mono font-black text-white">
              ₹{outletTenderTotals.expectedCashInDrawer.toLocaleString("en-IN")}
            </span>
            {isExcessCash && (
              <button
                onClick={() => setShowSafeDropModal(true)}
                className="ml-1 text-[9px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded hover:bg-rose-600 cursor-pointer"
                title="Drop excess cash to safe"
              >
                Drop Safe
              </button>
            )}
          </div>

          {/* Online / Offline Resilience Indicator */}
          <div className="flex items-center gap-1">
            {isOnline ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-[#161618] px-2 py-1 rounded-xl border border-[#303030]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Live</span>
              </span>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/15 px-2.5 py-1 rounded-xl border border-amber-500/30 animate-pulse">
                <WifiOff className="w-3 h-3" />
                <span>Offline ({offlineCount})</span>
                {offlineCount > 0 && (
                  <button onClick={handleSyncOffline} className="text-white underline text-[9px] cursor-pointer">
                    Sync
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Actions: Quick Petty Cash, Safe Drop, and Workspace */}
        <div className="flex items-center gap-2">
          {/* Spit Meat Reload Action */}
          <button
            type="button"
            onClick={() => setShowSpitReloadModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-600/15 border border-orange-500/40 hover:bg-orange-600/25 text-xs font-bold text-orange-400 hover:text-orange-300 transition-all cursor-pointer"
            title="Mount / Reload Fresh Meat Cone onto Spit"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Reload Spit</span>
            <span className="font-mono text-[10px] font-black bg-orange-500/20 px-1 rounded text-orange-300">
              {(dailySession.totalSpitMeatLoadedKg || dailySession.spitMountedKg || dailySession.spit1MountedKg || 28)}kg
            </span>
          </button>

          {/* Petty Cash Outflow Button */}
          <button
            type="button"
            onClick={() => setShowPettyModal(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#161618] border border-[#303030] hover:border-orange-500 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Log Petty Cash Outflow"
          >
            <PlusCircle className="w-3.5 h-3.5 text-orange-500" />
            <span>Petty Cash</span>
          </button>

          {/* Safe Drop Action */}
          <button
            type="button"
            onClick={() => setShowSafeDropModal(true)}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#161618] border border-[#303030] hover:border-emerald-500 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Transfer Excess Cash to Master Safe"
          >
            <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Safe Drop</span>
          </button>

          {/* Switch Workspace */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161618] border border-[#303030] hover:border-orange-500 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
            title="Store Operations Console"
          >
            <Store className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden sm:inline">Store Console</span>
          </Link>

          {/* Cashier User Avatar & Sign Out */}
          <button
            type="button"
            onClick={async () => {
              try {
                await logout();
              } catch {}
              router.push("/login");
            }}
            title="Sign out of POS Terminal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-xs shadow-sm hover:opacity-90 transition-all cursor-pointer shrink-0"
          >
            IS
          </button>
        </div>
      </header>

      {/* Petty Cash Outflow Dialog */}
      {showPettyModal && (
        <Dialog open={true} onOpenChange={setShowPettyModal}>
          <DialogContent className="max-w-sm bg-[#1f1f1f] border border-[#303030] text-white p-5 rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-base font-black text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-orange-500" />
                <span>Log Petty Cash Outflow</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSavePettyCash} className="space-y-3.5 mt-3">
              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Expense Category</label>
                <select
                  value={pettyCategory}
                  onChange={(e) => setPettyCategory(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Ice & Perishables">Ice Bags & Perishables</option>
                  <option value="Fresh Herbs & Veg">Fresh Herbs & Veg (Mint/Chillies)</option>
                  <option value="Cleaning Supplies">Cleaning Supplies & Detergent</option>
                  <option value="Staff Refreshment">Staff Refreshment / Tea</option>
                  <option value="Emergency Packaging">Emergency Foil & Carry Bags</option>
                  <option value="Other">Other Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Amount Paid from Drawer (₹)</label>
                <input
                  type="number"
                  required
                  step="1"
                  value={pettyAmount}
                  onChange={(e) => setPettyAmount(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-sm font-mono font-bold text-white focus:outline-none focus:border-orange-500"
                  placeholder="e.g. 150"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Reason / Item Details</label>
                <input
                  type="text"
                  required
                  value={pettyReason}
                  onChange={(e) => setPettyReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white focus:outline-none focus:border-orange-500"
                  placeholder="e.g. 2 bags crystal ice for cooler"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowPettyModal(false)} className="border-[#303030] bg-[#161618] text-zinc-300">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-orange-600 hover:bg-orange-500 text-white font-bold">
                  Deduct from Drawer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Safe Drop Skim Dialog */}
      {showSafeDropModal && (
        <Dialog open={true} onOpenChange={setShowSafeDropModal}>
          <DialogContent className="max-w-sm bg-[#1f1f1f] border border-[#303030] text-white p-5 rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-base font-black text-white flex items-center gap-2">
                <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
                <span>Safe Drop (Excess Cash Skim)</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveSafeDrop} className="space-y-3.5 mt-3">
              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
                <span className="text-zinc-400 block">Current Expected Drawer Cash:</span>
                <span className="text-base font-black font-mono text-emerald-400">
                  ₹{outletTenderTotals.expectedCashInDrawer.toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Amount to Transfer to Safe (₹)</label>
                <input
                  type="number"
                  required
                  step="500"
                  value={safeDropAmount}
                  onChange={(e) => setSafeDropAmount(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. 5000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Destination Safe</label>
                <select
                  value={safeDropVault}
                  onChange={(e) => setSafeDropVault(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Front Vault #01">Front Vault #01 (Manager Key)</option>
                  <option value="Backoffice Safe #02">Backoffice Safe #02 (Dual Lock)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">Skim Notes</label>
                <input
                  type="text"
                  value={safeDropNotes}
                  onChange={(e) => setSafeDropNotes(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowSafeDropModal(false)} className="border-[#303030] bg-[#161618] text-zinc-300">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                  Confirm Safe Transfer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Spit Meat Reload Modal */}
      <SpitReloadModal
        isOpen={showSpitReloadModal}
        onClose={() => setShowSpitReloadModal(false)}
      />
    </>
  );
}
