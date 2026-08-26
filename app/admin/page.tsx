"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Store,
  Receipt,
  Building,
  TrendingUp,
  Clock,
  ArrowUpRight,
  UtensilsCrossed,
  DollarSign,
  Banknote,
  ShoppingBag,
  Plus,
  ChevronRight,
  Truck,
  Sparkles,
  PieChart as PieIcon,
  Activity,
  Layers,
  ArrowDownRight,
  Sun,
  Moon,
  RotateCcw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useFranchise } from "@/lib/franchise-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/components/ui/cn";
import { StoreOpeningModal } from "@/components/modals/StoreOpeningModal";
import { StoreClosingModal } from "@/components/modals/StoreClosingModal";

const STORE_HOURLY_SALES = [
  { hour: "12 PM", sales: 3200, orders: 12 },
  { hour: "02 PM", sales: 7400, orders: 28 },
  { hour: "04 PM", sales: 4800, orders: 19 },
  { hour: "06 PM", sales: 9800, orders: 36 },
  { hour: "08 PM", sales: 18600, orders: 64 },
  { hour: "10 PM", sales: 24200, orders: 82 },
  { hour: "12 AM", sales: 11400, orders: 38 },
];

const HQ_HOURLY_SALES = [
  { hour: "12 PM", sales: 14200 },
  { hour: "02 PM", sales: 29800 },
  { hour: "04 PM", sales: 21400 },
  { hour: "06 PM", sales: 42600 },
  { hour: "08 PM", sales: 88400 },
  { hour: "10 PM", sales: 116200 },
  { hour: "12 AM", sales: 54800 },
];

const MENU_SHARE_DATA = [
  { name: "Chicken Shawarma Wraps", value: 52, color: "#f97316" },
  { name: "Smoked Mutton Rolls", value: 24, color: "#ea580c" },
  { name: "Loaded Combo Meals", value: 16, color: "#fb923c" },
  { name: "Platters & Sides", value: 8, color: "#fed7aa" },
];

