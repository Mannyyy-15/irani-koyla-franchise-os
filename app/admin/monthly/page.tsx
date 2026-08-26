"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  TrendingUp,
  Flame,
  Receipt,
  Download,
  Search,
  Filter,
  ShoppingBag,
  ChevronDown,
  BarChart3,
  Store,
  ArrowUpRight,
  CheckCircle2,
  UtensilsCrossed,
  Package,
  Clock,
  Trophy,
  Zap,
  Layers,
  ArrowRight,
  Check,
  Percent,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useFranchise } from "@/lib/franchise-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/components/ui/cn";

// 26 Full-Day Historical Records for August 2026 with Peak Rush Times
const AUGUST_DAILY_RECORDS = [
  { day: 1, date: "2026-08-01", weekday: "Saturday", sales: 94500, orders: 128, chickenKg: 24.5, muttonKg: 10.5, totalMeatKg: 35.0, yield: 95.2, cash: 28400, online: 66100, wraps: 136, peakHour: "09:30 PM", peakHourSales: 18500 },
  { day: 2, date: "2026-08-02", weekday: "Sunday", sales: 98200, orders: 134, chickenKg: 26.0, muttonKg: 11.0, totalMeatKg: 37.0, yield: 94.8, cash: 31200, online: 67000, wraps: 142, peakHour: "09:00 PM", peakHourSales: 21000 },
  { day: 3, date: "2026-08-03", weekday: "Monday", sales: 68400, orders: 94, chickenKg: 18.0, muttonKg: 7.0, totalMeatKg: 25.0, yield: 95.8, cash: 20500, online: 47900, wraps: 98, peakHour: "08:30 PM", peakHourSales: 14200 },
  { day: 4, date: "2026-08-04", weekday: "Tuesday", sales: 71200, orders: 98, chickenKg: 19.5, muttonKg: 7.5, totalMeatKg: 27.0, yield: 96.1, cash: 22000, online: 49200, wraps: 104, peakHour: "08:45 PM", peakHourSales: 15400 },
  { day: 5, date: "2026-08-05", weekday: "Wednesday", sales: 74500, orders: 102, chickenKg: 20.0, muttonKg: 8.0, totalMeatKg: 28.0, yield: 95.0, cash: 23100, online: 51400, wraps: 108, peakHour: "09:15 PM", peakHourSales: 16200 },
  { day: 6, date: "2026-08-06", weekday: "Thursday", sales: 76800, orders: 106, chickenKg: 20.5, muttonKg: 8.5, totalMeatKg: 29.0, yield: 94.7, cash: 24200, online: 52600, wraps: 112, peakHour: "09:00 PM", peakHourSales: 16800 },
  { day: 7, date: "2026-08-07", weekday: "Friday", sales: 89400, orders: 122, chickenKg: 23.0, muttonKg: 10.0, totalMeatKg: 33.0, yield: 95.5, cash: 27800, online: 61600, wraps: 128, peakHour: "10:00 PM", peakHourSales: 19400 },
  { day: 8, date: "2026-08-08", weekday: "Saturday", sales: 102500, orders: 140, chickenKg: 27.0, muttonKg: 11.5, totalMeatKg: 38.5, yield: 94.2, cash: 32500, online: 70000, wraps: 148, peakHour: "09:30 PM", peakHourSales: 22800 },
  { day: 9, date: "2026-08-09", weekday: "Sunday", sales: 105800, orders: 145, chickenKg: 28.0, muttonKg: 12.0, totalMeatKg: 40.0, yield: 94.9, cash: 34000, online: 71800, wraps: 152, peakHour: "09:15 PM", peakHourSales: 23500 },
  { day: 10, date: "2026-08-10", weekday: "Monday", sales: 67200, orders: 92, chickenKg: 18.0, muttonKg: 6.5, totalMeatKg: 24.5, yield: 96.0, cash: 19800, online: 47400, wraps: 96, peakHour: "08:15 PM", peakHourSales: 13800 },
  { day: 11, date: "2026-08-11", weekday: "Tuesday", sales: 72900, orders: 100, chickenKg: 19.0, muttonKg: 8.0, totalMeatKg: 27.0, yield: 95.4, cash: 22400, online: 50500, wraps: 105, peakHour: "08:45 PM", peakHourSales: 15600 },
  { day: 12, date: "2026-08-12", weekday: "Wednesday", sales: 75400, orders: 104, chickenKg: 20.0, muttonKg: 8.0, totalMeatKg: 28.0, yield: 95.7, cash: 23800, online: 51600, wraps: 110, peakHour: "09:00 PM", peakHourSales: 16100 },
  { day: 13, date: "2026-08-13", weekday: "Thursday", sales: 78200, orders: 108, chickenKg: 21.0, muttonKg: 8.5, totalMeatKg: 29.5, yield: 95.1, cash: 24500, online: 53700, wraps: 114, peakHour: "09:15 PM", peakHourSales: 17200 },
  { day: 14, date: "2026-08-14", weekday: "Friday", sales: 91600, orders: 125, chickenKg: 24.0, muttonKg: 10.0, totalMeatKg: 34.0, yield: 94.6, cash: 28900, online: 62700, wraps: 132, peakHour: "10:15 PM", peakHourSales: 20500 },
  { day: 15, date: "2026-08-15", weekday: "Saturday", sales: 114500, orders: 158, chickenKg: 30.0, muttonKg: 13.0, totalMeatKg: 43.0, yield: 95.8, cash: 38000, online: 76500, wraps: 168, peakHour: "09:45 PM", peakHourSales: 25400 },
  { day: 16, date: "2026-08-16", weekday: "Sunday", sales: 108200, orders: 148, chickenKg: 28.5, muttonKg: 12.0, totalMeatKg: 40.5, yield: 94.4, cash: 35200, online: 73000, wraps: 156, peakHour: "09:00 PM", peakHourSales: 24100 },
  { day: 17, date: "2026-08-17", weekday: "Monday", sales: 69500, orders: 95, chickenKg: 18.5, muttonKg: 7.0, totalMeatKg: 25.5, yield: 95.9, cash: 21000, online: 48500, wraps: 99, peakHour: "08:30 PM", peakHourSales: 14600 },
  { day: 18, date: "2026-08-18", weekday: "Tuesday", sales: 73800, orders: 102, chickenKg: 19.5, muttonKg: 7.5, totalMeatKg: 27.0, yield: 95.3, cash: 22800, online: 51000, wraps: 106, peakHour: "08:45 PM", peakHourSales: 15900 },
  { day: 19, date: "2026-08-19", weekday: "Wednesday", sales: 77200, orders: 106, chickenKg: 20.5, muttonKg: 8.5, totalMeatKg: 29.0, yield: 95.6, cash: 24100, online: 53100, wraps: 111, peakHour: "09:00 PM", peakHourSales: 16700 },
  { day: 20, date: "2026-08-20", weekday: "Thursday", sales: 79500, orders: 109, chickenKg: 21.0, muttonKg: 8.5, totalMeatKg: 29.5, yield: 94.8, cash: 25000, online: 54500, wraps: 115, peakHour: "09:30 PM", peakHourSales: 17800 },
  { day: 21, date: "2026-08-21", weekday: "Friday", sales: 93800, orders: 128, chickenKg: 24.5, muttonKg: 10.5, totalMeatKg: 35.0, yield: 95.2, cash: 29500, online: 64300, wraps: 135, peakHour: "10:00 PM", peakHourSales: 21200 },
  // Highest Day of the Month: Aug 22 (Saturday)
  { day: 22, date: "2026-08-22", weekday: "Saturday", sales: 118400, orders: 162, chickenKg: 31.0, muttonKg: 13.5, totalMeatKg: 44.5, yield: 96.0, cash: 39200, online: 79200, wraps: 172, peakHour: "09:15 PM", peakHourSales: 26800, isBestDay: true },
  { day: 23, date: "2026-08-23", weekday: "Sunday", sales: 111500, orders: 152, chickenKg: 29.0, muttonKg: 12.5, totalMeatKg: 41.5, yield: 94.7, cash: 36000, online: 75500, wraps: 160, peakHour: "09:00 PM", peakHourSales: 24600 },
  { day: 24, date: "2026-08-24", weekday: "Monday", sales: 70400, orders: 96, chickenKg: 18.5, muttonKg: 7.0, totalMeatKg: 25.5, yield: 95.8, cash: 21500, online: 48900, wraps: 101, peakHour: "08:30 PM", peakHourSales: 14800 },
  { day: 25, date: "2026-08-25", weekday: "Tuesday", sales: 74600, orders: 103, chickenKg: 20.0, muttonKg: 8.0, totalMeatKg: 28.0, yield: 95.4, cash: 23400, online: 51200, wraps: 107, peakHour: "08:45 PM", peakHourSales: 16200 },
  { day: 26, date: "2026-08-26", weekday: "Wednesday", sales: 85400, orders: 112, chickenKg: 21.5, muttonKg: 8.5, totalMeatKg: 30.0, yield: 95.2, cash: 24850, online: 60550, wraps: 118, peakHour: "09:10 PM", peakHourSales: 18600 },
];

