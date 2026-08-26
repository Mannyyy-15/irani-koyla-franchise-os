"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CalendarDays,
  TrendingUp,
  Flame,
  Receipt,
  Download,
  Search,
  Filter,
  DollarSign,
  ShoppingBag,
  Layers,
  ChevronDown,
  BarChart3,
  PieChart as PieIcon,
  Store,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  UtensilsCrossed,
  Package,
  Droplets,
  Truck,
  FileSpreadsheet,
  Clock,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useFranchise } from "@/lib/franchise-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/components/ui/cn";

// 31-Day Comprehensive Historical Data for August 2026
const AUGUST_DAILY_RECORDS = [
  { day: 1, date: "2026-08-01", weekday: "Sat", sales: 94500, orders: 128, chickenKg: 24.5, muttonKg: 10.5, totalMeatKg: 35.0, yield: 95.2, cash: 28400, online: 66100, wraps: 136 },
  { day: 2, date: "2026-08-02", weekday: "Sun", sales: 98200, orders: 134, chickenKg: 26.0, muttonKg: 11.0, totalMeatKg: 37.0, yield: 94.8, cash: 31200, online: 67000, wraps: 142 },
  { day: 3, date: "2026-08-03", weekday: "Mon", sales: 68400, orders: 94, chickenKg: 18.0, muttonKg: 7.0, totalMeatKg: 25.0, yield: 95.8, cash: 20500, online: 47900, wraps: 98 },
  { day: 4, date: "2026-08-04", weekday: "Tue", sales: 71200, orders: 98, chickenKg: 19.5, muttonKg: 7.5, totalMeatKg: 27.0, yield: 96.1, cash: 22000, online: 49200, wraps: 104 },
  { day: 5, date: "2026-08-05", weekday: "Wed", sales: 74500, orders: 102, chickenKg: 20.0, muttonKg: 8.0, totalMeatKg: 28.0, yield: 95.0, cash: 23100, online: 51400, wraps: 108 },
  { day: 6, date: "2026-08-06", weekday: "Thu", sales: 76800, orders: 106, chickenKg: 20.5, muttonKg: 8.5, totalMeatKg: 29.0, yield: 94.7, cash: 24200, online: 52600, wraps: 112 },
  { day: 7, date: "2026-08-07", weekday: "Fri", sales: 89400, orders: 122, chickenKg: 23.0, muttonKg: 10.0, totalMeatKg: 33.0, yield: 95.5, cash: 27800, online: 61600, wraps: 128 },
  { day: 8, date: "2026-08-08", weekday: "Sat", sales: 102500, orders: 140, chickenKg: 27.0, muttonKg: 11.5, totalMeatKg: 38.5, yield: 94.2, cash: 32500, online: 70000, wraps: 148 },
  { day: 9, date: "2026-08-09", weekday: "Sun", sales: 105800, orders: 145, chickenKg: 28.0, muttonKg: 12.0, totalMeatKg: 40.0, yield: 94.9, cash: 34000, online: 71800, wraps: 152 },
  { day: 10, date: "2026-08-10", weekday: "Mon", sales: 67200, orders: 92, chickenKg: 18.0, muttonKg: 6.5, totalMeatKg: 24.5, yield: 96.0, cash: 19800, online: 47400, wraps: 96 },
  { day: 11, date: "2026-08-11", weekday: "Tue", sales: 72900, orders: 100, chickenKg: 19.0, muttonKg: 8.0, totalMeatKg: 27.0, yield: 95.4, cash: 22400, online: 50500, wraps: 105 },
  { day: 12, date: "2026-08-12", weekday: "Wed", sales: 75400, orders: 104, chickenKg: 20.0, muttonKg: 8.0, totalMeatKg: 28.0, yield: 95.7, cash: 23800, online: 51600, wraps: 110 },
  { day: 13, date: "2026-08-13", weekday: "Thu", sales: 78200, orders: 108, chickenKg: 21.0, muttonKg: 8.5, totalMeatKg: 29.5, yield: 95.1, cash: 24500, online: 53700, wraps: 114 },
  { day: 14, date: "2026-08-14", weekday: "Fri", sales: 91600, orders: 125, chickenKg: 24.0, muttonKg: 10.0, totalMeatKg: 34.0, yield: 94.6, cash: 28900, online: 62700, wraps: 132 },
  { day: 15, date: "2026-08-15", weekday: "Sat", sales: 114500, orders: 158, chickenKg: 30.0, muttonKg: 13.0, totalMeatKg: 43.0, yield: 95.8, cash: 38000, online: 76500, wraps: 168 },
  { day: 16, date: "2026-08-16", weekday: "Sun", sales: 108200, orders: 148, chickenKg: 28.5, muttonKg: 12.0, totalMeatKg: 40.5, yield: 94.4, cash: 35200, online: 73000, wraps: 156 },
  { day: 17, date: "2026-08-17", weekday: "Mon", sales: 69500, orders: 95, chickenKg: 18.5, muttonKg: 7.0, totalMeatKg: 25.5, yield: 95.9, cash: 21000, online: 48500, wraps: 99 },
  { day: 18, date: "2026-08-18", weekday: "Tue", sales: 73800, orders: 102, chickenKg: 19.5, muttonKg: 7.5, totalMeatKg: 27.0, yield: 95.3, cash: 22800, online: 51000, wraps: 106 },
  { day: 19, date: "2026-08-19", weekday: "Wed", sales: 77200, orders: 106, chickenKg: 20.5, muttonKg: 8.5, totalMeatKg: 29.0, yield: 95.6, cash: 24100, online: 53100, wraps: 111 },
  { day: 20, date: "2026-08-20", weekday: "Thu", sales: 79500, orders: 109, chickenKg: 21.0, muttonKg: 8.5, totalMeatKg: 29.5, yield: 94.8, cash: 25000, online: 54500, wraps: 115 },
  { day: 21, date: "2026-08-21", weekday: "Fri", sales: 93800, orders: 128, chickenKg: 24.5, muttonKg: 10.5, totalMeatKg: 35.0, yield: 95.2, cash: 29500, online: 64300, wraps: 135 },
  { day: 22, date: "2026-08-22", weekday: "Sat", sales: 118400, orders: 162, chickenKg: 31.0, muttonKg: 13.5, totalMeatKg: 44.5, yield: 96.0, cash: 39200, online: 79200, wraps: 172 },
  { day: 23, date: "2026-08-23", weekday: "Sun", sales: 111500, orders: 152, chickenKg: 29.0, muttonKg: 12.5, totalMeatKg: 41.5, yield: 94.7, cash: 36000, online: 75500, wraps: 160 },
  { day: 24, date: "2026-08-24", weekday: "Mon", sales: 70400, orders: 96, chickenKg: 18.5, muttonKg: 7.0, totalMeatKg: 25.5, yield: 95.8, cash: 21500, online: 48900, wraps: 101 },
  { day: 25, date: "2026-08-25", weekday: "Tue", sales: 74600, orders: 103, chickenKg: 20.0, muttonKg: 8.0, totalMeatKg: 28.0, yield: 95.4, cash: 23400, online: 51200, wraps: 107 },
  { day: 26, date: "2026-08-26", weekday: "Wed", sales: 85400, orders: 112, chickenKg: 21.5, muttonKg: 8.5, totalMeatKg: 30.0, yield: 95.2, cash: 24850, online: 60550, wraps: 118 },
];

