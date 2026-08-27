"use client";

import { useState } from "react";
import {
  Flame,
  Plus,
  Search,
  Scale,
  Percent,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  TrendingUp,
  UtensilsCrossed,
  X,
  Thermometer,
  ShieldCheck,
  Layers,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { useFranchise } from "@/lib/franchise-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { cn } from "@/components/ui/cn";

export default function MeatYieldPage() {
  const { filteredMeatBatches, outlets, addMeatBatch, selectedOutletId, setSelectedOutletId, role, activeOutlet } = useFranchise();
  const isSuperAdmin = role === "SUPER_ADMIN";
  const [showAddModal, setShowAddModal] = useState(false);
  const [meatTypeFilter, setMeatTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [outletId, setOutletId] = useState(selectedOutletId === "all" ? "bandra-west" : selectedOutletId);
  const [meatType, setMeatType] = useState<"Koyla Marinated Chicken" | "Smoked Charcoal Mutton" | "Special Spiced Chicken">("Koyla Marinated Chicken");
  const [spitId, setSpitId] = useState("Spit-01 (Front Roaster)");
  const [rawMeatKg, setRawMeatKg] = useState("35.0");
  const [marinationLossKg, setMarinationLossKg] = useState("1.2");
  const [skewerWeightKg, setSkewerWeightKg] = useState("33.8");
  const [cookedWeightKg, setCookedWeightKg] = useState("31.0");
  const [wasteScrapsKg, setWasteScrapsKg] = useState("0.8");
  const [wrapsCount, setWrapsCount] = useState("250");
  const [jumboCount, setJumboCount] = useState("60");
  const [plattersCount, setPlattersCount] = useState("20");
  const [coreTemp, setCoreTemp] = useState("78.5");
  const [loggedBy, setLoggedBy] = useState("Master Carver Farhan");
  const [notes, setNotes] = useState("Optimal spit rotational heat and charcoal smokiness.");

  const totalRawReceived = filteredMeatBatches.reduce((acc, b) => acc + b.rawMeatReceivedKg, 0);
  const totalCookedYield = filteredMeatBatches.reduce((acc, b) => acc + b.cookedWeightKg, 0);
  const totalWaste = filteredMeatBatches.reduce((acc, b) => acc + b.wasteScrapsKg, 0);
  const totalWrapsProduced = filteredMeatBatches.reduce((acc, b) => acc + b.wrapsProduced + b.jumboWrapsProduced, 0);

  const avgEfficiency =
    filteredMeatBatches.length > 0
      ? (filteredMeatBatches.reduce((acc, b) => acc + b.actualYieldPercent, 0) / filteredMeatBatches.length).toFixed(1)
      : "0.0";

  const displayedBatches = filteredMeatBatches.filter((b) => {
    const matchesFilter = meatTypeFilter === "all" || b.meatType.includes(meatTypeFilter);
    const matchesSearch =
      b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.outletName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.loggedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Batch Yield chart data
  const yieldChartData = displayedBatches.slice(0, 7).reverse().map((b) => ({
    name: b.batchNumber.split("-").slice(-2).join("-"),
    yield: b.actualYieldPercent,
    target: 92.0,
    spit: b.spitId,
    weight: b.cookedWeightKg,
  }));

  // Portion distribution data
  const portionData = [
    { name: "Classic Wraps", value: filteredMeatBatches.reduce((acc, b) => acc + b.wrapsProduced, 0), color: "#ffb703" },
    { name: "Jumbo Wraps", value: filteredMeatBatches.reduce((acc, b) => acc + b.jumboWrapsProduced, 0), color: "#ff5500" },
    { name: "Meat Platters", value: filteredMeatBatches.reduce((acc, b) => acc + b.plattersProduced, 0), color: "#3b82f6" },
  ];

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const targetO = outlets.find((o) => o.id === outletId) || outlets[0];
    const targetCode = targetO?.code || "IK-HQ-01";
    const targetName = targetO?.name || "Brand HQ";
    const targetId = targetO?.id || "hq-main";
    const skewer = parseFloat(skewerWeightKg) || 30;
    const cooked = parseFloat(cookedWeightKg) || 27;
    const batchNum = `IK-${targetCode.split("-")[2] || "MUM"}-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Date.now().toString().slice(-2)}`;

    addMeatBatch({
      batchNumber: batchNum,
      outletId: targetId,
      outletName: targetName,
      meatType,
      spitId,
      timeLoaded: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      rawMeatReceivedKg: parseFloat(rawMeatKg) || skewer + 1.5,
      marinationLossKg: parseFloat(marinationLossKg) || 1.0,
      skewerWeightKg: skewer,
      cookedWeightKg: cooked,
      wrapsProduced: parseInt(wrapsCount) || 0,
      jumboWrapsProduced: parseInt(jumboCount) || 0,
      plattersProduced: parseInt(plattersCount) || 0,
      wasteScrapsKg: parseFloat(wasteScrapsKg) || 0.8,
      targetYieldKg: Number((skewer * 0.92).toFixed(1)),
      coreTempCelsius: parseFloat(coreTemp) || 78.0,
      loggedBy,
      notes,
    });

    setShowAddModal(false);
  };

  const exportBatchesToCsv = () => {
    const headers = ["Batch Number", "Date", "Outlet Name", "Meat Type", "Spit ID", "Time Loaded", "Raw Meat (kg)", "Marination Loss (kg)", "Mounted Weight (kg)", "Cooked Weight (kg)", "Wraps Produced", "Waste Scraps (kg)", "Actual Yield %", "Logged By"];
    const rows = filteredMeatBatches.map((b) => [
      b.batchNumber,
      b.date,
      `"${b.outletName}"`,
      `"${b.meatType}"`,
      `"${b.spitId}"`,
      b.timeLoaded,
      b.rawMeatReceivedKg,
      b.marinationLossKg,
      b.skewerWeightKg,
      b.cookedWeightKg,
      b.wrapsProduced + b.jumboWrapsProduced,
      b.wasteScrapsKg,
      b.actualYieldPercent,
      `"${b.loggedBy}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `irani_koyla_meat_yield_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Meat & Spits
          </h1>
        </div>

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

          <Button
            variant="outline"
            onClick={exportBatchesToCsv}
            className="border-[#2e2e30] bg-[#1a1a1c] hover:bg-[#252528] text-zinc-300 hover:text-white font-bold text-xs h-10 px-3.5 rounded-xl gap-1.5 shadow-sm cursor-pointer"
          >
            <Scale className="w-4 h-4 text-orange-400" />
            <span>Download CSV</span>
          </Button>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs h-10 px-4 rounded-xl gap-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Batch</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards (2-Column Mobile Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Raw Meat Loaded */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-400">
              <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 block truncate">Raw Loaded</span>
              <p className="text-lg sm:text-2xl font-bold text-white font-mono tracking-tight mt-0.5 truncate">
                {totalRawReceived.toFixed(1)} <span className="text-xs font-bold text-zinc-400 font-sans">kg</span>
              </p>
              <span className="text-[10px] sm:text-xs text-zinc-400 block mt-0.5 truncate">
                Cooked: {totalCookedYield.toFixed(1)} kg
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Avg Spit Yield Efficiency */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
              <Percent className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-300 block truncate">Meat Efficiency</span>
              <p className="text-lg sm:text-2xl font-bold text-emerald-400 font-mono tracking-tight mt-0.5 truncate">
                {avgEfficiency}%
              </p>
              <span className="text-[10px] sm:text-xs text-emerald-400 font-medium block mt-0.5 truncate">
                Goal: 92%+
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Wraps Produced */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
              <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold text-purple-300 block truncate">Wraps Made</span>
              <p className="text-lg sm:text-2xl font-bold text-white font-mono tracking-tight mt-0.5 truncate">
                {totalWrapsProduced.toLocaleString("en-IN")}
              </p>
              <span className="text-[10px] sm:text-xs text-zinc-400 block mt-0.5 truncate">
                Avg: {totalWrapsProduced > 0 ? (totalCookedYield * 1000 / totalWrapsProduced).toFixed(0) : 0}g / wrap
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Roasting Spits Active */}
        <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardContent className="p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold text-blue-300 block truncate">Active Spits</span>
              <p className="text-lg sm:text-2xl font-bold text-blue-400 font-mono tracking-tight mt-0.5 truncate">
                {filteredMeatBatches.filter((b) => b.status === "roasting").length || filteredMeatBatches.length} Live
              </p>
              <span className="text-[10px] sm:text-xs text-zinc-400 block mt-0.5 truncate">
                {filteredMeatBatches.length} Total Batches
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Charts (Yield Trend & Portion Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Yield Efficiency by Batch Bar Chart */}
        <Card className="lg:col-span-2 border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span>Meat Efficiency per Batch</span>
            </CardTitle>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Goal: 92%
            </span>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yieldChartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2e" vertical={false} />
                  <XAxis dataKey="name" stroke="#888" fontSize={11} tickLine={false} />
                  <YAxis domain={[80, 100]} stroke="#888" fontSize={11} tickLine={false} tickFormatter={(val) => `${val}%`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#141416", borderColor: "#2e2e30", borderRadius: "12px", fontSize: "12px", color: "#fff" }}
                    formatter={(val: any) => [`${val}%`, "Efficiency"]}
                  />
                  <ReferenceLine y={92.0} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Target 92%", fill: "#f59e0b", fontSize: 10, position: "top" }} />
                  <Bar dataKey="yield" radius={[6, 6, 0, 0]}>
                    {yieldChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.yield >= 92 ? "#10b981" : "#f43f5e"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Portion Mix Output */}
        <Card className="border-[#303030] bg-[#1f1f1f]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              <span>Portions Produced Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={portionData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={4} dataKey="value">
                    {portionData.map((entry, index) => (
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
                    formatter={(val: any) => [`${val} units`, "Produced"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 pt-2 border-t border-[#303030]">
              {portionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[#b8b8c5]/70">{item.name}</span>
                  <span className="font-bold text-white ml-auto font-mono">{item.value.toLocaleString()} units</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Spit Batch History Table */}
      <Card className="border-[#303030] bg-[#1f1f1f] overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#303030] pb-4">
          <div>
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Batch Logs & Skewer Calibration Trail</span>
            </CardTitle>
            <p className="text-xs text-[#b8b8c5]/60 mt-0.5">
              Historical batches loaded on roasters with temperature and yield flags
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-48 sm:w-56">
              <Search className="w-3.5 h-3.5 text-[#b8b8c5]/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search batch, staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#161618] border border-[#303030] text-xs text-white placeholder-[#b8b8c5]/40 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={meatTypeFilter}
              onChange={(e) => setMeatTypeFilter(e.target.value)}
              className="h-8 px-2 rounded-lg bg-[#161618] border border-[#303030] text-xs text-[#b8b8c5] focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Meat Recipes</option>
              <option value="Chicken">Chicken</option>
              <option value="Mutton">Mutton</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#303030] bg-[#161618] text-[#b8b8c5]/60 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Batch Number</th>
                  <th className="py-3 px-4">Outlet & Spit</th>
                  <th className="py-3 px-4">Recipe Blend</th>
                  <th className="py-3 px-4">Skewer / Carved</th>
                  <th className="py-3 px-4">Wraps</th>
                  <th className="py-3 px-4">Yield %</th>
                  <th className="py-3 px-4">Core Temp</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303030]">
                {displayedBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-[#303030]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white font-mono block">{batch.batchNumber}</span>
                      <span className="text-[10px] text-[#b8b8c5]/50">{batch.date} &middot; {batch.timeLoaded}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-white block">{batch.outletName}</span>
                      <span className="text-[10px] text-[#b8b8c5]/60">{batch.spitId}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200">
                      {batch.meatType}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className="text-white">{batch.cookedWeightKg} kg</span>
                      <span className="text-[10px] text-[#b8b8c5]/50 block">/ {batch.skewerWeightKg} kg</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 font-mono">
                      {batch.wrapsProduced + batch.jumboWrapsProduced}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded font-mono font-bold text-xs",
                        batch.actualYieldPercent >= 92 ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
                      )}>
                        {batch.actualYieldPercent}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-amber-400">
                      {batch.coreTempCelsius}&deg;C
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                        batch.status === "completed" ? "bg-emerald-500/10 text-emerald-400" :
                        batch.status === "roasting" ? "bg-amber-500/10 text-amber-400" :
                        "bg-rose-500/10 text-rose-400"
                      )}>
                        {batch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Log Batch Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg bg-[#1f1f1f] border border-[#303030] text-white">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>Log Spit Skewer Batch</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateBatch} className="space-y-3.5 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#b8b8c5] mb-1">Franchise Hub</label>
                <select
                  value={outletId}
                  onChange={(e) => setOutletId(e.target.value)}
                  disabled={!isSuperAdmin}
                  className="w-full h-9 px-2 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {outlets.map((o) => (
                    <option key={o.id} value={o.id}>{o.name} ({o.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#b8b8c5] mb-1">Meat Recipe Blend</label>
                <select
                  value={meatType}
                  onChange={(e: any) => setMeatType(e.target.value)}
                  className="w-full h-9 px-2 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Koyla Marinated Chicken">Koyla Marinated Chicken</option>
                  <option value="Smoked Charcoal Mutton">Smoked Charcoal Mutton</option>
                  <option value="Special Spiced Chicken">Special Spiced Chicken</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-[#b8b8c5]/70 mb-1">Skewer Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={skewerWeightKg}
                  onChange={(e) => setSkewerWeightKg(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-[#161618] border border-[#303030] text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#b8b8c5]/70 mb-1">Carved Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={cookedWeightKg}
                  onChange={(e) => setCookedWeightKg(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-[#161618] border border-[#303030] text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#b8b8c5]/70 mb-1">Core Temp (&deg;C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={coreTemp}
                  onChange={(e) => setCoreTemp(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-[#161618] border border-[#303030] text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-[#b8b8c5]/70 mb-1">Regular Wraps</label>
                <input
                  type="number"
                  value={wrapsCount}
                  onChange={(e) => setWrapsCount(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-[#161618] border border-[#303030] text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#b8b8c5]/70 mb-1">Jumbo Wraps</label>
                <input
                  type="number"
                  value={jumboCount}
                  onChange={(e) => setJumboCount(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-[#161618] border border-[#303030] text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#b8b8c5]/70 mb-1">Meat Platters</label>
                <input
                  type="number"
                  value={plattersCount}
                  onChange={(e) => setPlattersCount(e.target.value)}
                  className="w-full h-8 px-2.5 rounded-lg bg-[#161618] border border-[#303030] text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#303030]">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)} className="border-[#303030] text-[#b8b8c5]">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-500 text-white font-bold">
                Save Batch Log
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
