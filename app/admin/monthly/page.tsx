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

export default function MonthlyOverviewPage() {
  const { activeOutlet, outlets, liveOrders, shifts, meatBatches } = useFranchise();
  const outletName = activeOutlet?.name || outlets[0]?.name || "All Franchise Hubs";
  const outletCode = activeOutlet?.code || outlets[0]?.code || "IK-HQ-01";

  const [selectedMonth, setSelectedMonth] = useState("2026-08");
  const [searchQuery, setSearchQuery] = useState("");

  // Group real liveOrders and shifts dynamically by date
  const dateMap: Record<string, {
    date: string;
    fullDate: string;
    weekday: string;
    sales: number;
    orders: number;
    meatKg: number;
    yield: number;
    cash: number;
    online: number;
    peakHour: string;
    peakSales: number;
    isBest?: boolean;
  }> = {};

  liveOrders.forEach((o) => {
    const d = o.date || new Date().toISOString().split("T")[0];
    if (!dateMap[d]) {
      const dt = new Date(d);
      const weekday = isNaN(dt.getTime()) ? "Today" : dt.toLocaleDateString("en-US", { weekday: "short" });
      const dateShort = isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
      dateMap[d] = {
        date: dateShort,
        fullDate: d,
        weekday,
        sales: 0,
        orders: 0,
        meatKg: 0,
        yield: 95.0,
        cash: 0,
        online: 0,
        peakHour: o.time || "08:30 PM",
        peakSales: 0,
      };
    }
    dateMap[d].sales += o.totalAmount;
    dateMap[d].orders += 1;
    if (o.paymentMethod === "Cash") {
      dateMap[d].cash += o.totalAmount;
    } else {
      dateMap[d].online += o.totalAmount;
    }
  });

  shifts.forEach((s) => {
    const d = s.date;
    if (!dateMap[d]) {
      const dt = new Date(d);
      const weekday = isNaN(dt.getTime()) ? "Shift" : dt.toLocaleDateString("en-US", { weekday: "short" });
      const dateShort = isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
      dateMap[d] = {
        date: dateShort,
        fullDate: d,
        weekday,
        sales: s.totalGrossSales,
        orders: s.totalOrders,
        meatKg: 0,
        yield: 95.2,
        cash: s.cashSalesExpected,
        online: s.upiSales + s.posCardSales + s.swiggySales + s.zomatoSales,
        peakHour: "09:00 PM",
        peakSales: Math.round(s.totalGrossSales / 4),
      };
    }
  });

  // Calculate meat from real meatBatches
  meatBatches.forEach((b) => {
    const d = b.date;
    if (dateMap[d]) {
      dateMap[d].meatKg += b.skewerWeightKg || 0;
      dateMap[d].yield = b.actualYieldPercent || 95.0;
    }
  });

  const dailyRecords = Object.values(dateMap).sort((a, b) => b.fullDate.localeCompare(a.fullDate));

  // Month Aggregations
  const totalMonthRevenue = dailyRecords.reduce((acc, r) => acc + r.sales, 0);
  const totalMonthOrders = dailyRecords.reduce((acc, r) => acc + r.orders, 0);
  const totalMeatLoadedKg = Number(dailyRecords.reduce((acc, r) => acc + r.meatKg, 0).toFixed(1));
  const avgSpitYield = dailyRecords.length > 0
    ? (dailyRecords.reduce((acc, r) => acc + r.yield, 0) / dailyRecords.length).toFixed(1)
    : "0.0";

  const bestDay = dailyRecords.length > 0
    ? dailyRecords.reduce((max, r) => (r.sales > max.sales ? r : max), dailyRecords[0])
    : null;

  // Channel Distribution from real liveOrders
  const walkInTotal = liveOrders.filter(o => o.channel === "Walk-in Counter").reduce((s, o) => s + o.totalAmount, 0);
  const zomatoTotal = liveOrders.filter(o => o.channel === "Zomato").reduce((s, o) => s + o.totalAmount, 0);
  const swiggyTotal = liveOrders.filter(o => o.channel === "Swiggy").reduce((s, o) => s + o.totalAmount, 0);
  const totalCh = walkInTotal + zomatoTotal + swiggyTotal || 1;

  const channelData = [
    { name: "Walk-in Counter", value: Math.round((walkInTotal / totalCh) * 100) || (totalMonthRevenue === 0 ? 0 : 100), amount: walkInTotal, color: "#f97316" },
    { name: "Zomato", value: Math.round((zomatoTotal / totalCh) * 100), amount: zomatoTotal, color: "#3b82f6" },
    { name: "Swiggy", value: Math.round((swiggyTotal / totalCh) * 100), amount: swiggyTotal, color: "#f59e0b" },
  ];

  // Dynamic Operating Hours Rush
  const HOURLY_SLOTS = ["12 PM", "01 PM", "02 PM", "03 PM", "05 PM", "06 PM", "07 PM", "08 PM", "09 PM", "10 PM", "11 PM"];
  const dynamicHourlyRush = HOURLY_SLOTS.map((hour) => {
    const ordersInHour = liveOrders.filter((o) => {
      if (!o.time) return false;
      const t = o.time.toLowerCase();
      return t.includes(hour.toLowerCase().replace(" ", "")) || t.includes(hour.slice(0, 2));
    });
    return {
      hour,
      sales: ordersInHour.reduce((sum, o) => sum + o.totalAmount, 0),
      orders: ordersInHour.length,
    };
  });

  // Filtered Table Records
  const filteredRecords = dailyRecords.filter(
    (r) =>
      r.fullDate.includes(searchQuery) ||
      r.weekday.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.peakHour.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = "Date,Weekday,Gross Sales (INR),Orders,Peak Hour,Meat Loaded (kg),Spit Yield %,Cash (INR),Online (INR)\n";
    const rows = dailyRecords.map(
      (r) => `${r.fullDate},${r.weekday},${r.sales},${r.orders},${r.peakHour},${r.meatKg},${r.yield}%,${r.cash},${r.online}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `koyla-${outletCode}-monthly-${selectedMonth}.csv`);
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
            <span>{outletName} • {outletCode}</span>
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-0.5">
              Monthly Overview & Performance
            </h1>
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-[#242427] text-zinc-300 border border-[#383838]">
              🗓️ Live Ledger
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
                Live Dynamic
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
                Avg Ticket: ₹{totalMonthOrders > 0 ? Math.round(totalMonthRevenue / totalMonthOrders) : 0}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Spit Meat Loaded */}
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
                ~{totalMeatLoadedKg > 0 ? Math.round(totalMeatLoadedKg * 10) : 0} Wraps Carved
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
              {dailyRecords.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyRecords}>
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
                      labelFormatter={(label) => `${label}`}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2.5} fill="url(#monthSalesGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 space-y-2">
                  <TrendingUp className="w-8 h-8 text-zinc-600" />
                  <p className="text-xs">No daily sales records logged yet.</p>
                </div>
              )}
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
              Live Operating Curve
            </span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicHourlyRush}>
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
        </Card>

        {/* Right: 5 cols Best Day Spotlight */}
        <Card className="lg:col-span-5 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Best Performing Day Spotlight</h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">Single highest revenue shift recorded this month.</p>
          </div>

          {bestDay ? (
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
          ) : (
            <div className="p-6 rounded-xl bg-[#161618] border border-dashed border-[#2e2e30] text-center text-zinc-500 text-xs">
              No shifts completed yet.
            </div>
          )}
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
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((row) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-zinc-500 font-sans text-xs">
                      No shift records logged for this month yet. Orders punched on the POS terminal will appear here live.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