// Top Menu Items for the Month
const MONTHLY_MENU_LEADERBOARD = [
  { name: "Classic Koyla Chicken Shawarma", meatType: "Chicken", units: 1420, price: 90, revenue: 127800, meatUsedKg: 227.2, sharePercent: 36.2 },
  { name: "Smoked Charcoal Mutton Roll", meatType: "Mutton", units: 780, price: 130, revenue: 101400, meatUsedKg: 140.4, sharePercent: 28.7 },
  { name: "Koyla Jumbo Meat Platter", meatType: "Mixed", units: 410, price: 180, revenue: 73800, meatUsedKg: 102.5, sharePercent: 20.9 },
  { name: "Afghani Malai Chicken Wrap", meatType: "Chicken", units: 520, price: 110, revenue: 57200, meatUsedKg: 83.2, sharePercent: 16.2 },
  { name: "Spicy Peri-Peri Mutton Wrap", meatType: "Mutton", units: 340, price: 140, revenue: 47600, meatUsedKg: 61.2, sharePercent: 13.5 },
  { name: "Irani Special BBQ Chicken Roll", meatType: "Chicken", units: 480, price: 100, revenue: 48000, meatUsedKg: 76.8, sharePercent: 13.6 },
];

export default function MonthlyOverviewPage() {
  const { role, activeOutlet, outlets } = useFranchise();
  const isSuperAdmin = role === "SUPER_ADMIN";
  const currentOutlet = activeOutlet || outlets[0];

  const [selectedMonth, setSelectedMonth] = useState("2026-08");
  const [activeTab, setActiveTab] = useState<"meat" | "trends" | "menu" | "table">("meat");
  const [searchTableQuery, setSearchTableQuery] = useState("");
  const [filterHighSales, setFilterHighSales] = useState(false);

  // Aggregated Month-to-Date Metrics
  const totalMonthRevenue = AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.sales, 0);
  const totalMonthOrders = AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.orders, 0);
  const totalMonthWraps = AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.wraps, 0);
  
  const totalChickenLoadedKg = Number(AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.chickenKg, 0).toFixed(1));
  const totalMuttonLoadedKg = Number(AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.muttonKg, 0).toFixed(1));
  const totalMeatLoadedKg = Number((totalChickenLoadedKg + totalMuttonLoadedKg).toFixed(1));
  
  const avgMonthlyYield = (
    AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.yield, 0) / AUGUST_DAILY_RECORDS.length
  ).toFixed(1);

  const totalCashCollected = AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.cash, 0);
  const totalOnlineCollected = AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.online, 0);
  const avgDailySales = Math.round(totalMonthRevenue / AUGUST_DAILY_RECORDS.length);
  const royaltyAccrued5Percent = Math.round(totalMonthRevenue * 0.05);
  const estimatedFoodCogs = Math.round(totalMonthRevenue * 0.32);

  // Raw Material Breakdown
  const khubzPiecesConsumed = totalMonthWraps + 180; // pieces including mini platters
  const garlicToumConsumedKg = Math.round(totalMeatLoadedKg * 0.16); // 160g toum per kg meat
  const charcoalBagsKg = Math.round(AUGUST_DAILY_RECORDS.length * 7.5); // ~7.5kg coal per day

  // Meat Breakdown Pie Data
  const meatDistributionData = [
    { name: "Koyla Chicken", value: totalChickenLoadedKg, color: "#f97316" },
    { name: "Smoked Mutton", value: totalMuttonLoadedKg, color: "#a855f7" },
  ];

  // Channel Revenue Pie Data
  const channelData = [
    { name: "Walk-in Counter", value: Math.round(totalMonthRevenue * 0.42), color: "#10b981" },
    { name: "Zomato Delivery", value: Math.round(totalMonthRevenue * 0.33), color: "#ef4444" },
    { name: "Swiggy Delivery", value: Math.round(totalMonthRevenue * 0.25), color: "#f59e0b" },
  ];

  // Filtered Daily Table Records
  const filteredTableData = AUGUST_DAILY_RECORDS.filter((rec) => {
    const matchesSearch =
      rec.date.includes(searchTableQuery) ||
      rec.weekday.toLowerCase().includes(searchTableQuery.toLowerCase());
    const matchesHigh = filterHighSales ? rec.sales >= 90000 : true;
    return matchesSearch && matchesHigh;
  });

  const handleExportCSV = () => {
    const headers = "Date,Day,Sales (INR),Orders,Wraps,Chicken (kg),Mutton (kg),Total Meat (kg),Spit Yield %,Cash (INR),Online (INR)\n";
    const rows = AUGUST_DAILY_RECORDS.map(
      (r) => `${r.date},${r.weekday},${r.sales},${r.orders},${r.wraps},${r.chickenKg},${r.muttonKg},${r.totalMeatKg},${r.yield}%,${r.cash},${r.online}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `irani-koyla-${currentOutlet.code}-monthly-report-august-2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── TOP HEADER AREA ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black text-orange-500 uppercase tracking-widest leading-none flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-lg">
              <Store className="w-3.5 h-3.5" />
              <span>{currentOutlet.name} • {currentOutlet.code}</span>
            </span>
            <span className="text-[11px] font-mono text-zinc-400 bg-[#1f1f22] border border-[#303030] px-2.5 py-1 rounded-lg font-bold">
              🗓️ August 2026 (Month-to-Date)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1 flex items-center gap-2.5">
            <span>Monthly Store Intelligence & Meat Ledger</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Comprehensive monthly audit of gross revenue, chicken vs mutton tonnage, spit carving efficiency & channel P&L.
          </p>
        </div>

        {/* Right Header Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Month Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-[#1c1c1f] border border-[#333336] text-white text-xs font-bold px-3.5 py-2.5 pr-8 rounded-xl focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
            >
              <option value="2026-08">August 2026 (Current)</option>
              <option value="2026-07">July 2026 (₹22.4L)</option>
              <option value="2026-06">June 2026 (₹20.8L)</option>
              <option value="2026-05">May 2026 (₹19.2L)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Link href="/admin">
            <Button
              variant="outline"
              className="bg-[#1c1c1f] hover:bg-[#252528] border-[#333336] text-zinc-300 hover:text-white font-bold text-xs h-10 px-3.5 rounded-xl cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-orange-400 mr-1.5" />
              <span>Today&apos;s Live View</span>
            </Button>
          </Link>

          <Button
            onClick={handleExportCSV}
            className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider h-10 px-4 rounded-xl shadow-lg shadow-orange-600/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* ── TOP 5 MONTHLY HERO SCORECARDS ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Metric 1: Monthly Gross Sales */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 block">Monthly Gross Sales</span>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +16.8%
              </span>
            </div>
            <p className="text-2xl font-bold text-white font-mono tracking-tight mt-1.5">
              ₹{totalMonthRevenue.toLocaleString("en-IN")}
            </p>
            <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 pt-2 border-t border-[#262629]">
              <span>{totalMonthOrders.toLocaleString()} Orders</span>
              <span className="font-mono text-zinc-300">Avg ₹{avgDailySales.toLocaleString()}/day</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Total Mutton Consumed */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-purple-300 block">Mutton Consumed</span>
              <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                Smoked Charcoal
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-300 font-mono tracking-tight mt-1.5 flex items-baseline gap-1.5">
              {totalMuttonLoadedKg} <span className="text-sm font-bold text-zinc-400 font-sans">kg</span>
            </p>
            <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 pt-2 border-t border-[#262629]">
              <span>{Math.round(totalMuttonLoadedKg * 4.6)} Mutton Wraps</span>
              <span className="font-mono text-purple-400 font-bold">28.7% Share</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Total Chicken Consumed */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-orange-400 block">Chicken Consumed</span>
              <span className="text-[10px] font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                Koyla Marinated
              </span>
            </div>
            <p className="text-2xl font-bold text-orange-400 font-mono tracking-tight mt-1.5 flex items-baseline gap-1.5">
              {totalChickenLoadedKg} <span className="text-sm font-bold text-zinc-400 font-sans">kg</span>
            </p>
            <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 pt-2 border-t border-[#262629]">
              <span>{Math.round(totalChickenLoadedKg * 5.4)} Chicken Wraps</span>
              <span className="font-mono text-orange-400 font-bold">71.3% Share</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Total Meat Spit Yield */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 block">Avg Spit Carving Yield</span>
              <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Benchmark &gt;93%
              </span>
            </div>
            <p className="text-2xl font-bold text-white font-mono tracking-tight mt-1.5">
              {avgMonthlyYield}%
            </p>
            <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 pt-2 border-t border-[#262629]">
              <span>Total Meat: {totalMeatLoadedKg}kg</span>
              <span className="text-emerald-400 font-medium font-mono">0.8% Wastage</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric 5: Estimated Food Cost & Royalties */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400 block">Brand Royalty (5%)</span>
              <span className="text-[10px] font-mono text-zinc-400 bg-[#242427] px-2 py-0.5 rounded">
                Auto-Accrued
              </span>
            </div>
            <p className="text-2xl font-bold text-amber-400 font-mono tracking-tight mt-1.5">
              ₹{royaltyAccrued5Percent.toLocaleString("en-IN")}
            </p>
            <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 pt-2 border-t border-[#262629]">
              <span>COGS: ₹{(estimatedFoodCogs / 100000).toFixed(1)}L</span>
              <span className="font-mono text-zinc-300">32% Food Cost</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── TAB NAVIGATION BAR ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 border-b border-[#2a2a2d] pb-3 flex-wrap">
        <div className="flex items-center gap-2 bg-[#161618] p-1 rounded-2xl border border-[#2e2e30]">
          <button
            type="button"
            onClick={() => setActiveTab("meat")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
              activeTab === "meat"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Flame className="w-4 h-4" />
            <span>🥩 Meat & Material Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("trends")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
              activeTab === "trends"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            <span>📈 31-Day Daily Velocity</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("menu")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
              activeTab === "menu"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>🌯 Item Sales & Meat Share</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("table")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
              activeTab === "table"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>📋 Full Daily Shift Ledger</span>
          </button>
        </div>

        <div className="text-xs text-zinc-400 font-mono hidden sm:block">
          Data Verified • <strong className="text-emerald-400">{AUGUST_DAILY_RECORDS.length} Days Audited</strong>
        </div>
      </div>

      {/* ── TAB 1: RAW MATERIAL & MEAT UTILIZATION MATRIX ─────────────── */}
      {activeTab === "meat" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Box: Mutton vs Chicken In-Depth Card */}
            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-3xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span>Monthly Meat Spit Breakdown</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Total raw marinated meat mounted & carved in August 2026.</p>
                </div>
                <Badge className="bg-[#242427] text-zinc-300 border-[#383838] font-mono text-xs">
                  Total: {totalMeatLoadedKg} kg
                </Badge>
              </div>

              {/* Meat Cards Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Smoked Mutton Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#21162b] to-[#17131d] border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-300 uppercase tracking-wider">🥩 Smoked Mutton</span>
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">
                      {((totalMuttonLoadedKg / totalMeatLoadedKg) * 100).toFixed(1)}% Share
                    </span>
                  </div>
                  <p className="text-3xl font-black text-white font-mono">
                    {totalMuttonLoadedKg} <span className="text-sm font-bold text-zinc-400 font-sans">kg</span>
                  </p>
                  <div className="text-[11px] text-zinc-300 space-y-1 font-mono pt-2 border-t border-purple-500/20">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total Cones Mounted:</span>
                      <strong className="text-white">26 Cones</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Avg Mutton Spit Yield:</span>
                      <strong className="text-emerald-400">95.1%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Est. Mutton Revenue:</span>
                      <strong className="text-purple-300">₹{(totalMonthRevenue * 0.38).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                {/* Koyla Chicken Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-[#2a1a12] to-[#1a1410] border border-orange-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-orange-400 uppercase tracking-wider">🍗 Koyla Chicken</span>
                    <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded">
                      {((totalChickenLoadedKg / totalMeatLoadedKg) * 100).toFixed(1)}% Share
                    </span>
                  </div>
                  <p className="text-3xl font-black text-white font-mono">
                    {totalChickenLoadedKg} <span className="text-sm font-bold text-zinc-400 font-sans">kg</span>
                  </p>
                  <div className="text-[11px] text-zinc-300 space-y-1 font-mono pt-2 border-t border-orange-500/20">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total Cones Mounted:</span>
                      <strong className="text-white">31 Cones</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Avg Chicken Spit Yield:</span>
                      <strong className="text-emerald-400">95.6%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Est. Chicken Revenue:</span>
                      <strong className="text-orange-300">₹{(totalMonthRevenue * 0.62).toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Meat Ratio Donut */}
              <div className="p-4 rounded-2xl bg-[#141416] border border-[#2a2a2d] flex items-center justify-between gap-4">
                <div className="w-32 h-32 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={meatDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={54}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {meatDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-zinc-300 font-medium">Chicken Koyla</span>
                    </div>
                    <span className="font-mono font-bold text-white">{totalChickenLoadedKg} kg (71%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-zinc-300 font-medium">Smoked Mutton</span>
                    </div>
                    <span className="font-mono font-bold text-white">{totalMuttonLoadedKg} kg (29%)</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 pt-1 border-t border-[#262629]">
                    Overall spit efficiency: <strong>95.4%</strong> (Well above brand standard benchmark of 93.0%).
                  </p>
                </div>
              </div>
            </Card>

            {/* Right Box: Associated Consumables & Stock Flow */}
            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-500" />
                  <span>Associated Consumables & Bread Ledger</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Complementary ingredients and packaging inventory burned.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Khubz Lebanese Bread */}
                <div className="p-3.5 rounded-2xl bg-[#151518] border border-[#2a2a2e] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">🫓 Khubz Bread (Pcs)</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">98.4% utilization</span>
                  </div>
                  <p className="text-xl font-bold font-mono text-white">{khubzPiecesConsumed.toLocaleString()} pcs</p>
                  <span className="text-[11px] text-zinc-500 block">342 Central Bakery Packs</span>
                </div>

                {/* Garlic Toum & Specialty Sauces */}
                <div className="p-3.5 rounded-2xl bg-[#151518] border border-[#2a2a2e] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">🧄 Garlic Toum Sauce</span>
                    <span className="text-[10px] font-mono text-zinc-400 bg-[#242427] px-1.5 py-0.5 rounded">Central Batch</span>
                  </div>
                  <p className="text-xl font-bold font-mono text-white">{garlicToumConsumedKg} kg</p>
                  <span className="text-[11px] text-zinc-500 block">Avg 35g sauce per wrap</span>
                </div>

                {/* Koyla Hardwood Charcoal */}
                <div className="p-3.5 rounded-2xl bg-[#151518] border border-[#2a2a2e] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">🔥 Charcoal (Koyla)</span>
                    <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">Grade-A Lump</span>
                  </div>
                  <p className="text-xl font-bold font-mono text-white">{charcoalBagsKg} kg</p>
                  <span className="text-[11px] text-zinc-500 block">~7.8 kg consumed per day</span>
                </div>

                {/* Branded Foil & Wrap Packaging */}
                <div className="p-3.5 rounded-2xl bg-[#151518] border border-[#2a2a2e] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">📦 Branded Wrappers</span>
                    <span className="text-[10px] font-mono text-zinc-400 bg-[#242427] px-1.5 py-0.5 rounded">Irani Foil</span>
                  </div>
                  <p className="text-xl font-bold font-mono text-white">{(totalMonthWraps + 120).toLocaleString()} rolls</p>
                  <span className="text-[11px] text-zinc-500 block">0.3% wrap damage rate</span>
                </div>
              </div>

              {/* Central Supply Chain Inward Re-order Alert */}
              <div className="p-4 rounded-2xl bg-orange-600/10 border border-orange-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-orange-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Need to Re-order Central Supplies for Next Month?</h4>
                    <p className="text-[11px] text-zinc-400">Order marinated raw chicken batches and spice rubs directly from HQ.</p>
                  </div>
                </div>
                <Link href="/admin/supply-chain">
                  <Button className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shrink-0 cursor-pointer">
                    Supply Portal &rarr;
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB 2: 31-DAY DAILY SALES & MEAT VELOCITY CHART ───────────── */}
      {activeTab === "trends" && (
        <div className="space-y-6">
          <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span>August 2026 Daily Sales & Spit Weight Correlation</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Daily revenue (₹) tracking hand-in-hand with total meat kilograms carved.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-orange-400 font-bold">
                  <span className="w-3 h-3 rounded bg-orange-500 inline-block" /> Daily Revenue (₹)
                </span>
                <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                  <span className="w-3 h-3 rounded bg-purple-500 inline-block" /> Meat Consumed (kg)
                </span>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={AUGUST_DAILY_RECORDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2d" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `Aug ${val}`}
                  />
                  <YAxis
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f1f22",
                      borderColor: "#333",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#fff",
                    }}
                    formatter={(value: any, name: any) => {
                      if (name === "sales") return [`₹${Number(value).toLocaleString()}`, "Gross Revenue"];
                      if (name === "totalMeatKg") return [`${value} kg`, "Total Meat Loaded"];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `August ${label}, 2026`}
                  />
                  <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} name="sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom 3 Channel Revenue Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#262629]">
              {channelData.map((c) => (
                <div key={c.name} className="p-4 rounded-2xl bg-[#141416] border border-[#2a2a2e] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 block">{c.name}</span>
                    <p className="text-lg font-black text-white font-mono mt-0.5">₹{c.value.toLocaleString()}</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                    {Math.round((c.value / totalMonthRevenue) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB 3: TOP MENU ITEMS & VELOCITY MATRIX ───────────────────── */}
      {activeTab === "menu" && (
        <div className="space-y-6">
          <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                  <span>August 2026 Menu Item Leaderboard & Meat Demand</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Ranking top revenue generators and their direct meat consumption.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#28282b] text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Meat Protein</th>
                    <th className="py-3 px-4 text-right">Units Sold</th>
                    <th className="py-3 px-4 text-right">Price</th>
                    <th className="py-3 px-4 text-right">Total Meat (kg)</th>
                    <th className="py-3 px-4 text-right">Gross Sales (₹)</th>
                    <th className="py-3 px-4 text-right">Rev Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242427]">
                  {MONTHLY_MENU_LEADERBOARD.map((item, idx) => (
                    <tr key={item.name} className="hover:bg-[#202023] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#262629] text-zinc-400 font-mono text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span>{item.name}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          className={cn(
                            "text-[10px] font-mono font-bold",
                            item.meatType === "Mutton"
                              ? "bg-purple-500/15 text-purple-300 border-purple-500/30"
                              : item.meatType === "Chicken"
                              ? "bg-orange-500/15 text-orange-400 border-orange-500/30"
                              : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                          )}
                        >
                          {item.meatType}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-zinc-200">{item.units.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-zinc-400">₹{item.price}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-orange-400">{item.meatUsedKg} kg</td>
                      <td className="py-3.5 px-4 text-right font-mono font-black text-white">₹{item.revenue.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">{item.sharePercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB 4: COMPLETE DAY-BY-DAY HISTORICAL SHIFT REGISTER ───────── */}
      {activeTab === "table" && (
        <div className="space-y-4">
          <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-orange-500" />
                  <span>August 2026 Daily Shifts & Meat Carving Ledger</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Detailed day-by-day record of revenue, orders and spit weights.</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by date / day..."
                    value={searchTableQuery}
                    onChange={(e) => setSearchTableQuery(e.target.value)}
                    className="h-9 pl-8 pr-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={() => setFilterHighSales(!filterHighSales)}
                  className={cn(
                    "h-9 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    filterHighSales
                      ? "bg-orange-600 text-white border-orange-500"
                      : "bg-[#141416] border-[#2e2e30] text-zinc-400 hover:text-white"
                  )}
                >
                  <Filter className="w-3.5 h-3.5 mr-1" />
                  <span>Peak Days (&gt;₹90k)</span>
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#28282b] text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Day</th>
                    <th className="py-3 px-3 text-right">Gross Sales</th>
                    <th className="py-3 px-3 text-right">Orders</th>
                    <th className="py-3 px-3 text-right">Wraps</th>
                    <th className="py-3 px-3 text-right">Chicken (kg)</th>
                    <th className="py-3 px-3 text-right">Mutton (kg)</th>
                    <th className="py-3 px-3 text-right">Total Meat</th>
                    <th className="py-3 px-3 text-right">Spit Yield</th>
                    <th className="py-3 px-3 text-right">Cash In</th>
                    <th className="py-3 px-3 text-right">Online In</th>
                    <th className="py-3 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242427] font-mono">
                  {filteredTableData.map((row) => (
                    <tr key={row.date} className="hover:bg-[#202023] transition-colors">
                      <td className="py-3 px-3 font-medium text-white">{row.date}</td>
                      <td className="py-3 px-3 text-zinc-400 font-sans font-bold">{row.weekday}</td>
                      <td className="py-3 px-3 text-right font-black text-white">₹{row.sales.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right text-zinc-300">{row.orders}</td>
                      <td className="py-3 px-3 text-right text-zinc-300">{row.wraps}</td>
                      <td className="py-3 px-3 text-right text-orange-400 font-bold">{row.chickenKg}kg</td>
                      <td className="py-3 px-3 text-right text-purple-400 font-bold">{row.muttonKg}kg</td>
                      <td className="py-3 px-3 text-right text-white font-black">{row.totalMeatKg}kg</td>
                      <td className="py-3 px-3 text-right text-emerald-400">{row.yield}%</td>
                      <td className="py-3 px-3 text-right text-zinc-400">₹{row.cash.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right text-zinc-400">₹{row.online.toLocaleString()}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-sans font-bold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Audited
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
