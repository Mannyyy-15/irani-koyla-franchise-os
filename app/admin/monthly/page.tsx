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
  ShoppingBag,
  ChevronDown,
  Store,
  Clock,
  Trophy,
  Zap,
  Percent,
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useFranchise } from "@/lib/franchise-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Clean Day-by-Day Historical Records for August 2026 (Single Normal Spit Meat)
const AUGUST_DAILY_RECORDS = [
  { day: "01", date: "Aug 01", fullDate: "2026-08-01", weekday: "Sat", sales: 94500, orders: 128, meatKg: 35.0, yield: 95.2, cash: 28400, online: 66100, peakHour: "09:30 PM", peakSales: 18500 },
  { day: "02", date: "Aug 02", fullDate: "2026-08-02", weekday: "Sun", sales: 98200, orders: 134, meatKg: 37.0, yield: 94.8, cash: 31200, online: 67000, peakHour: "09:00 PM", peakSales: 21000 },
  { day: "03", date: "Aug 03", fullDate: "2026-08-03", weekday: "Mon", sales: 68400, orders: 94, meatKg: 25.0, yield: 95.8, cash: 20500, online: 47900, peakHour: "08:30 PM", peakSales: 14200 },
  { day: "04", date: "Aug 04", fullDate: "2026-08-04", weekday: "Tue", sales: 71200, orders: 98, meatKg: 27.0, yield: 96.1, cash: 22000, online: 49200, peakHour: "08:45 PM", peakSales: 15400 },
  { day: "05", date: "Aug 05", fullDate: "2026-08-05", weekday: "Wed", sales: 74500, orders: 102, meatKg: 28.0, yield: 95.0, cash: 23100, online: 51400, peakHour: "09:15 PM", peakSales: 16200 },
  { day: "06", date: "Aug 06", fullDate: "2026-08-06", weekday: "Thu", sales: 76800, orders: 106, meatKg: 29.0, yield: 94.7, cash: 24200, online: 52600, peakHour: "09:00 PM", peakSales: 16800 },
  { day: "07", date: "Aug 07", fullDate: "2026-08-07", weekday: "Fri", sales: 89400, orders: 122, meatKg: 33.0, yield: 95.5, cash: 27800, online: 61600, peakHour: "10:00 PM", peakSales: 19400 },
  { day: "08", date: "Aug 08", fullDate: "2026-08-08", weekday: "Sat", sales: 102500, orders: 140, meatKg: 38.5, yield: 94.2, cash: 32500, online: 70000, peakHour: "09:30 PM", peakSales: 22800 },
  { day: "09", date: "Aug 09", fullDate: "2026-08-09", weekday: "Sun", sales: 105800, orders: 145, meatKg: 40.0, yield: 94.9, cash: 34000, online: 71800, peakHour: "09:15 PM", peakSales: 23500 },
  { day: "10", date: "Aug 10", fullDate: "2026-08-10", weekday: "Mon", sales: 67200, orders: 92, meatKg: 24.5, yield: 96.0, cash: 19800, online: 47400, peakHour: "08:15 PM", peakSales: 13800 },
  { day: "11", date: "Aug 11", fullDate: "2026-08-11", weekday: "Tue", sales: 72900, orders: 100, meatKg: 27.0, yield: 95.4, cash: 22400, online: 50500, peakHour: "08:45 PM", peakSales: 15600 },
  { day: "12", date: "Aug 12", fullDate: "2026-08-12", weekday: "Wed", sales: 75400, orders: 104, meatKg: 28.0, yield: 95.7, cash: 23800, online: 51600, peakHour: "09:00 PM", peakSales: 16100 },
  { day: "13", date: "Aug 13", fullDate: "2026-08-13", weekday: "Thu", sales: 78200, orders: 108, meatKg: 29.5, yield: 95.1, cash: 24500, online: 53700, peakHour: "09:15 PM", peakSales: 17200 },
  { day: "14", date: "Aug 14", fullDate: "2026-08-14", weekday: "Fri", sales: 91600, orders: 125, meatKg: 34.0, yield: 94.6, cash: 28900, online: 62700, peakHour: "10:15 PM", peakSales: 20500 },
  { day: "15", date: "Aug 15", fullDate: "2026-08-15", weekday: "Sat", sales: 114500, orders: 158, meatKg: 43.0, yield: 95.8, cash: 38000, online: 76500, peakHour: "09:45 PM", peakSales: 25400 },
  { day: "16", date: "Aug 16", fullDate: "2026-08-16", weekday: "Sun", sales: 108200, orders: 148, meatKg: 40.5, yield: 94.4, cash: 35200, online: 73000, peakHour: "09:00 PM", peakSales: 24100 },
  { day: "17", date: "Aug 17", fullDate: "2026-08-17", weekday: "Mon", sales: 69500, orders: 95, meatKg: 25.5, yield: 95.9, cash: 21000, online: 48500, peakHour: "08:30 PM", peakSales: 14600 },
  { day: "18", date: "Aug 18", fullDate: "2026-08-18", weekday: "Tue", sales: 73800, orders: 102, meatKg: 27.0, yield: 95.3, cash: 22800, online: 51000, peakHour: "08:45 PM", peakSales: 15900 },
  { day: "19", date: "Aug 19", fullDate: "2026-08-19", weekday: "Wed", sales: 77200, orders: 106, meatKg: 29.0, yield: 95.6, cash: 24100, online: 53100, peakHour: "09:00 PM", peakSales: 16700 },
  { day: "20", date: "Aug 20", fullDate: "2026-08-20", weekday: "Thu", sales: 79500, orders: 109, meatKg: 29.5, yield: 94.8, cash: 25000, online: 54500, peakHour: "09:30 PM", peakSales: 17800 },
  { day: "21", date: "Aug 21", fullDate: "2026-08-21", weekday: "Fri", sales: 93800, orders: 128, meatKg: 35.0, yield: 95.2, cash: 29500, online: 64300, peakHour: "10:00 PM", peakSales: 21200 },
  // Highest Day of the Month
  { day: "22", date: "Aug 22", fullDate: "2026-08-22", weekday: "Sat", sales: 118400, orders: 162, meatKg: 44.5, yield: 96.0, cash: 39200, online: 79200, peakHour: "09:15 PM", peakSales: 26800, isBest: true },
  { day: "23", date: "Aug 23", fullDate: "2026-08-23", weekday: "Sun", sales: 111500, orders: 152, meatKg: 41.5, yield: 94.7, cash: 36000, online: 75500, peakHour: "09:00 PM", peakSales: 24600 },
  { day: "24", date: "Aug 24", fullDate: "2026-08-24", weekday: "Mon", sales: 70400, orders: 96, meatKg: 25.5, yield: 95.8, cash: 21500, online: 48900, peakHour: "08:30 PM", peakSales: 14800 },
  { day: "25", date: "Aug 25", fullDate: "2026-08-25", weekday: "Tue", sales: 74600, orders: 103, meatKg: 28.0, yield: 95.4, cash: 23400, online: 51200, peakHour: "08:45 PM", peakSales: 16200 },
  { day: "26", date: "Aug 26", fullDate: "2026-08-26", weekday: "Wed", sales: 85400, orders: 112, meatKg: 30.0, yield: 95.2, cash: 24850, online: 60550, peakHour: "09:10 PM", peakSales: 18600 },
];