// Monthly Aggregate Hourly Timing Distribution (Where volume occurs during operating hours)
const MONTHLY_HOURLY_RUSH_CURVE = [
  { hour: "11:00 AM", sales: 38000, orders: 54, share: "1.7%", phase: "Pre-Lunch" },
  { hour: "12:00 PM", sales: 98000, orders: 142, share: "4.4%", phase: "Lunch" },
  { hour: "01:00 PM", sales: 215000, orders: 310, share: "9.6%", phase: "Lunch Peak" },
  { hour: "02:00 PM", sales: 240000, orders: 345, share: "10.7%", phase: "Lunch Peak" },
  { hour: "03:00 PM", sales: 135000, orders: 195, share: "6.0%", phase: "Post-Lunch" },
  { hour: "04:00 PM", sales: 78000, orders: 112, share: "3.5%", phase: "Afternoon Prep" },
  { hour: "05:00 PM", sales: 92000, orders: 130, share: "4.1%", phase: "Evening Tea" },
  { hour: "06:00 PM", sales: 165000, orders: 235, share: "7.3%", phase: "Snack Rush" },
  { hour: "07:00 PM", sales: 260000, orders: 370, share: "11.6%", phase: "Dinner Start" },
  { hour: "08:00 PM", sales: 345000, orders: 485, share: "15.4%", phase: "Dinner Rush" },
  { hour: "09:00 PM", sales: 382000, orders: 535, share: "17.0%", phase: "Peak Hour 🏆" },
  { hour: "10:00 PM", sales: 310000, orders: 430, share: "13.8%", phase: "Late Dinner" },
  { hour: "11:00 PM", sales: 145000, orders: 202, share: "6.5%", phase: "Late Night" },
  { hour: "12:00 AM", sales: 48000, orders: 68, share: "2.1%", phase: "Closing" },
];

