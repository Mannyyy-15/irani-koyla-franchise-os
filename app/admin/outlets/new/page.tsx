"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  ArrowLeft,
  CheckCircle2,
  Building,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Send,
  Sparkles,
  MapPin,
  Phone,
  RotateCcw,
  Percent,
  Flame,
  ShieldCheck,
  ArrowRight,
  Receipt,
  FileCheck,
} from "lucide-react";
import { useFranchise } from "@/lib/franchise-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

export default function NewFranchiseOnboardingPage() {
  const router = useRouter();
  const { addOutlet } = useFranchise();

  // 1. Outlet & Location Details
  const [name, setName] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [formatType, setFormatType] = useState<"Dine-in Restaurant" | "Express Kiosk" | "Cloud Delivery Kitchen">("Dine-in Restaurant");
  const [targetSales, setTargetSales] = useState("60000");

  // 2. Franchise Owner & Login Credentials
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [emailPrefix, setEmailPrefix] = useState("");
  const [isManualEmail, setIsManualEmail] = useState(false);
  const [loginPassword, setLoginPassword] = useState("Koyla#2026");
  const [showPassword, setShowPassword] = useState(false);

  // 3. Commercials & Roasters
  const [activeSpits, setActiveSpits] = useState("2");
  const [royaltyRate, setRoyaltyRate] = useState("6.5");
  const [marketingFundRate, setMarketingFundRate] = useState("2.0");
  const [fssaiNumber, setFssaiNumber] = useState("");
  const [gstin, setGstin] = useState("");

  // Provisioning Result state
  const [isProvisioned, setIsProvisioned] = useState(false);
  const [provisionedData, setProvisionedData] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPack, setCopiedPack] = useState(false);

  // Auto-generate email prefix when name/area changes if not manually typed
  useEffect(() => {
    if (!isManualEmail) {
      const source = area.trim() || name.trim() || "";
      if (source) {
        const clean = source.toLowerCase().replace(/[^a-z0-9]/g, "");
        setEmailPrefix(clean);
      }
    }
  }, [name, area, isManualEmail]);

  // Derived full email
  const fullLoginEmail = `${emailPrefix || "branch"}@iranikoylashawarma.com`;

  // Auto-calculated outlet code
  const cityCode = city === "Mumbai" ? "MUM" : city === "Pune" ? "PUN" : city === "Thane" ? "THA" : city === "Navi Mumbai" ? "NAV" : "HYD";
  const areaCode = (area.trim() || name.trim() || "HUB").slice(0, 3).toUpperCase();
  const previewOutletCode = `IK-${cityCode}-${areaCode}`;

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pwd = "Koyla#";
    for (let i = 0; i < 5; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setLoginPassword(pwd);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !area.trim() || !ownerName.trim() || !ownerPhone.trim()) {
      alert("Please fill in the required store and franchise partner fields.");
      return;
    }

    const payload = {
      name: name.trim(),
      city,
      area: area.trim(),
      address: address.trim() || `${area}, ${city}`,
      status: "active" as const,
      dailyTargetSales: parseFloat(targetSales) || 60000,
      dailyTargetWraps: Math.round((parseFloat(targetSales) || 60000) / 160),
      activeSpits: parseInt(activeSpits) || 2,
      totalSpits: parseInt(activeSpits) || 2,
      ownerName: ownerName.trim(),
      ownerEmail: fullLoginEmail,
      ownerPhone: ownerPhone.trim(),
      whatsappNumber: ownerPhone.trim(),
      panOrAadhaar: "PAN-VERIFIED",
      loginEmail: fullLoginEmail,
      loginPassword: loginPassword.trim() || "Koyla#2026",
      franchiseFeeAmount: 1500000,
      franchiseFeeStatus: "paid" as const,
      securityDepositAmount: 500000,
      royaltyRatePercent: parseFloat(royaltyRate) || 6.5,
      marketingFeePercent: parseFloat(marketingFundRate) || 2.0,
      territoryRadiusKm: 3.0,
      agreementTermYears: 5,
      managerName: ownerName.trim(),
      managerPhone: ownerPhone.trim(),
      fssaiNumber: fssaiNumber.trim() || "11526008000123",
      fssaiExpiry: "2028-12-31",
      lastAuditScore: 96,
      gstin: gstin.trim() || "27AABCZ8810A1Z2",
      openedAt: new Date().toISOString().split("T")[0],
    };

    addOutlet(payload);

    const magicUrl = typeof window !== "undefined"
      ? `${window.location.origin}/login?direct_login=true&email=${encodeURIComponent(fullLoginEmail)}&outlet=${encodeURIComponent(payload.name)}`
      : `/login?direct_login=true&email=${encodeURIComponent(fullLoginEmail)}`;

    setProvisionedData({
      ...payload,
      code: previewOutletCode,
      magicUrl,
    });
    setIsProvisioned(true);
  };

  const copyMagicLink = () => {
    if (!provisionedData) return;
    navigator.clipboard.writeText(provisionedData.magicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const copyWhatsAppPack = () => {
    if (!provisionedData) return;
    const msg = `🔥 *IRANI KOYLA SHAWARMA — FRANCHISE PARTNER ACCESS* 🔥\n\n` +
      `Official store provisioning completed for *${provisionedData.name}* (*${provisionedData.code}*).\n\n` +
      `👤 *Partner:* ${provisionedData.ownerName}\n` +
      `📍 *Location:* ${provisionedData.area}, ${provisionedData.city}\n\n` +
      `🔐 *STORE POS & OPERATING SYSTEM CREDENTIALS:*\n` +
      `🌐 Portal: https://irani-koyla-franchise-os.vercel.app/login\n` +
      `📧 Login Email: ${provisionedData.loginEmail}\n` +
      `🔑 Password: ${provisionedData.loginPassword}\n\n` +
      `⚡ *1-Click Magic Login Link:*\n${provisionedData.magicUrl}\n\n` +
      `_Brand Central HQ is connected to your live terminal._`;

    navigator.clipboard.writeText(msg);
    setCopiedPack(true);
    setTimeout(() => setCopiedPack(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* ── TOP HEADER AREA ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2e2e30]">
        <div className="space-y-1">
          <Link
            href="/admin/outlets"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Franchise Hubs Directory</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Store className="w-7 h-7 text-orange-500" />
              <span>Onboard Franchise Outlet</span>
            </h1>
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold bg-[#242427] text-orange-400 border border-[#383838]">
              {previewOutletCode}
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Register a new franchise branch with verified partner credentials, royalty agreement, and instant POS access.
          </p>
        </div>
      </div>

      {/* ── PROVISIONED SUCCESS VIEW ──────────────────────────────────── */}
      {isProvisioned && provisionedData ? (
        <Card className="border-emerald-500/40 bg-[#1a1a1c] shadow-2xl rounded-3xl p-6 sm:p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">
              ● Franchise Unit Authorized & Active
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {provisionedData.name}
            </h2>
            <p className="text-xs text-zinc-400">
              Branch code <strong>{provisionedData.code}</strong> is enrolled. The partner can now log into the POS terminal.
            </p>
          </div>

          {/* Credentials Box */}
          <div className="max-w-xl mx-auto p-5 rounded-2xl bg-[#141416] border border-[#2e2e30] text-left space-y-3">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-2 border-b border-[#28282b] pb-2">
              <Key className="w-4 h-4 text-orange-400" />
              <span>Franchise Partner Login Credentials</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#1a1a1c] border border-[#2e2e30]">
                <span className="text-[10px] text-zinc-500 block font-sans">Login Email</span>
                <strong className="text-white block mt-0.5 select-all">{provisionedData.loginEmail}</strong>
              </div>

              <div className="p-3 rounded-xl bg-[#1a1a1c] border border-[#2e2e30]">
                <span className="text-[10px] text-zinc-500 block font-sans">Temporary Password</span>
                <strong className="text-amber-400 block mt-0.5 select-all">{provisionedData.loginPassword}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <Button
                type="button"
                onClick={copyWhatsAppPack}
                className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold h-11 rounded-xl gap-2 shadow-md cursor-pointer"
              >
                {copiedPack ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                <span>{copiedPack ? "Copied WhatsApp Pack!" : "Copy WhatsApp Invite"}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={copyMagicLink}
                className="w-full sm:flex-1 bg-[#1f1f1f] border-[#303030] text-zinc-300 hover:text-white text-xs font-bold h-11 rounded-xl gap-2 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? "Link Copied!" : "Copy 1-Click Magic Link"}</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/admin/outlets">
              <Button
                variant="outline"
                className="bg-[#1f1f1f] border-[#303030] text-zinc-300 hover:text-white text-xs font-bold h-11 px-5 rounded-xl cursor-pointer"
              >
                <span>View All Outlets</span>
              </Button>
            </Link>

            <Link href="/pos">
              <Button
                className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider h-11 px-6 rounded-xl shadow-lg shadow-orange-600/25 flex items-center gap-2 cursor-pointer"
              >
                <span>Launch POS Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        /* ── ONBOARDING FORM ─────────────────────────────────────────── */
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* SECTION 1: Outlet & Location Profile */}
          <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-[#262628]">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>1. Outlet & Location Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Outlet Display Name <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bandra West Food Street, Mohak City Hub"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#2e2e30] hover:border-[#404040] focus:border-orange-500 text-sm text-white placeholder-zinc-500 focus:outline-none font-semibold transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Metropolitan City <span className="text-orange-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#141416] border border-[#2e2e30] hover:border-[#404040] focus:border-orange-500 text-sm text-white focus:outline-none font-semibold cursor-pointer transition-colors"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Thane">Thane</option>
                    <option value="Navi Mumbai">Navi Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Neighborhood / Area <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Linking Road, Vashi Sec 17"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#2e2e30] hover:border-[#404040] focus:border-orange-500 text-sm text-white placeholder-zinc-500 focus:outline-none font-semibold transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Store Format Type
                  </label>
                  <select
                    value={formatType}
                    onChange={(e) => setFormatType(e.target.value as any)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#141416] border border-[#2e2e30] text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Dine-in Restaurant">Dine-in Restaurant (Full Menu)</option>
                    <option value="Express Kiosk">Express Kiosk (High Volume Wraps)</option>
                    <option value="Cloud Delivery Kitchen">Cloud Delivery Kitchen (Zomato/Swiggy)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Daily Sales Target (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={targetSales}
                    onChange={(e) => setTargetSales(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#2e2e30] text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Full Store Premises Address
                </label>
                <input
                  type="text"
                  placeholder="Shop No. 4, Ground Floor, Main High Street..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#2e2e30] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 2: Franchise Owner & Portal Access */}
          <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-[#262628]">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-orange-400" />
                <span>2. Franchise Owner & Portal Access Credentials</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Franchise Partner Full Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Merchant"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#2e2e30] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Contact Phone / WhatsApp <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98205 11984"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#2e2e30] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

              {/* Login Email with Locked Domain Suffix */}
              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                  Portal Login Email Username <span className="text-orange-500">*</span>
                </label>
                <div className="flex items-center rounded-xl bg-[#141416] border border-[#2e2e30] hover:border-[#404040] focus-within:border-orange-500 overflow-hidden transition-colors">
                  <input
                    type="text"
                    required
                    placeholder="e.g. bandra"
                    value={emailPrefix}
                    onChange={(e) => {
                      setIsManualEmail(true);
                      setEmailPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""));
                    }}
                    className="flex-1 h-11 px-4 bg-transparent text-sm font-mono font-bold text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <span className="px-3.5 py-2.5 bg-[#202023] border-l border-[#2e2e30] text-xs font-mono font-bold text-orange-400 select-none shrink-0">
                    @iranikoylashawarma.com
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  Full Sign-in ID: <strong className="text-zinc-300 font-mono">{fullLoginEmail}</strong>
                </span>
              </div>

              {/* Password Generator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-zinc-300">
                    Initial System Password <span className="text-orange-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[10px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full h-11 px-4 pr-11 rounded-xl bg-[#141416] border border-[#2e2e30] text-sm font-mono font-bold text-amber-400 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: Operations & Commercial Terms */}
          <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-[#262628]">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>3. Kitchen Equipment & Commercial Agreement</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Charcoal Roaster Spits
                  </label>
                  <select
                    value={activeSpits}
                    onChange={(e) => setActiveSpits(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-[#141416] border border-[#2e2e30] text-sm text-white font-mono font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="1">1 Spit (30kg capacity)</option>
                    <option value="2">2 Spits (Dual 60kg capacity)</option>
                    <option value="3">3 Spits (Triple 90kg capacity)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Royalty Fee (% of Sales)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={royaltyRate}
                      onChange={(e) => setRoyaltyRate(e.target.value)}
                      className="w-full h-11 px-4 pr-8 rounded-xl bg-[#141416] border border-[#2e2e30] text-sm font-mono font-bold text-amber-400 focus:outline-none focus:border-orange-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">%</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Marketing Fund (% of Sales)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={marketingFundRate}
                      onChange={(e) => setMarketingFundRate(e.target.value)}
                      className="w-full h-11 px-4 pr-8 rounded-xl bg-[#141416] border border-[#2e2e30] text-sm font-mono font-bold text-zinc-300 focus:outline-none focus:border-orange-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    FSSAI License Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="11526008000123"
                    value={fssaiNumber}
                    onChange={(e) => setFssaiNumber(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#2e2e30] text-sm text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    GSTIN Registration (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="27AABCZ8810A1Z2"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#2e2e30] text-sm text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── BOTTOM SUBMIT ACTION BAR ─────────────────────────────── */}
          <div className="p-4 rounded-2xl bg-[#1a1a1c] border border-[#2e2e30] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Ready to Provision Outlet</span>
                <span className="text-[11px] text-zinc-400">
                  Will bind POS credentials for <strong className="text-orange-400 font-mono">{fullLoginEmail}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <Link href="/admin/outlets">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-[#141416] border-[#2e2e30] text-zinc-300 hover:text-white text-xs font-bold h-11 px-4 rounded-xl cursor-pointer"
                >
                  <span>Cancel</span>
                </Button>
              </Link>

              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider h-11 px-6 rounded-xl shadow-lg shadow-orange-600/25 flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Authorize & Provision Hub</span>
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
