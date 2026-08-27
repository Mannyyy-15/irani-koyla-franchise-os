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
  Calendar,
  Eye,
  X,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Filter,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";

interface DayRecord {
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
}

export default function MonthlyOverviewPage() {
  const { activeOutlet, outlets, liveOrders, shifts, meatBatches, role, selectedOutletId, setSelectedOutletId } = useFranchise();
  const isSuperAdmin = role === "SUPER_ADMIN";
  const outletName = activeOutlet?.name || outlets[0]?.name || "All Franchise Hubs";
  const outletCode = activeOutlet?.code || outlets[0]?.code || "IK-HQ-01";

  const [selectedMonth, setSelectedMonth] = useState("2026-08");
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>(""); // e.g. "2026-08-25" or ""
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectDay, setInspectDay] = useState<DayRecord | null>(null);

  // Group real liveOrders and shifts dynamically by date
  const dateMap: Record<string, DayRecord> = {};

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

  const allDailyRecords = Object.values(dateMap).sort((a, b) => b.fullDate.localeCompare(a.fullDate));

  // If specific month is selected (and not filtering down to a cross-month date), filter month view
  const monthFilteredRecords = allDailyRecords.filter((r) => r.fullDate.startsWith(selectedMonth));
  const dailyRecords = monthFilteredRecords.length > 0 ? monthFilteredRecords : allDailyRecords;

  // Selected Day specific metrics & orders if a day is filtered
  const activeDayRecord = selectedDayFilter ? dailyRecords.find((r) => r.fullDate === selectedDayFilter) : null;

  // Month or Selected Day Aggregations
  const displayRecords = selectedDayFilter && activeDayRecord ? [activeDayRecord] : dailyRecords;
  const totalRevenue = displayRecords.reduce((acc, r) => acc + r.sales, 0);
  const totalOrders = displayRecords.reduce((acc, r) => acc + r.orders, 0);
  const totalMeatLoadedKg = Number(displayRecords.reduce((acc, r) => acc + r.meatKg, 0).toFixed(1));
  const avgSpitYield = displayRecords.length > 0
    ? (displayRecords.reduce((acc, r) => acc + r.yield, 0) / displayRecords.length).toFixed(1)
    : "0.0";

  const bestDay = dailyRecords.length > 0
    ? dailyRecords.reduce((max, r) => (r.sales > max.sales ? r : max), dailyRecords[0])
    : null;

  // Channel Distribution from real liveOrders
  const relevantOrders = selectedDayFilter
    ? liveOrders.filter((o) => (o.date || new Date().toISOString().split("T")[0]) === selectedDayFilter)
    : liveOrders;

  const walkInTotal = relevantOrders.filter(o => o.channel === "Walk-in Counter").reduce((s, o) => s + o.totalAmount, 0);
  const zomatoTotal = relevantOrders.filter(o => o.channel === "Zomato").reduce((s, o) => s + o.totalAmount, 0);
  const swiggyTotal = relevantOrders.filter(o => o.channel === "Swiggy").reduce((s, o) => s + o.totalAmount, 0);
  const totalCh = walkInTotal + zomatoTotal + swiggyTotal || 1;

  const channelData = [
    { name: "Walk-in Counter", value: Math.round((walkInTotal / totalCh) * 100) || (totalRevenue === 0 ? 0 : 100), amount: walkInTotal, color: "#f97316" },
    { name: "Zomato", value: Math.round((zomatoTotal / totalCh) * 100), amount: zomatoTotal, color: "#3b82f6" },
    { name: "Swiggy", value: Math.round((swiggyTotal / totalCh) * 100), amount: swiggyTotal, color: "#f59e0b" },
  ];

  // Dynamic Operating Hours Rush
  const HOURLY_SLOTS = ["12 PM", "01 PM", "02 PM", "03 PM", "05 PM", "06 PM", "07 PM", "08 PM", "09 PM", "10 PM", "11 PM"];
  const dynamicHourlyRush = HOURLY_SLOTS.map((hour) => {
    const ordersInHour = relevantOrders.filter((o) => {
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

  // Filtered Table Records (by search and day filter)
  const filteredRecords = dailyRecords.filter((r) => {
    const matchesSearch =
      r.fullDate.includes(searchQuery) ||
      r.weekday.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.peakHour.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDay = selectedDayFilter ? r.fullDate === selectedDayFilter : true;
    return matchesSearch && matchesDay;
  });

  const handleExportCSV = () => {
    const headers = "Date,Weekday,Gross Sales (INR),Orders,Peak Hour,Meat Loaded (kg),Spit Yield %,Cash (INR),Online (INR)\n";
    const exportData = selectedDayFilter && activeDayRecord ? [activeDayRecord] : dailyRecords;
    const rows = exportData.map(
      (r) => `${r.fullDate},${r.weekday},${r.sales},${r.orders},${r.peakHour},${r.meatKg},${r.yield}%,${r.cash},${r.online}`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `koyla-${outletCode}-${selectedDayFilter || selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Orders for the inspected day modal
  const dayOrders = inspectDay
    ? liveOrders.filter((o) => (o.date || new Date().toISOString().split("T")[0]) === inspectDay.fullDate)
    : [];

  const dayShifts = inspectDay
    ? shifts.filter((s) => s.date === inspectDay.fullDate)
    : [];

  const dayBatches = inspectDay
    ? meatBatches.filter((b) => b.date === inspectDay.fullDate)
    : [];

  return (
    <div className="space-y-6">
      {/* ── TOP HEADER AREA ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-orange-500" />
            <span>Monthly Performance</span>
          </h1>
        </div>

        {/* Right Header Action Group */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Super Admin In-Page Outlet Filter */}
          {isSuperAdmin && (
            <div className="relative">
              <select
                value={selectedOutletId}
                onChange={(e) => setSelectedOutletId(e.target.value)}
                className="appearance-none bg-[#1a1a1c] border border-orange-500/40 hover:border-orange-500 text-orange-400 text-xs font-bold px-3.5 py-2.5 pr-8 rounded-xl focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
              >
                <option value="all">🏢 All Outlets (Network)</option>
                {outlets.map((o) => (
                  <option key={o.id} value={o.id}>
                    📍 {o.name} ({o.code})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-orange-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Month Selector */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setSelectedDayFilter(""); // Reset day filter when month changes
              }}
              className="appearance-none bg-[#1a1a1c] border border-[#2e2e30] hover:border-[#444] text-white text-xs font-bold px-3.5 py-2.5 pr-8 rounded-xl focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
            >
              <option value="2026-08">August 2026</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Specific Day Picker Filter */}
          <div className="relative flex items-center">
            <input
              type="date"
              value={selectedDayFilter}
              onChange={(e) => setSelectedDayFilter(e.target.value)}
              className="bg-[#1a1a1c] border border-[#2e2e30] hover:border-[#444] text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
              title="Filter by particular date"
            />
            {selectedDayFilter && (
              <button
                onClick={() => setSelectedDayFilter("")}
                className="ml-1.5 p-1.5 rounded-lg bg-[#252528] text-zinc-400 hover:text-white transition-colors"
                title="Clear day filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <Link href="/admin">
            <Button
              variant="outline"
              className="bg-[#1a1a1c] hover:bg-[#252528] border-[#2e2e30] text-zinc-300 hover:text-white font-bold text-xs h-10 px-3.5 rounded-xl cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-orange-400 mr-1.5" />
              <span>Today&apos;s Live View</span>
            </Button>
          </Link>

          <Button
            onClick={handleExportCSV}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs h-10 px-4 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Day Filter Banner (if active) */}
      {selectedDayFilter && (
        <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-orange-300">
            <Filter className="w-4 h-4 text-orange-400 shrink-0" />
            <span>
              Showing performance for particular day: <strong className="text-white">{selectedDayFilter}</strong> ({activeDayRecord?.weekday || "Day"})
            </span>
          </div>
          <Button
            onClick={() => setSelectedDayFilter("")}
            variant="ghost"
            className="text-xs text-orange-400 hover:text-white hover:bg-orange-500/20 h-7 px-2.5 rounded-lg"
          >
            Clear Day Filter
          </Button>
        </div>
      )}

      {/* ── TOP 4 STORE KPI CARDS ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Gross Sales */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#242427] border border-[#333336] flex items-center justify-center shrink-0">
              <Receipt className="w-6 h-6 text-zinc-300" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-zinc-400 block">
                {selectedDayFilter ? "Day Sales" : "Monthly Sales"}
              </span>
              <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>
              <span className="text-xs text-emerald-400 font-medium block mt-0.5">
                {selectedDayFilter ? selectedDayFilter : "Live Dynamic"}
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
              <span className="text-[11px] font-semibold text-zinc-400 block">
                {selectedDayFilter ? "Orders This Day" : "Orders This Month"}
              </span>
              <p className="text-2xl font-bold text-white font-mono tracking-tight mt-0.5">
                {totalOrders.toLocaleString()}
              </p>
              <span className="text-xs text-zinc-400 block mt-0.5">
                Avg Ticket: ₹{totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0}
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

      {/* ── ROW 2: DAILY SALES VELOCITY CURVE & CHANNEL BREAKDOWN ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: 7 cols Daily Sales Area Chart */}
        <Card className="lg:col-span-7 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-400" />
                <span>Daily Sales Velocity</span>
              </span>
              <span className="text-xs font-normal text-zinc-400">Click any day to inspect</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {dailyRecords.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dailyRecords}
                    onClick={(e) => {
                      if (e && e.activePayload && e.activePayload.length > 0) {
                        const rec = e.activePayload[0].payload as DayRecord;
                        setInspectDay(rec);
                      }
                    }}
                  >
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
                      labelFormatter={(label) => `${label} (Click to inspect)`}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2.5} fill="url(#monthSalesGrad)" cursor="pointer" />
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
              <span>Revenue by Channel {selectedDayFilter ? `(${selectedDayFilter})` : ""}</span>
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
              <h3 className="text-sm font-bold text-white">Peak Order Timings</h3>
            </div>
            <span className="text-xs text-orange-400 font-mono font-bold bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
              {selectedDayFilter ? selectedDayFilter : "Operating Curve"}
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

        {/* Right: 5 cols Best Day Spotlight / Selected Day Summary */}
        <Card className="lg:col-span-5 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                {selectedDayFilter ? "Selected Day Summary" : "Best Performing Day Spotlight"}
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              {selectedDayFilter ? `Details for ${selectedDayFilter}` : "Single highest revenue shift recorded this month."}
            </p>
          </div>

          {selectedDayFilter && activeDayRecord ? (
            <div className="p-4 rounded-xl bg-[#161618] border border-orange-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-sans">{activeDayRecord.weekday}, {activeDayRecord.fullDate}</span>
                <span className="text-xs font-mono font-black text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  ₹{activeDayRecord.sales.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-300 pt-1">
                <div>Orders: <strong className="text-white">{activeDayRecord.orders}</strong></div>
                <div>Peak Time: <strong className="text-orange-400">{activeDayRecord.peakHour}</strong></div>
                <div>Meat Carved: <strong className="text-white">{activeDayRecord.meatKg} kg</strong></div>
                <div>Spit Yield: <strong className="text-emerald-400">{activeDayRecord.yield}%</strong></div>
              </div>
              <Button
                onClick={() => setInspectDay(activeDayRecord)}
                className="w-full mt-2 bg-[#242427] hover:bg-[#333] text-zinc-200 text-xs font-bold h-8 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-orange-400" />
                <span>Inspect Day In Detail</span>
              </Button>
            </div>
          ) : bestDay ? (
            <div className="p-4 rounded-xl bg-[#161618] border border-[#2e2e30] space-y-2.5">
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
              <Button
                onClick={() => setInspectDay(bestDay)}
                className="w-full mt-2 bg-[#242427] hover:bg-[#333] text-zinc-200 text-xs font-bold h-8 rounded-lg flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-orange-400" />
                <span>Inspect Day In Detail</span>
              </Button>
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
                <span>Day-by-Day Shifts & Spit Meat Ledger</span>
              </CardTitle>
            </div>

            <div className="flex items-center gap-2">
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
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242427] font-mono text-[11px]">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((row) => (
                    <tr
                      key={row.fullDate}
                      onClick={() => setInspectDay(row)}
                      className="hover:bg-[#202023] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-medium text-white flex items-center gap-1.5">
                        {row.isBest && <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        <span className="group-hover:text-orange-400 transition-colors">{row.fullDate}</span>
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
                      <td className="py-3 px-4 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectDay(row);
                          }}
                          className="h-7 px-2.5 text-xs text-orange-400 hover:text-white hover:bg-orange-500/20 font-bold rounded-lg"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>Inspect</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-zinc-500 font-sans text-xs">
                      No shift records found. Orders punched on the POS terminal will appear here live.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── PARTICULAR DAY INSPECTION MODAL ──────────────────────────────── */}
      <Dialog open={!!inspectDay} onOpenChange={(open) => !open && setInspectDay(null)}>
        <DialogContent className="max-w-3xl bg-[#18181b] border border-[#2e2e30] text-white p-0 rounded-3xl overflow-hidden shadow-2xl">
          {inspectDay && (
            <div>
              {/* Header */}
              <div className="p-6 border-b border-[#2e2e30] bg-[#141416] flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      {inspectDay.fullDate}
                    </span>
                    <span className="text-xs text-zinc-400 font-semibold">{inspectDay.weekday}</span>
                  </div>
                  <DialogTitle className="text-xl font-bold text-white tracking-tight">
                    Day Performance Breakdown
                  </DialogTitle>
                </div>
              </div>

              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {/* 4 Quick Stat Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#1f1f23] border border-[#2e2e30]">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total Sales</span>
                    <p className="text-lg font-bold font-mono text-white mt-0.5">
                      ₹{inspectDay.sales.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#1f1f23] border border-[#2e2e30]">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Orders Punched</span>
                    <p className="text-lg font-bold font-mono text-white mt-0.5">
                      {inspectDay.orders}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#1f1f23] border border-[#2e2e30]">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Meat Loaded</span>
                    <p className="text-lg font-bold font-mono text-white mt-0.5">
                      {inspectDay.meatKg} kg
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#1f1f23] border border-[#2e2e30]">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Spit Yield</span>
                    <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                      {inspectDay.yield}%
                    </p>
                  </div>
                </div>

                {/* Tender Breakdown */}
                <div className="p-4 rounded-2xl bg-[#1f1f23] border border-[#2e2e30] space-y-3">
                  <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-400" />
                    <span>Payment & Tender Breakdown</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#141416] border border-[#2a2a2e] flex items-center justify-between">
                      <span className="text-zinc-400">Cash in Drawer:</span>
                      <span className="font-mono font-bold text-white">₹{inspectDay.cash.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141416] border border-[#2a2a2e] flex items-center justify-between">
                      <span className="text-zinc-400">Online & UPI:</span>
                      <span className="font-mono font-bold text-blue-400">₹{inspectDay.online.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#141416] border border-[#2a2a2e] flex items-center justify-between">
                      <span className="text-zinc-400">Peak Hour:</span>
                      <span className="font-mono font-bold text-orange-400">{inspectDay.peakHour}</span>
                    </div>
                  </div>
                </div>

                {/* Shifts Logged on this day */}
                {dayShifts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-orange-400" />
                      <span>Shifts Reconciled ({dayShifts.length})</span>
                    </h4>
                    <div className="space-y-2">
                      {dayShifts.map((shift) => (
                        <div
                          key={shift.id}
                          className="p-3.5 rounded-xl bg-[#1f1f23] border border-[#2e2e30] flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-white block">{shift.shiftType}</span>
                            <span className="text-[11px] text-zinc-400">
                              Cashier: {shift.cashierName} · Outlet: {shift.outletName}
                            </span>
                          </div>
                          <div className="text-right font-mono">
                            <span className="font-bold text-white block">₹{shift.totalGrossSales.toLocaleString()}</span>
                            <span className="text-[10px] text-emerald-400 font-semibold">{shift.totalOrders} Orders</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spit Batches Logged on this day */}
                {dayBatches.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span>Spit Meat Batches ({dayBatches.length})</span>
                    </h4>
                    <div className="space-y-2">
                      {dayBatches.map((b) => (
                        <div
                          key={b.id}
                          className="p-3.5 rounded-xl bg-[#1f1f23] border border-[#2e2e30] flex items-center justify-between text-xs font-mono"
                        >
                          <div>
                            <span className="font-bold text-white block font-sans">{b.meatType} · {b.batchNumber}</span>
                            <span className="text-[11px] text-zinc-400 font-sans">
                              Loaded by: {b.loggedBy} · Spit #{b.spitId}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-white block">{b.skewerWeightKg} kg Loaded</span>
                            <span className="text-[10px] text-emerald-400 font-bold">{b.actualYieldPercent}% Yield</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Orders table for this day */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-orange-400" />
                      <span>Orders On This Date ({dayOrders.length})</span>
                    </h4>
                  </div>

                  {dayOrders.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-[#2e2e30] bg-[#141416]">
                      <table className="w-full text-left text-xs font-mono">
                        <thead>
                          <tr className="border-b border-[#28282b] text-zinc-400 text-[10px] uppercase bg-[#1a1a1c]">
                            <th className="py-2.5 px-3">Order #</th>
                            <th className="py-2.5 px-3">Time</th>
                            <th className="py-2.5 px-3">Channel</th>
                            <th className="py-2.5 px-3">Items</th>
                            <th className="py-2.5 px-3 text-right">Amount</th>
                            <th className="py-2.5 px-3 text-right">Payment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#242427] text-[11px]">
                          {dayOrders.slice(0, 15).map((order) => (
                            <tr key={order.id} className="hover:bg-[#1a1a1c]">
                              <td className="py-2 px-3 text-white font-bold">{order.orderNumber}</td>
                              <td className="py-2 px-3 text-zinc-400">{order.time}</td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-[#222226] text-orange-300">
                                  {order.channel}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-sans text-zinc-300 max-w-[180px] truncate">
                                {order.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
                              </td>
                              <td className="py-2 px-3 text-right font-bold text-white">₹{order.totalAmount}</td>
                              <td className="py-2 px-3 text-right text-zinc-400">{order.paymentMethod}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-[#141416] border border-[#2e2e30] text-center text-xs text-zinc-500 font-sans">
                      Individual line-item receipts are recorded directly from POS shifts.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-[#2e2e30] bg-[#141416] flex items-center justify-between">
                <Button
                  onClick={() => {
                    setSelectedDayFilter(inspectDay.fullDate);
                    setInspectDay(null);
                  }}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs h-9 px-4 rounded-xl"
                >
                  <Filter className="w-3.5 h-3.5 mr-1.5" />
                  <span>Filter Whole Page To This Day</span>
                </Button>
                <Button
                  onClick={() => setInspectDay(null)}
                  variant="outline"
                  className="border-[#2e2e30] bg-[#1f1f23] text-zinc-300 text-xs font-bold h-9 px-4 rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