export default function AdminDashboardPage() {
  const {
    role,
    outlets,
    activeOutlet,
    selectedOutletId,
    setSelectedOutletId,
    networkTotals,
    liveOrders,
    outletTenderTotals,
    dailySession,
    resetStoreToFreshMorning,
  } = useFranchise();

  const isSuperAdmin = role === "SUPER_ADMIN" && selectedOutletId === "all";
  const currentOutlet = activeOutlet || outlets[0];

  const [orderSearch, setOrderSearch] = useState("");
  const [orderChannelFilter, setOrderChannelFilter] = useState<"all" | "Walk-in Counter" | "Zomato" | "Swiggy">("all");
  const [showDrawerBreakdown, setShowDrawerBreakdown] = useState(false);
  const [isOpeningModalOpen, setIsOpeningModalOpen] = useState(false);
  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);

  // Filtered live orders for store view
  const filteredOrders = liveOrders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(orderSearch.toLowerCase()));
    const matchesChannel = orderChannelFilter === "all" || o.channel === orderChannelFilter;
    return matchesSearch && matchesChannel;
  });

  const channelChartData = [
    { name: "Walk-in Counter", value: outletTenderTotals.walkInSales || 44200, color: "#f97316" },
    { name: "Zomato Delivery", value: outletTenderTotals.zomatoSales || 21800, color: "#ef4444" },
    { name: "Swiggy Delivery", value: outletTenderTotals.swiggySales || 13400, color: "#f59e0b" },
  ];

  const totalChannelRevenue = channelChartData.reduce((acc, c) => acc + c.value, 0) || 1;

  return (
    <div className="space-y-6">
      {/* ── TOP HEADER AREA ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-1.5">
          <p className="text-[11px] font-black text-orange-500 uppercase tracking-widest leading-none flex items-center gap-2">
            <Store className="w-3.5 h-3.5" />
            <span>
              {isSuperAdmin
                ? "Brand HQ Global • Multi-Branch Operations"
                : `${currentOutlet.name} • ${currentOutlet.code}`}
            </span>
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-0.5">
            {isSuperAdmin ? "Network Executive Command Center" : "Store Overview & Live Analytics"}
          </h1>
          {isSuperAdmin && (
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl pt-1">
              Real-time multi-unit performance, sales velocity, spit yield benchmarks, and live counter stream across {outlets.length} franchise locations.
            </p>
          )}
        </div>

        {isSuperAdmin && (
          <div className="flex items-center gap-2">
            <Link href="/admin/outlets">
              <Button className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-xl gap-2 shadow-lg shadow-orange-600/25 h-11 px-4 cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Onboard Franchise Hub</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* ── SUPER ADMIN DASHBOARD VIEW ──────────────────────────────────── */}
      {isSuperAdmin ? (
        <div className="space-y-6">
          {/* Top 4 Network KPI Cards (Clean SaaS Design) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0">
                  <Receipt className="w-6 h-6 text-zinc-300" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-zinc-400 block">Network Gross Sales</span>
                  <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                    ₹{networkTotals.totalSalesToday.toLocaleString("en-IN")}
                  </p>
                  <span className="text-xs text-zinc-400 block mt-0.5">{networkTotals.totalWrapsToday.toLocaleString()} Wraps Carved</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6 text-zinc-300" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-zinc-400 block">Franchise Outlets</span>
                  <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                    {outlets.length} Branches
                  </p>
                  <span className="text-xs text-zinc-400 block mt-0.5">{outlets.filter(o => o.status === "active").length} Live & Billing</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0">
                  <Flame className="w-6 h-6 text-orange-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-zinc-400 block">Network Meat Yield</span>
                  <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                    {networkTotals.avgSpitEfficiency}%
                  </p>
                  <span className="text-xs text-zinc-400 block mt-0.5">{networkTotals.activeSpitsCount} Spits Active</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0">
                  <DollarSign className="w-6 h-6 text-zinc-300" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-zinc-400 block">Monthly Royalty</span>
                  <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                    ₹{(networkTotals.totalRoyaltyCollected / 100000).toFixed(2)}L
                  </p>
                  <span className="text-xs text-zinc-400 block mt-0.5">Pending: ₹{networkTotals.totalRoyaltyPending.toLocaleString("en-IN")}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Multi-Branch Live Performance Matrix */}
          <div className="p-5 rounded-2xl bg-[#1f1f1f] border border-[#303030] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#303030] pb-3">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-orange-500" />
                  <span>Franchise Branch Performance Comparison Matrix</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Live sales velocity, target realization %, spit carving yield, and compliance status across all hubs.
                </p>
              </div>

              <Link href="/admin/outlets">
                <Button size="sm" variant="outline" className="text-xs font-bold border-[#303030] bg-[#161618] text-orange-400 rounded-xl gap-1">
                  <span>Manage Outlets & Credentials</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {outlets.map((outlet) => {
                const targetPercent = Math.min(100, Math.round((outlet.currentDaySales / outlet.dailyTargetSales) * 100)) || 0;
                return (
                  <div
                    key={outlet.id}
                    className="p-4 rounded-2xl bg-[#161618] border border-[#303030] hover:border-orange-500/60 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-black text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-md">
                          {outlet.code}
                        </span>
                        <span className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-md border",
                          outlet.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        )}>
                          {outlet.status === "active" ? "● Active & Billing" : "Onboarding"}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-white mt-2">{outlet.name}</h3>
                      <p className="text-xs text-zinc-400">{outlet.area}, {outlet.city}</p>

                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between items-baseline text-xs font-mono">
                          <span className="text-emerald-400 font-black text-base">₹{outlet.currentDaySales.toLocaleString("en-IN")}</span>
                          <span className="text-zinc-400 text-[11px]">Target: ₹{outlet.dailyTargetSales.toLocaleString("en-IN")} ({targetPercent}%)</span>
                        </div>
                        <Progress value={targetPercent} className="h-1.5 bg-[#1f1f1f]" />
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-[#303030] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 font-mono text-[11px]">
                        <span className="text-zinc-400">Wraps: <strong className="text-white">{outlet.currentDayWraps}</strong></span>
                        <span className="text-zinc-400">Yield: <strong className="text-amber-400">{outlet.spitEfficiency}%</strong></span>
                      </div>

                      <button
                        onClick={() => setSelectedOutletId(outlet.id)}
                        className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Audit Hub</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hourly Sales Trend & Product Mix (Optimized 12-col Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Sales Velocity Area Chart */}
            <Card className="lg:col-span-7 border-[#303030] bg-[#1f1f1f] shadow-xl rounded-3xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span>Hourly Network Velocity Curve (Today)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HQ_HOURLY_SALES}>
                      <defs>
                        <linearGradient id="hqSalesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#303030" vertical={false} />
                      <XAxis dataKey="hour" stroke="#b8b8c5" opacity={0.5} fontSize={11} tickLine={false} />
                      <YAxis stroke="#b8b8c5" opacity={0.5} fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#161618",
                          borderColor: "#383838",
                          borderRadius: "12px",
                          fontSize: "12px",
                          color: "#ffffff",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                        }}
                        itemStyle={{
                          color: "#ffffff",
                          fontWeight: 700,
                        }}
                        labelStyle={{
                          color: "#f97316",
                          fontWeight: 700,
                          marginBottom: "4px",
                        }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Gross Sales"]}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#hqSalesGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-5 border-[#303030] bg-[#1f1f1f] shadow-xl rounded-3xl flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-orange-500" />
                  <span>Category Revenue Share</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
                  {/* Left: Bigger Pie Chart */}
                  <div className="h-44 w-full sm:w-[48%] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={MENU_SHARE_DATA} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={4} dataKey="value">
                          {MENU_SHARE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#161618",
                            borderColor: "#383838",
                            borderRadius: "12px",
                            fontSize: "12px",
                            color: "#ffffff",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                          }}
                          itemStyle={{
                            color: "#ffffff",
                            fontWeight: 700,
                          }}
                          labelStyle={{
                            color: "#f97316",
                            fontWeight: 700,
                            marginBottom: "4px",
                          }}
                          formatter={(val: any) => [`${val}%`, "Share"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Right: Clean Aligned Breakdown */}
                  <div className="w-full sm:w-[52%] space-y-2">
                    {MENU_SHARE_DATA.map((item) => (
                      <div key={item.name} className="p-2.5 rounded-xl bg-[#161618] border border-[#303030] flex items-center justify-between gap-2 shadow-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-zinc-300 text-xs font-semibold truncate">{item.name}</span>
                        </div>
                        <span className="font-mono font-black text-white text-xs bg-[#1f1f1f] px-2 py-0.5 rounded-lg border border-[#383838] shrink-0">
                          {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* ── FRANCHISE STORE OVERVIEW (CLEAN & PROFESSIONAL SAAS) ─────────── */
        <div className="space-y-6">
          {/* Daily Store Lifecycle & Dynamic Shift Session Banner */}
          {dailySession.status !== "OPEN" ? (
            /* CASE 1: Store is Closed / Morning before Opening */
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#1c1815] via-[#1a1a1c] to-[#141416] border border-orange-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-orange-950/20">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">
                      Store is Closed · Ready for Today&apos;s Trading?
                    </span>
                    <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded-full border border-orange-500/30">
                      Morning Shift
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Open counter register, set initial cash float (₹2,000) & record morning spit meat weight.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setIsOpeningModalOpen(true)}
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg shadow-orange-600/30 flex items-center gap-2 cursor-pointer w-full md:w-auto justify-center"
              >
                <Sun className="w-4 h-4" />
                <span>Start Fresh Day & Open Till</span>
              </Button>
            </div>
          ) : (
            /* CASE 2: Store is OPEN & Live Billing */
            <div className={cn(
              "p-4 sm:p-5 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm transition-all",
              (typeof window !== "undefined" && (new Date().getHours() >= 19 || new Date().getHours() < 5))
                ? "bg-gradient-to-r from-[#171520] via-[#1a1a1c] to-[#141416] border-indigo-500/30"
                : "bg-[#1a1a1c] border-[#2e2e30]"
            )}>
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={cn(
                  "w-3 h-3 rounded-full shrink-0",
                  (typeof window !== "undefined" && (new Date().getHours() >= 19 || new Date().getHours() < 5))
                    ? "bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.8)] animate-pulse"
                    : "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"
                )} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-white flex items-center gap-1.5">
                      {(typeof window !== "undefined" && (new Date().getHours() >= 19 || new Date().getHours() < 5)) ? "🌙 Evening Trading Active" : "🟢 Store Open & Live Billing"}
                    </span>
                    <span className="text-[10px] bg-[#242427] border border-[#383838] text-zinc-300 font-mono font-bold px-2 py-0.5 rounded-md">
                      Float: ₹{dailySession.openingFloat.toLocaleString()} · Spit 1: {dailySession.spit1MountedKg}kg
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Cashier: <strong className="text-zinc-200">{dailySession.cashierName}</strong> · Spit Master: <strong className="text-zinc-200">{dailySession.spitMasterName}</strong>
                    {dailySession.openedAt && <span className="text-zinc-500 ml-1.5 font-mono">({dailySession.openedAt})</span>}
                  </p>
                </div>
              </div>

              {/* Dynamic Single Action Button according to Shift / Time */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <Button
                  type="button"
                  onClick={() => setIsClosingModalOpen(true)}
                  className={cn(
                    "text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer w-full md:w-auto justify-center",
                    (typeof window !== "undefined" && (new Date().getHours() >= 19 || new Date().getHours() < 5))
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30"
                      : "bg-[#252528] hover:bg-indigo-600 text-zinc-300 hover:text-white border border-[#383838]"
                  )}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>{(typeof window !== "undefined" && (new Date().getHours() >= 19 || new Date().getHours() < 5)) ? "Close Store & File Z-Report" : "EOD Close (Z-Report)"}</span>
                </Button>
              </div>
            </div>
          )}

          {/* Top 4 Store KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0">
                  <Receipt className="w-6 h-6 text-zinc-300" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-zinc-400 block">Today's Sales</span>
                  <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                    ₹{outletTenderTotals.totalGrossRevenue.toLocaleString("en-IN")}
                  </p>
                  <span className="text-xs text-zinc-400 block mt-0.5">Live Gross Revenue</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0">
                  <Banknote className="w-6 h-6 text-zinc-300" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-zinc-400 block">Cash in Drawer</span>
                  <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                    ₹{outletTenderTotals.expectedCashInDrawer.toLocaleString("en-IN")}
                  </p>
                  <span className="text-xs text-zinc-400 block mt-0.5">Counter Register</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6 text-zinc-300" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-zinc-400 block">Orders Today</span>
                  <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                    {outletTenderTotals.totalOrdersToday}
                  </p>
                  <span className="text-xs text-zinc-400 block mt-0.5">
                    Avg Ticket: ₹{Math.round(outletTenderTotals.totalGrossRevenue / (outletTenderTotals.totalOrdersToday || 1))}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0">
                  <Flame className="w-6 h-6 text-orange-400" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-zinc-400 block">Spit Yield</span>
                  <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                    {currentOutlet.spitEfficiency}%
                  </p>
                  <span className="text-xs text-zinc-400 block mt-0.5">{currentOutlet.activeSpits} Spits Active</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Drawer Float Reconciliation Dropdown */}
          {showDrawerBreakdown && (
            <div className="p-4 rounded-2xl bg-[#161618] border border-[#2e2e30] text-xs font-mono space-y-2">
              <span className="text-xs font-bold text-zinc-300 block font-sans">Physical Register Cash Drawer Breakdown</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-zinc-300">
                <div className="p-2.5 rounded-xl bg-[#1f1f1f] border border-[#2e2e30]">
                  <span className="text-[10px] text-zinc-400 block font-sans">Opening Float</span>
                  <span className="font-bold text-white">₹{outletTenderTotals.openingCash.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1f1f1f] border border-[#2e2e30]">
                  <span className="text-[10px] text-zinc-400 block font-sans">+ Cash Sales</span>
                  <span className="font-bold text-emerald-400">₹{outletTenderTotals.cashSales.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1f1f1f] border border-[#2e2e30]">
                  <span className="text-[10px] text-zinc-400 block font-sans">- Petty Cash</span>
                  <span className="font-bold text-rose-400">₹{outletTenderTotals.pettyCashExpenses.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1f1f1f] border border-[#2e2e30]">
                  <span className="text-[10px] text-zinc-400 block font-sans">- Safe Drops</span>
                  <span className="font-bold text-zinc-200">₹{outletTenderTotals.safeDropsTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── CHARTS & GRAPHS SECTION ───────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Store Hourly Sales Velocity Area Chart */}
            <Card className="lg:col-span-7 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                  <span>Hourly Sales (Today)</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={STORE_HOURLY_SALES}>
                      <defs>
                        <linearGradient id="storeSalesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2e2e30" vertical={false} />
                      <XAxis dataKey="hour" stroke="#71717a" fontSize={11} tickLine={false} />
                      <YAxis stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#161618",
                          borderColor: "#333336",
                          borderRadius: "10px",
                          fontSize: "12px",
                          color: "#ffffff",
                        }}
                        itemStyle={{ color: "#ffffff", fontWeight: 600 }}
                        labelStyle={{ color: "#f97316", fontWeight: 600, marginBottom: "2px" }}
                        formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Gross Sales"]}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#storeSalesGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sales Channel Mix Pie Chart */}
            <Card className="lg:col-span-5 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-orange-400" />
                  <span>Channel Revenue Share</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center">
                <div className="flex flex-col sm:flex-row items-center gap-4 py-1">
                  {/* Left: Pie Chart */}
                  <div className="h-44 w-full sm:w-[48%] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={channelChartData} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={4} dataKey="value">
                          {channelChartData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#161618",
                            borderColor: "#333336",
                            borderRadius: "10px",
                            fontSize: "12px",
                            color: "#ffffff",
                          }}
                          itemStyle={{ color: "#ffffff", fontWeight: 600 }}
                          labelStyle={{ color: "#f97316", fontWeight: 600, marginBottom: "2px" }}
                          formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Revenue"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Right: Clean Aligned Breakdown Cards */}
                  <div className="w-full sm:w-[52%] space-y-2">
                    {channelChartData.map((item) => {
                      const percent = Math.round((item.value / totalChannelRevenue) * 100) || 0;
                      return (
                        <div key={item.name} className="p-2.5 rounded-xl bg-[#141416] border border-[#27272a] flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <span className="text-zinc-300 text-xs font-medium truncate">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono shrink-0">
                            <span className="text-white font-bold text-xs">₹{item.value.toLocaleString()}</span>
                            <span className="text-xs text-zinc-400 font-medium">({percent}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── SPIT GAUGES & LIVE COUNTER STREAM (Clean, Minimal & Understandable) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Live Spit Roaster Gauges */}
            <Card className="lg:col-span-5 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardHeader className="pb-3 border-b border-[#27272a]">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Live Spit Roasters</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Spit #1: Chicken */}
                <div className="p-3.5 rounded-xl bg-[#141416] border border-[#27272a] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Chicken Spit #1</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">94.2% Yield</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                      <span>Carved: 19.5 kg</span>
                      <span>Remaining: 8.5 kg</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#242427] rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: "70%" }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1 border-t border-[#222225]">
                    <span>Mounted: <strong className="text-zinc-200">28.0 kg</strong></span>
                    <span>Carved: <strong className="text-zinc-200">19.5 kg</strong></span>
                    <span>Left: <strong className="text-emerald-400">8.5 kg</strong></span>
                  </div>
                </div>

                {/* Spit #2: Mutton */}
                <div className="p-3.5 rounded-xl bg-[#141416] border border-[#27272a] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Mutton Spit #2</span>
                    <span className="text-xs font-mono font-bold text-amber-400">92.8% Yield</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                      <span>Carved: 11.2 kg</span>
                      <span>Remaining: 6.8 kg</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#242427] rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "62%" }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1 border-t border-[#222225]">
                    <span>Mounted: <strong className="text-zinc-200">18.0 kg</strong></span>
                    <span>Carved: <strong className="text-zinc-200">11.2 kg</strong></span>
                    <span>Left: <strong className="text-emerald-400">6.8 kg</strong></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Punched Counter Orders */}
            <Card className="lg:col-span-7 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-[#27272a]">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-orange-400" />
                  <span>Recent Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#27272a] bg-[#141416] text-zinc-400 font-semibold text-[11px]">
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3 px-4">Time</th>
                        <th className="py-3 px-4">Channel</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#242427] text-[11px]">
                      {filteredOrders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-[#202023] transition-colors">
                          <td className="py-3 px-4 font-mono font-medium text-white">{order.orderNumber}</td>
                          <td className="py-3 px-4 text-zinc-400">{order.time}</td>
                          <td className="py-3 px-4 text-zinc-300">{order.channel}</td>
                          <td className="py-3 px-4 text-zinc-400">{order.paymentMethod}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-white">₹{order.totalAmount}</td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-emerald-400 font-medium">Completed</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Store Opening Wizard Modal */}
      <StoreOpeningModal
        isOpen={isOpeningModalOpen}
        onClose={() => setIsOpeningModalOpen(false)}
      />

      {/* Store EOD Closing & Z-Report Modal */}
      <StoreClosingModal
        isOpen={isClosingModalOpen}
        onClose={() => setIsClosingModalOpen(false)}
      />
    </div>
  );
}
