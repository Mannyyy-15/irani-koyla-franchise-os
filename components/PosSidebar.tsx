"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Clock,
  UtensilsCrossed,
  Receipt,
  Banknote,
  Flame,
  Store,
  Layers,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/components/ui/cn";
import { useFranchise } from "@/lib/franchise-context";
import { logout } from "@/app/actions/auth";

const posNavigationSections = [
  {
    label: "POS REGISTER",
    items: [
      { name: "Counter Billing", href: "/pos", icon: ShoppingBag, exact: true },
      { name: "Orders & Receipts", href: "/pos/history", icon: Receipt, exact: false, badgeKey: "orders" },
    ],
  },
  {
    label: "STORE HUB",
    items: [
      { name: "Store Management", href: "/admin", icon: Store, exact: false },
      { name: "Switch Workspace", href: "/select-portal", icon: Layers, exact: false },
    ],
  },
] as const;

function PosSidebarBody({
  collapsed = false,
  onToggle,
  onNavigate,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeOutlet, outlets, liveOrders } = useFranchise();
  const currentOutlet = activeOutlet || outlets[0];

  const totalOrdersCount = liveOrders.length;

  const handleLogout = async () => {
    try {
      await logout();
    } catch {}
    router.push("/login");
  };

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col bg-[#1f1f1f] rounded-2xl border border-[#303030] shadow-2xl overflow-hidden transition-all duration-300",
        collapsed ? "items-center" : ""
      )}
      suppressHydrationWarning
    >
      {/* Brand Header & Collapse Toggle */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-[#303030] px-3 transition-all",
          collapsed ? "justify-center w-full" : "justify-between w-full px-4"
        )}
        suppressHydrationWarning
      >
        <Link href="/pos" className="flex items-center gap-2.5 min-w-0" onClick={onNavigate}>
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-600 to-rose-700 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.35)] shrink-0">
            <Flame className="w-5 h-5 text-white animate-pulse" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none min-w-0">
              <span className="text-sm font-black text-white tracking-tight flex items-center gap-1.5 truncate">
                Irani Koyla
                <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-1.5 py-0.5 rounded border border-orange-500/30">
                  POS
                </span>
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mt-0.5 truncate">
                Counter #01
              </span>
            </div>
          )}
        </Link>

        {/* Toggle Button for Desktop */}
        {onToggle && !collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 rounded-xl bg-[#161618] border border-[#303030] text-zinc-400 hover:text-white hover:border-orange-500 transition-all cursor-pointer shrink-0"
            title="Collapse Sidebar for Wider POS Screen"
          >
            <PanelLeftClose className="w-4 h-4 text-zinc-400" />
          </button>
        )}
      </div>

      {/* When Collapsed: Quick Expand Button at Top */}
      {collapsed && onToggle && (
        <div className="pt-2 pb-1">
          <button
            type="button"
            onClick={onToggle}
            className="p-2 rounded-xl bg-[#161618] border border-[#303030] text-zinc-400 hover:text-orange-400 hover:border-orange-500 transition-all cursor-pointer shadow-md"
            title="Expand Sidebar"
          >
            <PanelLeftOpen className="w-4 h-4 text-orange-400" />
          </button>
        </div>
      )}

      {/* Navigation Sections */}
      <nav className={cn(
        "flex flex-1 flex-col overflow-y-auto py-3 w-full scrollbar-none",
        collapsed ? "px-2 items-center" : "px-3"
      )} aria-label="POS navigation">
        {posNavigationSections.map((section, sectionIndex) => (
          <div key={section.label} className={cn("w-full space-y-1", sectionIndex > 0 && "mt-4")}>
            {!collapsed && (
              <div className="px-3 py-1">
                <span className="text-[10px] font-extrabold tracking-wider text-zinc-500 uppercase">
                  {section.label}
                </span>
              </div>
            )}

            {section.items.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const badgeValue = (item as any).badgeKey === "orders" ? totalOrdersCount : null;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    "group flex items-center rounded-xl text-xs font-bold transition-all cursor-pointer",
                    collapsed
                      ? "justify-center p-2.5 my-1"
                      : "justify-between px-3 py-2.5",
                    isActive
                      ? "bg-orange-600 text-white shadow-[0_2px_12px_rgba(249,115,22,0.35)]"
                      : "text-zinc-400 hover:bg-[#161618] hover:text-white hover:border-[#303030]"
                  )}
                >
                  <div className={cn("flex items-center", collapsed ? "justify-center" : "gap-3")}>
                    <item.icon
                      className={cn(
                        "shrink-0 transition-transform group-hover:scale-110",
                        collapsed ? "h-5 w-5" : "h-4 w-4",
                        isActive ? "text-white" : "text-zinc-400 group-hover:text-orange-400"
                      )}
                    />
                    {!collapsed && <span>{item.name}</span>}
                  </div>

                  {!collapsed && badgeValue !== null && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {badgeValue}
                    </span>
                  )}

                  {collapsed && badgeValue !== null && badgeValue > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Cashier Footer Profile */}
      <div
        className={cn(
          "shrink-0 border-t border-[#303030] bg-[#161618] w-full",
          collapsed ? "p-2 flex flex-col items-center" : "p-3"
        )}
        suppressHydrationWarning
      >
        {collapsed ? (
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out (Imran S.)"
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-xs flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
            suppressHydrationWarning
          >
            IS
          </button>
        ) : (
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#1f1f1f] border border-[#303030]" suppressHydrationWarning>
            <div className="flex items-center gap-2.5 min-w-0" suppressHydrationWarning>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-xs flex items-center justify-center shrink-0" suppressHydrationWarning>
                IS
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white truncate block leading-tight">
                  Imran S.
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold truncate block leading-tight flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Cashier
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-[#161618] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PosSidebar({
  collapsed = false,
  onToggle,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  return (
    <aside className={cn(
      "hidden lg:flex shrink-0 flex-col pl-3 py-3 z-20 transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      <PosSidebarBody collapsed={collapsed} onToggle={onToggle} />
    </aside>
  );
}

export function PosMobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] p-3"
          >
            <PosSidebarBody onNavigate={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