// Operating Hours Rush Distribution
const HOURLY_RUSH_DATA = [
  { hour: "12 PM", sales: 98000, orders: 142 },
  { hour: "01 PM", sales: 215000, orders: 310 },
  { hour: "02 PM", sales: 240000, orders: 345 },
  { hour: "03 PM", sales: 135000, orders: 195 },
  { hour: "05 PM", sales: 92000, orders: 130 },
  { hour: "06 PM", sales: 165000, orders: 235 },
  { hour: "07 PM", sales: 260000, orders: 370 },
  { hour: "08 PM", sales: 345000, orders: 485 },
  { hour: "09 PM", sales: 382000, orders: 535 },
  { hour: "10 PM", sales: 310000, orders: 430 },
  { hour: "11 PM", sales: 145000, orders: 202 },
];

// Day of the Week Sales Averages
const DAY_OF_WEEK_DATA = [
  { day: "Mon", avgSales: 68875, peakTime: "08:30 PM" },
  { day: "Tue", avgSales: 73125, peakTime: "08:45 PM" },
  { day: "Wed", avgSales: 78125, peakTime: "09:05 PM" },
  { day: "Thu", avgSales: 78167, peakTime: "09:15 PM" },
  { day: "Fri", avgSales: 91600, peakTime: "10:05 PM" },
  { day: "Sat", avgSales: 107475, peakTime: "09:30 PM", isPeak: true },
  { day: "Sun", avgSales: 105925, peakTime: "09:15 PM" },
];

