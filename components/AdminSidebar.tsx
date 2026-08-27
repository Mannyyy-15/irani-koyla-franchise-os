"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Store,
  Flame,
  Receipt,
  WalletCards,
  ShieldCheck,
  UtensilsCrossed,
  FilePieChart,
  Settings,
  X,
  LogOut,
  Sparkles,
  Building,
  UserCheck,
  Truck,
  PanelLeftClose,
  PanelLeftOpen,
  CalendarDays,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/components/ui/cn";
import { LogoutConfirmModal } from "@/components/ui/LogoutConfirmModal";
import { logout } from "@/app/actions/auth";
import { clearCurrentUserCache, getCurrentUserCached } from "@/lib/currentUserClient";
import { clearPersistentCache } from "@/hooks/useActionCache";
import { useFranchise } from "@/lib/franchise-context";

const superAdminNav = [
  {
    label: "MAIN MENU",
    items: [
      { name: "Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Monthly Performance", href: "/admin/monthly", icon: CalendarDays },
      { name: "Outlets", href: "/admin/outlets", icon: Store },
      { name: "Stock & Supplies", href: "/admin/supply-chain", icon: Truck },
      { name: "Menu & Recipes", href: "/admin/menu", icon: UtensilsCrossed },
    ],
  },
  {
    label: "FINANCE & TRACKING",
    items: [
      { name: "Royalties", href: "/admin/royalties", icon: WalletCards },
      { name: "Daily Sales & Shifts", href: "/admin/sales", icon: Receipt },
      { name: "Meat & Spit Yield", href: "/admin/yield", icon: Flame },
      { name: "Activity Log", href: "/admin/audit", icon: FilePieChart },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

const franchiseNav = [
  {
    label: "MY STORE",
    items: [
      { name: "Store Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Monthly Performance", href: "/admin/monthly", icon: CalendarDays },
      { name: "Billing POS", href: "/pos", icon: Receipt },
    ],
  },
  {
    label: "STOCK & KITCHEN",
    items: [
      { name: "Order Raw Materials", href: "/admin/supply-chain", icon: Truck },
      { name: "Meat & Spits", href: "/admin/yield", icon: Flame },
    ],
  },
  {
    label: "FINANCE",
    items: [
      { name: "Royalties & Bills", href: "/admin/royalties", icon: WalletCards },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { name: "Zomato & Swiggy Connect", href: "/admin/integrations", icon: Settings },
    ],
  },
];

function SidebarBody({
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
  const { role, activeOutlet } = useFranchise();
  const [user, setUser] = useState<{ name: string; email: string; role: string; avatarUrl?: string } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    getCurrentUserCached().then((res) => {
      if (res) {
        setUser({ name: res.name as string, email: res.email as string, role: res.role as string, avatarUrl: res.avatarUrl as string });
      }
    });
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const res = await logout();
    if (res.success) {
      clearCurrentUserCache();
      clearPersistentCache();
      router.push("/login");
    }
    setIsLoggingOut(false);
  };

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col bg-[#1f1f1f] rounded-2xl border border-[#303030] shadow-2xl overflow-hidden transition-all duration-300",
        collapsed ? "items-center" : ""
      )}
      suppressHydrationWarning
    >
      {/* Brand Header */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-[#303030] px-3 transition-all",
          collapsed ? "justify-center w-full" : "justify-between w-full px-4"
        )}
        suppressHydrationWarning
      >
        <Link href="/admin" className="flex items-center gap-3 min-w-0" onClick={onNavigate}>
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0 border border-orange-400/30">
            <Flame className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-[13px] font-bold text-white tracking-tight truncate">
                  Irani Koyla
                </span>
                <span className="text-[9px] font-black tracking-wider uppercase bg-orange-500/15 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded-md leading-none">
                  {role === "SUPER_ADMIN" ? "HQ" : "PARTNER"}
                </span>
              </div>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-tight mt-0.5">
                Franchise OS
              </span>
            </div>
          )}
        </Link>

        {/* Toggle Button for Desktop */}
        {onToggle && !collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="p-1.5 rounded-lg bg-[#262629] hover:bg-[#303034] border border-[#38383c] text-zinc-400 hover:text-white transition-all cursor-pointer shrink-0"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* When Collapsed: Quick Expand Button at Top */}
      {collapsed && onToggle && (
        <div className="pt-2 pb-1" suppressHydrationWarning>
          <button
            type="button"
            onClick={onToggle}
            className="p-2 rounded-xl bg-[#161618] border border-[#303030] text-orange-400 hover:text-white hover:bg-orange-600/20 transition-all cursor-pointer"
            title="Expand Sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Sections */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-2.5 py-3 w-full no-scrollbar" aria-label="FranchiseOS workspace">
        {(role === "SUPER_ADMIN" ? superAdminNav : franchiseNav).map((section, sectionIndex) => (
          <div key={section.label} className={sectionIndex === 0 ? "" : "mt-4"} suppressHydrationWarning>
            {!collapsed && (
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {section.label}
              </p>
            )}
            <ul role="list" className="flex flex-col gap-y-1">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.name : undefined}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group relative flex min-h-10 items-center rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer",
                        collapsed ? "justify-center px-0 py-2.5" : "gap-x-3 px-3 py-2.5",
                        isActive
                          ? "bg-gradient-to-r from-orange-600/25 to-amber-600/15 border border-orange-500/30 text-orange-400 font-black shadow-md"
                          : "text-zinc-400 hover:text-white hover:bg-[#161618] border border-transparent"
                      )}
                    >
                      {isActive && !collapsed && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                      )}
                      <item.icon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-colors",
                          isActive
                            ? "text-orange-400"
                            : "text-zinc-400 group-hover:text-white"
                        )}
                      />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Profile & Status */}
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
            onClick={() => setShowLogoutModal(true)}
            title="Sign Out"
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-xs flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
            suppressHydrationWarning
          >
            {role === "SUPER_ADMIN" ? "HQ" : "FO"}
          </button>
        ) : (
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#1f1f1f] border border-[#303030]" suppressHydrationWarning>
            <Link
              href="/admin/settings"
              onClick={onNavigate}
              className="flex items-center gap-2.5 rounded-xl transition-colors cursor-pointer min-w-0 flex-1"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-black text-xs shrink-0" suppressHydrationWarning>
                {role === "SUPER_ADMIN" ? "HQ" : "FO"}
              </div>
              <div className="flex flex-col min-w-0" suppressHydrationWarning>
                <span className="text-xs font-bold text-white truncate leading-tight">
                  {role === "SUPER_ADMIN" ? "Brand Executive" : activeOutlet?.name || "Partner Store"}
                </span>
                <span className="text-[10px] text-zinc-400 truncate leading-tight mt-0.5">
                  {role === "SUPER_ADMIN" ? "admin@iranikoyla.com" : activeOutlet?.ownerEmail || "partner@iranikoyla.com"}
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-[#161618] transition-colors cursor-pointer shrink-0 ml-1"
              aria-label="Log out"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        isLoading={isLoggingOut}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
}

export default function AdminSidebar({
  collapsed = false,
  onToggle,
  mobileOpen = false,
  onClose,
}: {
  collapsed?: boolean;
  onToggle?: () => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      {/* Desktop Floating Curved Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex shrink-0 flex-col pl-3 py-3 z-20 transition-all duration-300",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarBody collapsed={collapsed} onToggle={onToggle} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="absolute inset-y-0 left-0 w-72 max-w-[85vw] p-3"
            >
              <div className="relative h-full">
                <button
                  onClick={onClose}
                  className="icon-button absolute top-3 right-3 z-10 text-zinc-400 hover:text-white bg-[#161618] border border-[#303030] rounded-xl p-1.5 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
                <SidebarBody onNavigate={onClose} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
