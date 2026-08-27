"use client";

import { useState } from "react";
import {
  Building2,
  FileText,
  Flame,
  Save,
  CheckCircle2,
  AlertTriangle,
  Store,
  WalletCards,
  RefreshCcw,
  Trash2,
  Sliders,
  Shield,
  Bell,
  Printer,
  Smartphone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { useFranchise } from "@/lib/franchise-context";
import { cn } from "@/components/ui/cn";

export default function SettingsPage() {
  const { role, activeOutlet, resetStoreToFreshMorning } = useFranchise();
  const isSuperAdmin = role === "SUPER_ADMIN";

  const SECTIONS = isSuperAdmin
    ? [
        { key: "brand", label: "Brand HQ Profile", icon: Building2, desc: "Franchisor corporate identity, address & GSTIN" },
        { key: "royalty", label: "Royalty & Billing Rules", icon: WalletCards, desc: "Standard 6.5% royalty, 2% marketing, invoice due days" },
        { key: "meat_rules", label: "Meat & Yield Standards", icon: Flame, desc: "BOM portion grams, minimum yield % & temperature" },
        { key: "database", label: "Database & Reset Data", icon: RefreshCcw, desc: "Clear demo data, test accounts & factory reset" },
      ]
    : [
        { key: "store_profile", label: "My Store Profile", icon: Store, desc: "Store address, contact numbers & UPI handle" },
        { key: "pos_settings", label: "POS Register & Thermal Print", icon: Printer, desc: "80mm printer, audio sound effects & register float" },
        { key: "database", label: "Reset Demo Data", icon: RefreshCcw, desc: "Reset live store session to fresh morning" },
      ];

  type SectionKey = typeof SECTIONS[number]["key"];
  const [active, setActive] = useState<SectionKey>(isSuperAdmin ? "brand" : "store_profile");
  const [savedToast, setSavedToast] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);

  // HQ Settings states
  const [brandName, setBrandName] = useState("ThePieCraft Brands Pvt. Ltd. / Irani Koyla Shawarma");
  const [hqAddress, setHqAddress] = useState("Central Commissary Hub, Marol Industrial Area, Andheri (E), Mumbai 400059");
  const [hqPhone, setHqPhone] = useState("+91 98200 12345");
  const [hqEmail, setHqEmail] = useState("operations@iranikoylashawarma.com");
  const [gstin, setGstin] = useState("27AABCI4920F1ZV");

  const [royaltyRate, setRoyaltyRate] = useState("6.5");
  const [marketingRate, setMarketingRate] = useState("2.0");
  const [invoiceDueDays, setInvoiceDueDays] = useState("10");
  const [latePaymentPenalty, setLatePaymentPenalty] = useState("1.5");

  const [targetYieldPercent, setTargetYieldPercent] = useState("92.0");
  const [wrapMeatPortionGrams, setWrapMeatPortionGrams] = useState("85");
  const [jumboMeatPortionGrams, setJumboMeatPortionGrams] = useState("130");
  const [spitMinTemp, setSpitMinTemp] = useState("75.0");

  // Franchisee Store Settings states
  const [storeName, setStoreName] = useState(activeOutlet?.name || "Mohak City Branch");
  const [storeAddress, setStoreAddress] = useState(activeOutlet?.address || "Shop 4, Mohak City Mall, Vasai Road (W)");
  const [storePhone, setStorePhone] = useState(activeOutlet?.ownerPhone || "+91 98204 88392");
  const [storeUpiVpa, setStoreUpiVpa] = useState("iranikoyla.mohak@hdfcbank");
  const [defaultOpeningFloat, setDefaultOpeningFloat] = useState("2000");
  const [posAudioEnabled, setPosAudioEnabled] = useState(true);
  const [autoPrintBill, setAutoPrintBill] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleExecuteFactoryReset = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("koyla_franchise_state_v1");
        localStorage.removeItem("koyla_registered_franchise_accounts");
        localStorage.removeItem("koyla_action_cache_v1");
      } catch {}
      resetStoreToFreshMorning();
      setShowResetConfirmModal(false);
      setResetSuccessToast(true);
      setTimeout(() => {
        setResetSuccessToast(false);
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Settings</span>
            <span className="text-xs px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono font-bold">
              {isSuperAdmin ? "HQ Mode" : "Store Partner Mode"}
            </span>
          </h1>
        </div>

        {savedToast && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        {resetSuccessToast && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 font-bold text-xs animate-in fade-in">
            <RefreshCcw className="w-4 h-4 animate-spin" />
            <span>Demo database cleared! Reloading fresh state...</span>
          </div>
        )}
      </div>

      {/* Main Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1.5">
          {SECTIONS.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setActive(sec.key)}
              className={cn(
                "w-full flex items-start gap-3 p-3.5 rounded-2xl text-left transition-all cursor-pointer border",
                active === sec.key
                  ? "bg-orange-600/15 border-orange-500/40 text-orange-400 font-bold shadow-sm"
                  : "bg-[#1a1a1c] border-[#2e2e30] text-zinc-400 hover:text-white hover:bg-[#222226]"
              )}
            >
              <sec.icon className={cn("w-5 h-5 shrink-0 mt-0.5", active === sec.key ? "text-orange-400" : "text-zinc-500")} />
              <div>
                <span className="text-xs font-bold text-white block">{sec.label}</span>
                <span className="text-[10px] text-zinc-500 mt-0.5 block leading-tight">{sec.desc}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Form Content */}
        <Card className="lg:col-span-3 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardHeader className="border-b border-[#2e2e30] pb-4">
            <CardTitle className="text-base font-bold text-white flex items-center justify-between">
              <span>{SECTIONS.find((s) => s.key === active)?.label}</span>
              <span className="text-xs font-normal text-zinc-400">
                {isSuperAdmin ? "Applies to entire franchise network" : "Applies to this store branch only"}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {/* HQ SECTION: BRAND PROFILE */}
              {active === "brand" && isSuperAdmin && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Franchisor Legal Entity Name
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Central Commissary & HQ Registered Address
                    </label>
                    <input
                      type="text"
                      value={hqAddress}
                      onChange={(e) => setHqAddress(e.target.value)}
                      className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        HQ Operations Support Phone
                      </label>
                      <input
                        type="text"
                        value={hqPhone}
                        onChange={(e) => setHqPhone(e.target.value)}
                        className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono font-semibold text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        HQ Official Operations Email
                      </label>
                      <input
                        type="email"
                        value={hqEmail}
                        onChange={(e) => setHqEmail(e.target.value)}
                        className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono font-semibold text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Master Corporate GSTIN Number
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono font-bold text-orange-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </>
              )}

              {/* HQ SECTION: ROYALTY RULES */}
              {active === "royalty" && isSuperAdmin && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Network Royalty Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={royaltyRate}
                        onChange={(e) => setRoyaltyRate(e.target.value)}
                        className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono font-bold text-orange-400 focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">Default standard: 6.5% of verified monthly gross sales</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Brand Marketing Fund (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={marketingRate}
                        onChange={(e) => setMarketingRate(e.target.value)}
                        className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">Default standard: 2.0% for regional promotions & ads</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Monthly Invoice Due Day
                      </label>
                      <input
                        type="number"
                        value={invoiceDueDays}
                        onChange={(e) => setInvoiceDueDays(e.target.value)}
                        className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">Payable by 10th of succeeding calendar month</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Late Overdue Interest (%/month)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={latePaymentPenalty}
                        onChange={(e) => setLatePaymentPenalty(e.target.value)}
                        className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* HQ SECTION: MEAT STANDARDS */}
              {active === "meat_rules" && isSuperAdmin && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Target Spit Yield Benchmark (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={targetYieldPercent}
                        onChange={(e) => setTargetYieldPercent(e.target.value)}
                        className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">Goal: &gt; 92.0% efficiency per raw skewer mounted</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Minimum Spit Core Temperature (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={spitMinTemp}
                        onChange={(e) => setSpitMinTemp(e.target.value)}
                        className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono font-bold text-orange-400 focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">Mandatory cooked food safety temperature: &ge; 75.0°C</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Regular Shawarma Wrap Portion (grams)
                      </label>
                      <input
                        type="number"
                        value={wrapMeatPortionGrams}
                        onChange={(e) => setWrapMeatPortionGrams(e.target.value)}
                        className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">Standard BOM: 85g cooked shaved chicken/mutton</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Jumbo / Platter Meat Portion (grams)
                      </label>
                      <input
                        type="number"
                        value={jumboMeatPortionGrams}
                        onChange={(e) => setJumboMeatPortionGrams(e.target.value)}
                        className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                      />
                      <span className="text-[10px] text-zinc-500 mt-1 block">Standard BOM: 130g cooked shaved meat</span>
                    </div>
                  </div>
                </>
              )}

              {/* FRANCHISEE SECTION: MY STORE PROFILE */}
              {active === "store_profile" && !isSuperAdmin && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Store Branch Name
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Outlet Physical Address
                    </label>
                    <input
                      type="text"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Store Contact Phone
                      </label>
                      <input
                        type="text"
                        value={storePhone}
                        onChange={(e) => setStorePhone(e.target.value)}
                        className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Store UPI ID (For Dynamic QR at POS)
                      </label>
                      <input
                        type="text"
                        value={storeUpiVpa}
                        onChange={(e) => setStoreUpiVpa(e.target.value)}
                        className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono font-bold text-blue-400 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* FRANCHISEE SECTION: POS SETTINGS */}
              {active === "pos_settings" && !isSuperAdmin && (
                <>
                  <div className="p-4 rounded-xl bg-[#141416] border border-[#2e2e30] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Fast Mechanical Audio Sound Effects</span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        Synthesizer audio clicks on touch items, cart adjustments, and register cash chime.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={posAudioEnabled}
                      onChange={(e) => setPosAudioEnabled(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-[#141416] border border-[#2e2e30] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Auto-Print 80mm Receipt on Checkout</span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        Directly sends receipt command to thermal printer after payment success.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoPrintBill}
                      onChange={(e) => setAutoPrintBill(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Default Morning Register Opening Cash Float (₹)
                    </label>
                    <input
                      type="number"
                      value={defaultOpeningFloat}
                      onChange={(e) => setDefaultOpeningFloat(e.target.value)}
                      className="w-full h-10 rounded-xl border border-[#303030] bg-[#141416] px-3.5 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </>
              )}

              {/* SHARED SECTION: DATABASE & RESET DEMO DATA */}
              {active === "database" && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-3">
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <strong className="text-sm font-bold text-white">Clear & Reset Demo Database</strong>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      This will reset all modified session orders, test supply chain requisitions, and custom shifts back to clean initial state. Perfect for starting a fresh testing round before real store launch.
                    </p>
                    <div className="pt-2">
                      <Button
                        type="button"
                        onClick={() => setShowResetConfirmModal(true)}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 cursor-pointer shadow-md"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear Demo Database & Start Fresh</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Action Footer */}
              {active !== "database" && (
                <div className="pt-4 flex justify-end border-t border-[#2e2e30]">
                  <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <Dialog open={true} onOpenChange={() => setShowResetConfirmModal(false)}>
          <DialogContent className="max-w-md bg-[#1a1a1c] border border-[#2e2e30] text-white p-6 rounded-3xl space-y-4">
            <DialogHeader>
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-2">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <DialogTitle className="text-base font-bold text-white">
                Clear All Demo Data & Reset?
              </DialogTitle>
            </DialogHeader>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you sure you want to clear localStorage cache and reset all test orders, stock requisitions, and register shifts? You will start with a fresh morning session.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#2e2e30]">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowResetConfirmModal(false)}
                className="border-[#383838] bg-[#1f1f23] text-zinc-300 text-xs font-bold h-10 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleExecuteFactoryReset}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 cursor-pointer shadow-md"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Reset Everything</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