// Day of Week Sales Benchmark
const DAY_OF_WEEK_AVERAGES = [
  { day: "Monday", avgSales: 68875, avgMeatKg: 25.1, peakTime: "08:30 PM", color: "#71717a" },
  { day: "Tuesday", avgSales: 73125, avgMeatKg: 27.3, peakTime: "08:45 PM", color: "#71717a" },
  { day: "Wednesday", avgSales: 78125, avgMeatKg: 28.8, peakTime: "09:05 PM", color: "#71717a" },
  { day: "Thursday", avgSales: 78167, avgMeatKg: 29.3, peakTime: "09:15 PM", color: "#71717a" },
  { day: "Friday", avgSales: 91600, avgMeatKg: 34.0, peakTime: "10:05 PM", color: "#f59e0b" },
  { day: "Saturday", avgSales: 107475, avgMeatKg: 40.3, peakTime: "09:30 PM", color: "#f97316" },
  { day: "Sunday", avgSales: 105925, avgMeatKg: 39.8, peakTime: "09:15 PM", color: "#ec4899" },
];

export default function MonthlyOverviewPage() {
  const { role, activeOutlet, outlets } = useFranchise();
  const currentOutlet = activeOutlet || outlets[0];

  const [selectedMonth, setSelectedMonth] = useState("2026-08");
  const [activeViewMode, setActiveViewMode] = useState<"diagrams" | "timeline" | "shifts">("diagrams");
  const [searchTableQuery, setSearchTableQuery] = useState("");
  const [filterHighSales, setFilterHighSales] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState<typeof AUGUST_DAILY_RECORDS[0] | null>(null);

  // Month Aggregations
  const totalMonthRevenue = AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.sales, 0);
  const totalMonthOrders = AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.orders, 0);
  const totalMonthWraps = AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.wraps, 0);
  
  const totalChickenLoadedKg = Number(AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.chickenKg, 0).toFixed(1));
  const totalMuttonLoadedKg = Number(AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.muttonKg, 0).toFixed(1));
  const totalMeatLoadedKg = Number((totalChickenLoadedKg + totalMuttonLoadedKg).toFixed(1));
  
  const avgMonthlyYield = (
    AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.yield, 0) / AUGUST_DAILY_RECORDS.length
  ).toFixed(1);

  const avgDailySales = Math.round(totalMonthRevenue / AUGUST_DAILY_RECORDS.length);
  const bestDayRecord = AUGUST_DAILY_RECORDS.reduce((max, r) => r.sales > max.sales ? r : max, AUGUST_DAILY_RECORDS[0]);
  const lowestDayRecord = AUGUST_DAILY_RECORDS.reduce((min, r) => r.sales < min.sales ? r : min, AUGUST_DAILY_RECORDS[0]);

  // Channel Distribution
  const channelData = [
    { name: "Walk-in Counter", value: Math.round(totalMonthRevenue * 0.42), color: "#10b981", percent: "42%" },
    { name: "Zomato Online", value: Math.round(totalMonthRevenue * 0.33), color: "#ef4444", percent: "33%" },
    { name: "Swiggy Online", value: Math.round(totalMonthRevenue * 0.25), color: "#f59e0b", percent: "25%" },
  ];

  // Filtered Daily Records
  const filteredTableData = AUGUST_DAILY_RECORDS.filter((rec) => {
    const matchesSearch =
      rec.date.includes(searchTableQuery) ||
      rec.weekday.toLowerCase().includes(searchTableQuery.toLowerCase()) ||
      rec.peakHour.toLowerCase().includes(searchTableQuery.toLowerCase());
    const matchesHigh = filterHighSales ? rec.sales >= 90000 : true;
    return matchesSearch && matchesHigh;
  });

  const handleExportCSV = () => {
    const headers = "Date,Day,Sales (INR),Orders,Wraps,Peak Hour,Peak Hour Sales (INR),Chicken (kg),Mutton (kg),Total Meat (kg),Spit Yield %,Cash (INR),Online (INR)\n";
    const rows = AUGUST_DAILY_RECORDS.map(
      (r) => `${r.date},${r.weekday},${r.sales},${r.orders},${r.wraps},${r.peakHour},${r.peakHourSales},${r.chickenKg},${r.muttonKg},${r.totalMeatKg},${r.yield}%,${r.cash},${r.online}`
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
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      {/* ── TOP HEADER AREA ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-1">
          <p className="text-[11px] font-black text-orange-500 uppercase tracking-widest leading-none flex items-center gap-2">
            <Store className="w-3.5 h-3.5" />
            <span>{currentOutlet.name} • {currentOutlet.code}</span>
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-0.5">
              Monthly Store Intelligence & Meat Ledger
            </h1>
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-black bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center gap-1.5">
              <span>🗓️ August 2026 (Month-to-Date)</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Comprehensive audit of revenue peaks, day-by-day rush timings, and chicken vs. mutton spit tonnage.
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-[#1a1a1c] border border-[#2e2e30] hover:border-[#444] text-white text-xs font-bold px-3.5 py-2.5 pr-8 rounded-xl focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
            >
              <option value="2026-08">August 2026 (₹22.4L)</option>
              <option value="2026-07">July 2026 (₹20.8L)</option>
              <option value="2026-06">June 2026 (₹19.4L)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Link href="/admin">
            <Button
              variant="outline"
              className="bg-[#1a1a1c] hover:bg-[#252528] border-[#2e2e30] text-zinc-200 hover:text-white font-bold text-xs h-11 px-3.5 rounded-xl cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-orange-400 mr-1.5" />
              <span>Today&apos;s Live View</span>
            </Button>
          </Link>

          <Button
            onClick={handleExportCSV}
            className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider h-11 px-4 rounded-xl shadow-lg shadow-orange-600/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* ── 🏆 SPOTLIGHT BANNER: BEST PERFORMING DAY & PEAK RUSH HOUR ── */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#211710] via-[#1a171c] to-[#141416] border border-orange-500/30 shadow-xl shadow-orange-950/20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/30 shrink-0">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-md border border-orange-500/30">
                🏆 Best Performing Day of the Month
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {bestDayRecord.weekday}, {bestDayRecord.date}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              ₹{bestDayRecord.sales.toLocaleString()} Gross Revenue • {bestDayRecord.orders} Orders
            </h2>
            <div className="flex items-center gap-4 text-xs text-zinc-300 font-mono mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-amber-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Peak Hour: <strong>{bestDayRecord.peakHour} (₹{bestDayRecord.peakHourSales.toLocaleString()}/hr)</strong>
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-orange-400">
                Meat Carved: <strong>{bestDayRecord.totalMeatKg} kg</strong> ({bestDayRecord.chickenKg}kg Chicken + {bestDayRecord.muttonKg}kg Mutton)
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-emerald-400">
                Spit Yield: <strong>{bestDayRecord.yield}%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Comparison to Lowest Day */}
        <div className="p-3.5 rounded-2xl bg-[#151518] border border-[#2a2a2d] text-xs font-mono shrink-0 w-full lg:w-auto">
          <span className="text-[10px] text-zinc-400 block uppercase font-sans font-bold">Month Range Benchmark</span>
          <div className="flex items-center justify-between gap-6 mt-1 text-zinc-300">
            <div>
              <span className="text-zinc-500 block text-[10px]">Peak Saturday:</span>
              <strong className="text-emerald-400 text-sm">₹{bestDayRecord.sales.toLocaleString()}</strong>
            </div>
            <div className="h-6 w-px bg-[#2e2e30]" />
            <div>
              <span className="text-zinc-500 block text-[10px]">Lowest Monday:</span>
              <strong className="text-zinc-400 text-sm">₹{lowestDayRecord.sales.toLocaleString()}</strong>
            </div>
            <div className="h-6 w-px bg-[#2e2e30]" />
            <div>
              <span className="text-zinc-500 block text-[10px]">Daily Average:</span>
              <strong className="text-white text-sm">₹{avgDailySales.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOP 4 STORE OVERVIEW KPI CARDS (MATCHING OVERVIEW STYLE) ──── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Month Sales */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0">
              <Receipt className="w-6 h-6 text-zinc-300" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-zinc-400 block">Monthly Gross Sales</span>
              <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                ₹{totalMonthRevenue.toLocaleString("en-IN")}
              </p>
              <span className="text-xs text-emerald-400 font-medium block mt-0.5">
                +16.8% vs July (3,420 Wraps)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Mutton Consumed */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
              <Flame className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-purple-300 block">Smoked Mutton Used</span>
              <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                {totalMuttonLoadedKg} <span className="text-sm font-bold text-zinc-400 font-sans">kg</span>
              </p>
              <span className="text-xs text-purple-400 font-medium block mt-0.5">
                28.7% Protein Share (1,120 Wraps)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Chicken Consumed */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-400">
              <Flame className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-orange-400 block">Koyla Chicken Used</span>
              <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                {totalChickenLoadedKg} <span className="text-sm font-bold text-zinc-400 font-sans">kg</span>
              </p>
              <span className="text-xs text-orange-400 font-medium block mt-0.5">
                71.3% Protein Share (2,300 Wraps)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Month Spit Yield & Orders */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0 text-emerald-400">
              <Percent className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-zinc-400 block">Month Spit Yield</span>
              <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                {avgMonthlyYield}%
              </p>
              <span className="text-xs text-zinc-400 block mt-0.5">
                {totalMonthOrders.toLocaleString()} Total Orders (Avg ₹{Math.round(totalMonthRevenue / totalMonthOrders)})
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── VIEW SWITCHER TABS ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-[#2e2e30] pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-[#161618] p-1 rounded-2xl border border-[#2e2e30]">
          <button
            type="button"
            onClick={() => setActiveViewMode("diagrams")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
              activeViewMode === "diagrams"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Layers className="w-4 h-4" />
            <span>📊 Operational Diagrams & Rush Hours</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode("timeline")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
              activeViewMode === "timeline"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            <span>📈 All 26 Days Velocity Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewMode("shifts")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
              activeViewMode === "shifts"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Receipt className="w-4 h-4" />
            <span>📋 Full Day-by-Day Shift Ledger</span>
          </button>
        </div>

        <div className="text-xs text-zinc-400 font-mono hidden md:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>August 01 &rarr; August 26, 2026 (Audited)</span>
        </div>
      </div>

      {/* ── VIEW 1: OPERATIONAL DIAGRAMS & RUSH HOUR TIMING ─────────────── */}
      {activeViewMode === "diagrams" && (
        <div className="space-y-6">
          {/* DIAGRAM 1: Visual Meat Spit Tonnage Transformation Pipeline */}
          <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-3xl p-6 space-y-5">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span>🥩 Monthly Meat Spit Yield & Conversion Pipeline Diagram</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Visual pipeline showing raw marinated meat loading &rarr; slow roasting &rarr; carved yield &rarr; finished wraps & revenue.
              </p>
            </div>

            {/* Visual Process Flow Cards with Flow Connectors */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              {/* Step 1: Raw Meat Inward */}
              <div className="p-4 rounded-2xl bg-[#141416] border border-[#2e2e30] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase font-black">
                    <span>Step 01</span>
                    <span className="text-orange-400">Inward</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">Marinated Meat Loaded</h4>
                  <p className="text-2xl font-black text-white font-mono mt-1">{totalMeatLoadedKg} <span className="text-xs text-zinc-400 font-sans">kg</span></p>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 pt-2 border-t border-[#222] space-y-1">
                  <div className="text-orange-400">🍗 Chicken: {totalChickenLoadedKg}kg (71%)</div>
                  <div className="text-purple-400">🥩 Mutton: {totalMuttonLoadedKg}kg (29%)</div>
                </div>
              </div>

              {/* Step 2: Roasting on Charcoal Spit */}
              <div className="p-4 rounded-2xl bg-[#141416] border border-orange-500/30 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-orange-400 uppercase font-black">
                    <span>Step 02</span>
                    <span className="text-orange-400">Roasting</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">Spit Mounted & Fired</h4>
                  <p className="text-2xl font-black text-orange-400 font-mono mt-1">57 Cones</p>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 pt-2 border-t border-[#222] space-y-1">
                  <div>🔥 Core Temp: &gt;78°C</div>
                  <div>🪵 Charcoal: 195kg Coal</div>
                </div>
              </div>

              {/* Step 3: Cooked Meat Carved Yield */}
              <div className="p-4 rounded-2xl bg-[#141416] border border-emerald-500/30 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 uppercase font-black">
                    <span>Step 03</span>
                    <span className="text-emerald-400">Carved Yield</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">Net Usable Meat</h4>
                  <p className="text-2xl font-black text-emerald-400 font-mono mt-1">825.2 <span className="text-xs text-zinc-400 font-sans">kg</span></p>
                </div>
                <div className="text-[11px] font-mono text-emerald-400 pt-2 border-t border-[#222] space-y-1 font-bold">
                  <div>✨ Efficiency: {avgMonthlyYield}%</div>
                  <div>🛡️ Scrap Loss: 0.8% (6.9kg)</div>
                </div>
              </div>

              {/* Step 4: Finished Shawarma Wraps */}
              <div className="p-4 rounded-2xl bg-[#141416] border border-[#2e2e30] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase font-black">
                    <span>Step 04</span>
                    <span className="text-zinc-300">Portions</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">Wraps & Rolls Served</h4>
                  <p className="text-2xl font-black text-white font-mono mt-1">3,420 <span className="text-xs text-zinc-400 font-sans">wraps</span></p>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 pt-2 border-t border-[#222] space-y-1">
                  <div>🫓 3,420 Khubz Pockets</div>
                  <div>🧄 138kg Garlic Toum</div>
                </div>
              </div>

              {/* Step 5: Monthly Revenue Generated */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#251810] to-[#171311] border border-orange-500/50 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-orange-400 uppercase font-black">
                    <span>Step 05</span>
                    <span className="text-emerald-400">Revenue</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">Gross Month Sales</h4>
                  <p className="text-2xl font-black text-white font-mono mt-1">₹22.4L</p>
                </div>
                <div className="text-[11px] font-mono text-zinc-300 pt-2 border-t border-orange-500/20 space-y-1">
                  <div className="text-emerald-400 font-bold">32% Food Cost COGS</div>
                  <div>₹1.12L Brand Royalty (5%)</div>
                </div>
              </div>
            </div>
          </Card>

          {/* DIAGRAM 2: Hourly Rush Curve & Day-of-Week Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 7 cols: Operating Hours Rush Velocity Curve */}
            <Card className="lg:col-span-7 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>Peak Rush Hours Breakdown (When Customers Order)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Operating timeline from 11:00 AM opening to 12:00 AM close.
                  </p>
                </div>
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 font-mono text-xs">
                  Peak: 8:30 PM - 10:00 PM
                </Badge>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MONTHLY_HOURLY_RUSH_CURVE}>
                    <defs>
                      <linearGradient id="rushGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2d" vertical={false} />
                    <XAxis dataKey="hour" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#161618",
                        borderColor: "#383838",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                      formatter={(val: any) => [`₹${Number(val).toLocaleString()} (${Math.round((val/totalMonthRevenue)*100)}% of month)`, "Monthly Volume"]}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2.5} fill="url(#rushGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* 3 Major Shift Phases Breakdown */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#262629] text-xs">
                <div className="p-3 rounded-xl bg-[#141416] border border-[#2a2a2d]">
                  <span className="text-zinc-500 text-[10px] block uppercase font-bold">Lunch (12PM - 4PM)</span>
                  <p className="text-base font-black text-white font-mono mt-0.5">₹6.9L (28%)</p>
                  <span className="text-[11px] text-zinc-400">960 Orders</span>
                </div>
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <span className="text-orange-400 text-[10px] block uppercase font-bold">Dinner Rush (7PM - 11PM)</span>
                  <p className="text-base font-black text-orange-400 font-mono mt-0.5">₹13.9L (62%)</p>
                  <span className="text-[11px] text-zinc-300">1,990 Orders</span>
                </div>
                <div className="p-3 rounded-xl bg-[#141416] border border-[#2a2a2d]">
                  <span className="text-zinc-500 text-[10px] block uppercase font-bold">Late Night (11PM+)</span>
                  <p className="text-base font-black text-white font-mono mt-0.5">₹1.6L (10%)</p>
                  <span className="text-[11px] text-zinc-400">470 Orders</span>
                </div>
              </div>
            </Card>

            {/* Right 5 cols: Day of Week Averages & Peak Times */}
            <Card className="lg:col-span-5 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span>Day-of-Week Sales & Peak Time Heatmap</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Comparison of average revenue and peak hour by day of week.
                </p>
              </div>

              <div className="space-y-2">
                {DAY_OF_WEEK_AVERAGES.map((item) => (
                  <div
                    key={item.day}
                    className={cn(
                      "p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all",
                      item.day === "Saturday" || item.day === "Sunday"
                        ? "bg-[#211710] border-orange-500/40 text-white font-bold"
                        : "bg-[#151518] border-[#2a2a2e] text-zinc-300"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-20 font-sans">{item.day}</span>
                      <span className="font-mono text-[11px] text-zinc-400 hidden sm:inline">
                        🥩 {item.avgMeatKg}kg
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-zinc-400">
                        Peak: <strong className="text-orange-400">{item.peakTime}</strong>
                      </span>
                      <span className="font-mono font-bold text-white bg-[#1e1e22] px-2 py-0.5 rounded border border-[#333]">
                        ₹{item.avgSales.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── VIEW 2: 26-DAY DAILY VELOCITY TIMELINE (ALL DAYS VISIBLE) ───── */}
      {activeViewMode === "timeline" && (
        <div className="space-y-6">
          <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-3xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  <span>August 01 &rarr; August 26 Day-by-Day Revenue Chart</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Click on any day bar to instantly inspect meat weight, orders, and peak rush hour details.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-orange-400 font-bold">
                  <span className="w-3 h-3 rounded bg-orange-500 inline-block" /> Daily Sales (₹)
                </span>
                <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                  <span className="w-3 h-3 rounded bg-purple-500 inline-block" /> Meat Loaded (kg)
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
                      backgroundColor: "#161618",
                      borderColor: "#383838",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#ffffff",
                    }}
                    formatter={(value: any, name: any) => {
                      if (name === "sales") return [`₹${Number(value).toLocaleString()}`, "Gross Revenue"];
                      if (name === "totalMeatKg") return [`${value} kg`, "Meat Loaded"];
                      return [value, name];
                    }}
                    labelFormatter={(label) => `August ${label}, 2026`}
                  />
                  <Bar
                    dataKey="sales"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                    name="sales"
                    onClick={(data) => setSelectedDayDetail(data as any)}
                    className="cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Selected Day Quick Inspector Drawer */}
            {selectedDayDetail && (
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between gap-4 animate-in fade-in">
                <div>
                  <span className="text-xs font-bold text-orange-400">
                    Selected: {selectedDayDetail.weekday}, {selectedDayDetail.date}
                  </span>
                  <div className="text-sm font-black text-white mt-0.5">
                    ₹{selectedDayDetail.sales.toLocaleString()} • {selectedDayDetail.orders} Orders • Peak Hour: {selectedDayDetail.peakHour} (₹{selectedDayDetail.peakHourSales.toLocaleString()})
                  </div>
                  <p className="text-xs text-zinc-300 font-mono mt-0.5">
                    Meat: {selectedDayDetail.totalMeatKg}kg ({selectedDayDetail.chickenKg}kg Chicken + {selectedDayDetail.muttonKg}kg Mutton) • Yield: {selectedDayDetail.yield}%
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDayDetail(null)}
                  className="bg-[#242427] border-[#383838] text-zinc-300 hover:text-white text-xs h-8 px-3 rounded-lg cursor-pointer"
                >
                  Dismiss
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── VIEW 3: FULL DAY-BY-DAY SHIFT LEDGER TABLE ─────────────────── */}
      {activeViewMode === "shifts" && (
        <div className="space-y-4">
          <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-orange-500" />
                  <span>August 2026 Daily Shift Ledger & Peak Times (All 26 Days)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Complete day-by-day breakdown of revenue, orders, meat weights, peak hours & cash reconciliation.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search date, day, peak time..."
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
                    <th className="py-3 px-3">Weekday</th>
                    <th className="py-3 px-3 text-right">Gross Sales</th>
                    <th className="py-3 px-3 text-right">Orders</th>
                    <th className="py-3 px-3">Peak Hour Rush</th>
                    <th className="py-3 px-3 text-right">Chicken (kg)</th>
                    <th className="py-3 px-3 text-right">Mutton (kg)</th>
                    <th className="py-3 px-3 text-right">Total Meat</th>
                    <th className="py-3 px-3 text-right">Spit Yield</th>
                    <th className="py-3 px-3 text-right">Cash In</th>
                    <th className="py-3 px-3 text-right">Online In</th>
                    <th className="py-3 px-3 text-center">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242427] font-mono">
                  {filteredTableData.map((row) => (
                    <tr
                      key={row.date}
                      className={cn(
                        "hover:bg-[#202023] transition-colors",
                        row.isBestDay ? "bg-orange-500/10" : ""
                      )}
                    >
                      <td className="py-3 px-3 font-medium text-white flex items-center gap-1.5">
                        {row.isBestDay && <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        <span>{row.date}</span>
                      </td>
                      <td className="py-3 px-3 text-zinc-400 font-sans font-bold">{row.weekday}</td>
                      <td className="py-3 px-3 text-right font-black text-white">₹{row.sales.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right text-zinc-300">{row.orders}</td>
                      <td className="py-3 px-3 text-orange-400 font-sans text-[11px] font-bold">
                        {row.peakHour} <span className="text-zinc-500 font-mono text-[10px]">(₹{row.peakHourSales.toLocaleString()})</span>
                      </td>
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
