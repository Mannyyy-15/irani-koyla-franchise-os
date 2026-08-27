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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Activity Log
          </h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1f1f1f] p-3 rounded-2xl border border-[#303030]">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#b8b8c5]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, outlet, or staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white placeholder-[#b8b8c5]/40 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {modules.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedModule(m)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer shrink-0",
                selectedModule === m
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-[#b8b8c5]/70 hover:bg-[#303030] hover:text-white"
              )}
            >
              {m === "all" ? "All" : m === "Yield" ? "Meat & Spits" : m === "SupplyChain" ? "Stock Orders" : m === "Pricing" ? "Menu Prices" : m}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Timeline Card */}
      <Card className="border-[#303030] bg-[#1f1f1f] overflow-hidden">
        <CardHeader className="border-b border-[#303030] pb-3">
          <CardTitle className="text-sm font-bold text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Recent Activity ({filteredLogs.length} Records)</span>
            </div>
            <span className="text-[11px] text-[#b8b8c5]/50 font-mono">
              Live Record
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[#303030]">
            {filteredLogs.map((log) => {
              const moduleIcon =
                log.module === "Sales" ? <Receipt className="w-4 h-4 text-amber-400" /> :
                log.module === "Yield" ? <Flame className="w-4 h-4 text-orange-400" /> :
                log.module === "Royalty" ? <WalletCards className="w-4 h-4 text-emerald-400" /> :
                <Store className="w-4 h-4 text-slate-400" />;

              return (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 hover:bg-[#303030]/30 transition-colors flex items-start gap-3.5 text-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#161618] border border-[#303030] flex items-center justify-center shrink-0 mt-0.5">
                    {moduleIcon}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{log.action}</span>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.2 rounded border border-amber-500/20">
                          {log.module === "Yield" ? "Meat" : log.module === "SupplyChain" ? "Stock" : log.module}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#b8b8c5]/50 font-mono">{log.timestamp}</span>
                    </div>

                    <p className="text-[#b8b8c5]/80 text-xs leading-relaxed">
                      {log.details}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[10px] text-[#b8b8c5]/50 font-mono">
                      <span>Outlet: <strong className="text-[#b8b8c5]">{log.outletName}</strong></span>
                      <span>By: <strong className="text-[#b8b8c5]">{log.user} ({log.role})</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
