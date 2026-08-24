"use client";

import { useState, useEffect } from "react";
import PosSidebar, { PosMobileSidebar } from "@/components/PosSidebar";
import PosTopNav from "@/components/PosTopNav";

export default function PosLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("koyla_pos_sidebar_collapsed");
      if (saved !== null) {
        setSidebarCollapsed(saved === "true");
      }
    } catch {}
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("koyla_pos_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#161618] text-white selection:bg-orange-500 selection:text-black">
      {/* Desktop Floating Curved Sidebar (Collapsible) */}
      <PosSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Mobile Slide-out Drawer */}
      <PosMobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Right Section (TopNav + Scrollable Content) */}
      <div className="flex flex-1 flex-col overflow-hidden relative min-w-0">
        <PosTopNav
          onMenuClick={() => setMobileMenuOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />

        <main
          id="pos-main-content"
          className="mobile-content-safe flex-1 overflow-y-auto"
        >
          <div className="p-3 sm:p-4 lg:p-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
