"use client";

import { useState } from "react";
import {
  FilePieChart,
  Filter,
  Search,
  Flame,
  Receipt,
  WalletCards,
  ShieldCheck,
  UtensilsCrossed,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  Store,
} from "lucide-react";
import { useFranchise } from "@/lib/franchise-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

export default function AuditTrailPage() {
  const { auditLogs } = useFranchise();
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const modules = ["all", "Sales", "Yield", "Royalty", "SupplyChain", "Pricing", "Operations"];

  const filteredLogs = auditLogs.filter((log) => {
    const matchModule = selectedModule === "all" || log.module === selectedModule;
    const matchSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.outletName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchModule && matchSearch;
  });

  const exportActivityLogToCsv = () => {
    const headers = ["Timestamp", "Module", "Action", "Outlet Name", "User", "Role", "Details"];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      l.module,
      `"${l.action}"`,
      `"${l.outletName}"`,
      `"${l.user}"`,
      `"${l.role}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `irani_koyla_activity_log_${new Date().toISOString().slice(0, 10)}.csv`);
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
            Activity Log
          </h1>
        </div>

        <Button
          variant="outline"
          onClick={exportActivityLogToCsv}
          className="border-[#2e2e30] bg-[#1a1a1c] hover:bg-[#252528] text-zinc-300 hover:text-white font-bold text-xs h-10 px-3.5 rounded-xl gap-1.5 shadow-sm cursor-pointer"
        >
          <FilePieChart className="w-4 h-4 text-orange-400" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1a1a1c] p-3 rounded-2xl border border-[#2e2e30]">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, outlet, or staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {modules.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedModule(m)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer shrink-0 border",
                selectedModule === m
                  ? "bg-orange-600 border-orange-500 text-white shadow-sm"
                  : "bg-[#141416] border-[#2e2e30] text-zinc-400 hover:text-white hover:border-orange-500/40"
              )}
            >
              {m === "all" ? "All" : m === "Yield" ? "Meat & Spits" : m === "SupplyChain" ? "Stock Orders" : m === "Pricing" ? "Menu Prices" : m}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Timeline Card */}
      <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-[#2e2e30] pb-3">
          <CardTitle className="text-sm font-bold text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>Recent Activity ({filteredLogs.length} Records)</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              Live Audit Log
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 px-4">
              <FilePieChart className="w-10 h-10 text-zinc-600 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-zinc-300">No activity logs recorded yet</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Real actions such as onboarding outlets, stock dispatches, menu pricing edits, and shift reconciliations will be logged here in real time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#2e2e30]">
              {filteredLogs.map((log) => {
                const moduleIcon =
                  log.module === "Sales" ? <Receipt className="w-4 h-4 text-amber-400" /> :
                  log.module === "Yield" ? <Flame className="w-4 h-4 text-orange-400" /> :
                  log.module === "Royalty" ? <WalletCards className="w-4 h-4 text-emerald-400" /> :
                  <Store className="w-4 h-4 text-zinc-400" />;

                return (
                  <div
                    key={log.id}
                    className="p-4 sm:p-5 hover:bg-[#222226] transition-colors flex items-start gap-3.5 text-xs"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#141416] border border-[#2e2e30] flex items-center justify-center shrink-0 mt-0.5">
                      {moduleIcon}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{log.action}</span>
                          <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                            {log.module === "Yield" ? "Meat" : log.module === "SupplyChain" ? "Stock" : log.module}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">{log.timestamp}</span>
                      </div>

                      <p className="text-zinc-300 text-xs leading-relaxed">
                        {log.details}
                      </p>

                      <div className="flex items-center gap-3 pt-1 text-[10px] text-zinc-500 font-mono">
                        <span>Outlet: {log.outletName}</span>
                        <span>•</span>
                        <span>By: {log.user} ({log.role})</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
