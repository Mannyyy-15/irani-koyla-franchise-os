"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Flame,
  Store,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  UtensilsCrossed,
  Sparkles,
  Lock,
  Mail,
  Building,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { mockLoginAction } from "@/app/actions/auth";
import { INITIAL_OUTLETS } from "@/lib/mock-data";
import { useFranchise } from "@/lib/franchise-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginAsRole, outlets } = useFranchise();

  const [email, setEmail] = useState("admin@iranikoyla.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [magicLoginProgress, setMagicLoginProgress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-detect Magic Direct Login Link
  useEffect(() => {
    const isDirect = searchParams.get("direct_login");
    const paramEmail = searchParams.get("email");
    const paramOutlet = searchParams.get("outlet");

    if (isDirect === "true" && paramEmail) {
      const decodedEmail = decodeURIComponent(paramEmail).toLowerCase();
      setEmail(decodedEmail);
      setPassword("password123");
      setMagicLoginProgress(`Authorizing Direct Magic Login for ${paramOutlet || decodedEmail}...`);

      const timer = setTimeout(async () => {
        try {
          const cleanEmail = decodedEmail.trim();
          const targetRole = cleanEmail.includes("admin") ? "SUPER_ADMIN" : "FRANCHISE_OWNER";
          const targetOutletId = targetRole === "SUPER_ADMIN" ? "all" : "mohak-city";

          await mockLoginAction(targetRole);
          loginAsRole(targetRole, targetOutletId);

          setMagicLoginProgress("Authenticated! Launching portal...");
          setTimeout(() => {
            if (targetRole === "SUPER_ADMIN") {
              router.push("/admin");
            } else {
              router.push("/select-portal");
            }
          }, 400);
        } catch {
          setMagicLoginProgress(null);
          setErrorMsg("Direct magic login failed. Please enter your credentials manually.");
        }
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router, loginAsRole]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const isSuperAdmin = cleanEmail === "admin@iranikoyla.com" || cleanEmail.includes("admin");
    const isFranchise = cleanEmail.includes("mohak") || cleanEmail.includes("partner") || cleanEmail.includes("franchise");

    if (!isSuperAdmin && !isFranchise) {
      setLoading(false);
      setErrorMsg("Invalid credentials. Please select one of the authorized accounts below.");
      return;
    }

    if (!password) {
      setLoading(false);
      setErrorMsg("Password is required.");
      return;
    }

    try {
      const cleanEmail = email.trim().toLowerCase();
      const isSuperAdmin = cleanEmail === "admin@iranikoyla.com" || cleanEmail.includes("admin");
      
      let targetRole: "SUPER_ADMIN" | "FRANCHISE_OWNER" = "FRANCHISE_OWNER";
      let targetOutlet = "mohak-city";

      if (isSuperAdmin) {
        targetRole = "SUPER_ADMIN";
        targetOutlet = "all";
      } else {
        targetRole = "FRANCHISE_OWNER";
        const matchedOutlet = INITIAL_OUTLETS.find(
          (o) =>
            (o.loginEmail && o.loginEmail.toLowerCase() === cleanEmail) ||
            cleanEmail.includes(o.id) ||
            cleanEmail.includes(o.code.toLowerCase()) ||
            (cleanEmail.includes("mohak") && o.id === "mohak-city") ||
            (cleanEmail.includes("bandra") && o.id === "bandra-west") ||
            (cleanEmail.includes("andheri") && o.id === "andheri-east")
        );
        targetOutlet = matchedOutlet ? matchedOutlet.id : "mohak-city";
      }

      await mockLoginAction(targetRole);
      loginAsRole(targetRole, targetOutlet);

      if (targetRole === "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/select-portal");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  const populateAccount = (accEmail: string, accPassword = "password123") => {
    setEmail(accEmail);
    setPassword(accPassword);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex bg-[#161618] text-white selection:bg-orange-500 selection:text-black">
      {/* Left Panel: Form & Direct Credentials */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 z-10">
        <div className="max-w-md w-full mx-auto space-y-7">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-600 to-rose-700 flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.4)]">
              <Flame className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block text-white">
                Irani Koyla <span className="text-orange-500">FranchiseOS</span>
              </span>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                Multi-Tenant Authentication
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign In to Your Workspace
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Select Brand HQ (Super Admin) or your specific Franchise Partner terminal.
            </p>
          </div>

          {/* Magic Login Loading Overlay */}
          {magicLoginProgress && (
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-bold flex items-center gap-3 animate-pulse">
              <Sparkles className="w-5 h-5 text-orange-400 shrink-0 animate-spin" />
              <span>{magicLoginProgress}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-zinc-300">
                Network Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@iranikoyla.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#1f1f1f] border border-[#303030] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-zinc-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-zinc-400 hover:text-orange-400 transition-colors"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#1f1f1f] border border-[#303030] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 hover:opacity-95 hover:shadow-orange-600/40 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Test Accounts */}
          <div className="p-4 rounded-2xl bg-[#1f1f1f] border border-[#303030] space-y-3">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
              1-Click Switch Profile
            </span>

            <div className="grid grid-cols-1 gap-2">
              {/* Super Admin HQ */}
              <button
                type="button"
                onClick={() => populateAccount("admin@iranikoyla.com")}
                className="p-3 rounded-xl bg-[#161618] border border-orange-500/40 hover:border-orange-500 flex items-center justify-between text-xs text-left transition-all cursor-pointer group"
              >
                <div>
                  <span className="font-bold text-white block group-hover:text-orange-400 transition-colors">
                    🏢 Irani Koyla Brand HQ (Super Admin)
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">admin@iranikoyla.com &middot; Brand Master</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 shrink-0">
                  Super Admin
                </span>
              </button>

              {/* Dynamic Onboarded Outlets (if any) */}
              {outlets && outlets.length > 0 ? (
                outlets.map((outlet) => (
                  <button
                    key={outlet.id}
                    type="button"
                    onClick={() => populateAccount(outlet.loginEmail || `partner.${outlet.id}@iranikoyla.com`)}
                    className="p-3 rounded-xl bg-[#161618] border border-[#303030] hover:border-emerald-500 flex items-center justify-between text-xs text-left transition-all cursor-pointer group"
                  >
                    <div>
                      <span className="font-bold text-white block group-hover:text-emerald-400 transition-colors">
                        🏪 {outlet.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {outlet.loginEmail || `partner.${outlet.id}@iranikoyla.com`} &middot; {outlet.code}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      Franchise Partner
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-[#161618]/60 border border-dashed border-[#303030] text-center">
                  <p className="text-[11px] text-zinc-400">
                    No franchise hubs registered yet.
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Log in as Super Admin &rarr; Outlets &rarr; "Onboard Franchise Hub" to add your first branch.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Irani Koyla Brand Visual */}
      <div className="hidden lg:flex w-1/2 relative bg-[#121214] border-l border-[#303030] flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-600/15 via-transparent to-black" />

        <div className="relative z-10 flex justify-end">
          <span className="text-xs font-mono font-bold text-zinc-400 bg-[#1f1f1f] px-3 py-1.5 rounded-xl border border-[#303030] flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Koyla Production Terminal v2.4</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated Franchise Operations & POS</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight">
            Authentic Charcoal Shawarmas & Precision Spit Control.
          </h2>

          <p className="text-sm text-zinc-400 leading-relaxed">
            Multi-unit franchise management suite with real-time meat yield tracking, automated royalty billing, FSSAI temperature logs, and rapid counter POS.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#303030]">
            <div className="p-3 rounded-2xl bg-[#1f1f1f] border border-[#303030]">
              <span className="text-xl font-black text-emerald-400 font-mono block">94.2%</span>
              <span className="text-[10px] text-zinc-400 uppercase font-bold">Mohak Spit Yield</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#1f1f1f] border border-[#303030]">
              <span className="text-xl font-black text-orange-400 font-mono block">6.5%</span>
              <span className="text-[10px] text-zinc-400 uppercase font-bold">Royalty Rate</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#1f1f1f] border border-[#303030]">
              <span className="text-xl font-black text-blue-400 font-mono block">&lt; 15s</span>
              <span className="text-[10px] text-zinc-400 uppercase font-bold">POS Punch Time</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-zinc-500 font-mono flex items-center justify-between">
          <span>&copy; 2026 Irani Koyla Shawarma Brand HQ</span>
          <span>Security Certified · FSSAI Standard</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#161618] flex items-center justify-center text-white">Loading Login...</div>}>
      <LoginForm />
    </Suspense>
  );
}