export default function MonthlyOverviewPage() {
  const { activeOutlet, outlets } = useFranchise();
  const currentOutlet = activeOutlet || outlets[0];

  const [selectedMonth, setSelectedMonth] = useState("2026-08");
  const [searchQuery, setSearchQuery] = useState("");

  // Month Aggregations
  const totalMonthRevenue = AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.sales, 0);
  const totalMonthOrders = AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.orders, 0);
  const totalMeatLoadedKg = Number(AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.meatKg, 0).toFixed(1));
  const avgSpitYield = (
    AUGUST_DAILY_RECORDS.reduce((acc, r) => acc + r.yield, 0) / AUGUST_DAILY_RECORDS.length
  ).toFixed(1);

  const bestDay = AUGUST_DAILY_RECORDS.reduce((max, r) => (r.sales > max.sales ? r : max), AUGUST_DAILY_RECORDS[0]);

  // Channel Distribution (Matches Overview Pie Chart structure)
  const channelData = [
    { name: "Walk-in Counter", value: 42, amount: Math.round(totalMonthRevenue * 0.42), color: "#f97316" },
    { name: "Zomato", value: 33, amount: Math.round(totalMonthRevenue * 0.33), color: "#3b82f6" },
    { name: "Swiggy", value: 25, amount: Math.round(totalMonthRevenue * 0.25), color: "#f59e0b" },
  ];

  // Filtered Table Records
  const filteredRecords = AUGUST_DAILY_RECORDS.filter(
    (r) =>
      r.fullDate.includes(searchQuery) ||
      r.weekday.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.peakHour.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = "Date,Weekday,Gross Sales (INR),Orders,Peak Hour,Meat Loaded (kg),Spit Yield %,Cash (INR),Online (INR)\n";
    const rows = AUGUST_DAILY_RECORDS.map(
      (r) => `${r.fullDate},${r.weekday},${r.sales},${r.orders},${r.peakHour},${r.meatKg},${r.yield}%,${r.cash},${r.online}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `koyla-${currentOutlet.code}-monthly-${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* ── TOP HEADER AREA ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-1.5">
          <p className="text-[11px] font-black text-orange-500 uppercase tracking-widest leading-none flex items-center gap-2">
            <Store className="w-3.5 h-3.5" />
            <span>{currentOutlet.name} • {currentOutlet.code}</span>
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-0.5">
              Monthly Overview & Performance
            </h1>
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-[#242427] text-zinc-300 border border-[#383838]">
              🗓️ August 2026
            </span>
          </div>
        </div>

        {/* Right Header Action Group */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-[#1a1a1c] border border-[#2e2e30] hover:border-[#444] text-white text-xs font-bold px-3.5 py-2.5 pr-8 rounded-xl focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
            >
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Link href="/admin">
            <Button
              variant="outline"
              className="bg-[#1a1a1c] hover:bg-[#252528] border-[#2e2e30] text-zinc-300 hover:text-white font-bold text-xs h-11 px-3.5 rounded-xl cursor-pointer"
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

      {/* ── TOP 4 STORE KPI CARDS (EXACT MATCH WITH OVERVIEW PAGE) ───────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Monthly Gross Sales */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0">
              <Receipt className="w-6 h-6 text-zinc-300" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-zinc-400 block">Monthly Sales</span>
              <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                ₹{totalMonthRevenue.toLocaleString("en-IN")}
              </p>
              <span className="text-xs text-emerald-400 font-medium block mt-0.5">
                +16.8% vs last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Orders */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6 text-zinc-300" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-zinc-400 block">Orders This Month</span>
              <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                {totalMonthOrders.toLocaleString()}
              </p>
              <span className="text-xs text-zinc-400 block mt-0.5">
                Avg Ticket: ₹{Math.round(totalMonthRevenue / totalMonthOrders)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Spit Meat Loaded (Single Standard Meat) */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-400">
              <Flame className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-zinc-400 block">Spit Meat Consumed</span>
              <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                {totalMeatLoadedKg} <span className="text-sm font-bold text-zinc-400 font-sans">kg</span>
              </p>
              <span className="text-xs text-orange-400 font-medium block mt-0.5">
                ~3,420 Wraps Carved
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Spit Carve Yield */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0 text-emerald-400">
              <Percent className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-zinc-400 block">Spit Efficiency Yield</span>
              <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                {avgSpitYield}%
              </p>
              <span className="text-xs text-emerald-400 font-medium block mt-0.5">
                Benchmark: &gt;93%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── ROW 2: DAILY SALES VELOCITY CURVE & CHANNEL BREAKDOWN (12 COLS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: 7 cols Daily Sales Area Chart */}
        <Card className="lg:col-span-7 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span>Daily Sales Velocity (Month-to-Date)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={AUGUST_DAILY_RECORDS}>
                  <defs>
                    <linearGradient id="monthSalesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2e2e30" vertical={false} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#161618",
                      borderColor: "#383838",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#ffffff",
                    }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Gross Sales"]}
                    labelFormatter={(label) => `${label}, 2026`}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2.5} fill="url(#monthSalesGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right: 5 cols Category / Channel Revenue Share */}
        <Card className="lg:col-span-5 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-orange-400" />
              <span>Revenue by Channel</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
              <div className="h-44 w-full sm:w-[48%] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={channelData} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={4} dataKey="value">
                      {channelData.map((entry, index) => (
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
                      }}
                      formatter={(val: any) => [`${val}%`, "Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full sm:w-[52%] space-y-2">
                {channelData.map((item) => (
                  <div key={item.name} className="p-2.5 rounded-xl bg-[#161618] border border-[#2e2e30] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-zinc-300 text-xs font-semibold truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                      <span className="text-zinc-400">₹{(item.amount / 100000).toFixed(1)}L</span>
                      <span className="font-black text-white bg-[#242427] px-1.5 py-0.5 rounded border border-[#383838]">
                        {item.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── ROW 3: PEAK RUSH HOURS & BEST PERFORMING DAY SPOTLIGHT ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: 7 cols Operating Hours Timing Curve */}
        <Card className="lg:col-span-7 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white">Peak Order Timings (Operating Hours)</h3>
            </div>
            <span className="text-xs text-orange-400 font-mono font-bold bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
              Peak Rush: 8:00 PM – 10:30 PM
            </span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_RUSH_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2e2e30" vertical={false} />
                <XAxis dataKey="hour" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#161618",
                    borderColor: "#383838",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#ffffff",
                  }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString("en-IN")}`, "Sales Volume"]}
                />
                <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1 border-t border-[#262629] text-xs">
            <div className="p-2.5 rounded-xl bg-[#161618] border border-[#2e2e30]">
              <span className="text-zinc-400 text-[10px] block font-bold">Lunch (12 PM - 3 PM)</span>
              <p className="text-sm font-bold text-white font-mono mt-0.5">28% of sales</p>
            </div>
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30">
              <span className="text-orange-400 text-[10px] block font-bold">Dinner (7 PM - 11 PM)</span>
              <p className="text-sm font-bold text-orange-400 font-mono mt-0.5">62% of sales</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#161618] border border-[#2e2e30]">
              <span className="text-zinc-400 text-[10px] block font-bold">Late Night (11 PM+)</span>
              <p className="text-sm font-bold text-white font-mono mt-0.5">10% of sales</p>
            </div>
          </div>
        </Card>

        {/* Right: 5 cols Best Day & Day of Week Comparison */}
        <Card className="lg:col-span-5 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Best Performing Day Spotlight</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">Single highest revenue shift recorded this month.</p>
          </div>

          {/* Spotlight Highlight Box */}
          <div className="p-4 rounded-xl bg-[#161618] border border-[#2e2e30] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white font-sans">{bestDay.weekday}, {bestDay.fullDate}</span>
              <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ₹{bestDay.sales.toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-300 pt-1">
              <div>Orders: <strong className="text-white">{bestDay.orders}</strong></div>
              <div>Peak Time: <strong className="text-orange-400">{bestDay.peakHour}</strong></div>
              <div>Meat Carved: <strong className="text-white">{bestDay.meatKg} kg</strong></div>
              <div>Spit Yield: <strong className="text-emerald-400">{bestDay.yield}%</strong></div>
            </div>
          </div>

          {/* Mini Day of Week Benchmark */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-zinc-400 block">Day of Week Benchmark (Avg)</span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-[#161618] border border-[#2e2e30] text-center">
                <span className="text-zinc-500 text-[10px] block">Weekdays</span>
                <strong className="text-zinc-200 font-mono text-xs">₹74.5k</strong>
              </div>
              <div className="p-2 rounded-lg bg-[#161618] border border-[#2e2e30] text-center">
                <span className="text-zinc-500 text-[10px] block">Fridays</span>
                <strong className="text-zinc-200 font-mono text-xs">₹91.6k</strong>
              </div>
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-center">
                <span className="text-orange-400 text-[10px] block font-bold">Weekends</span>
                <strong className="text-orange-400 font-mono text-xs">₹106.7k</strong>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── ROW 4: COMPLETE DAY-BY-DAY SHIFT & MEAT TABLE ───────────────── */}
      <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
        <CardHeader className="pb-3 border-b border-[#242427]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-orange-400" />
                <span>Daily Shifts & Spit Meat Ledger (Month-to-Date)</span>
              </CardTitle>
              <p className="text-xs text-zinc-400 mt-0.5">
                Complete day-by-day record of sales, peak hours, and spit meat weights.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search date, weekday, peak..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#28282b] text-zinc-400 text-[11px] uppercase tracking-wider font-semibold bg-[#161618]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4 text-right">Gross Sales</th>
                  <th className="py-3 px-4 text-right">Orders</th>
                  <th className="py-3 px-4">Peak Rush Hour</th>
                  <th className="py-3 px-4 text-right">Meat Loaded</th>
                  <th className="py-3 px-4 text-right">Spit Yield</th>
                  <th className="py-3 px-4 text-right">Cash</th>
                  <th className="py-3 px-4 text-right">Online</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242427] font-mono text-[11px]">
                {filteredRecords.map((row) => (
                  <tr key={row.fullDate} className="hover:bg-[#202023] transition-colors">
                    <td className="py-3 px-4 font-medium text-white flex items-center gap-1.5">
                      {row.isBest && <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      <span>{row.fullDate}</span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-sans font-bold">{row.weekday}</td>
                    <td className="py-3 px-4 text-right font-bold text-white">₹{row.sales.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-zinc-300">{row.orders}</td>
                    <td className="py-3 px-4 text-orange-400 font-sans font-medium">
                      {row.peakHour} <span className="text-zinc-500 font-mono text-[10px]">(₹{row.peakSales.toLocaleString()})</span>
                    </td>
                    <td className="py-3 px-4 text-right text-white font-bold">{row.meatKg} kg</td>
                    <td className="py-3 px-4 text-right text-emerald-400 font-bold">{row.yield}%</td>
                    <td className="py-3 px-4 text-right text-zinc-400">₹{row.cash.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-zinc-400">₹{row.online.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-emerald-400 font-sans font-semibold">Audited</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
