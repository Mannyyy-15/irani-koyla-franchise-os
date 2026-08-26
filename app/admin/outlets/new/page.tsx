"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Store,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Building,
  User,
  ShieldCheck,
  Flame,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Send,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Receipt,
  RotateCcw,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFranchise } from "@/lib/franchise-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

export default function NewFranchiseOnboardingPage() {
  const router = useRouter();
  const { addOutlet } = useFranchise();

  // Wizard Step State (1: Store, 2: Partner & Credentials, 3: Operations & Commercials, 4: Success)
  const [step, setStep] = useState<number>(1);

  // Step 1: Store & Territory
  const [name, setName] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [formatType, setFormatType] = useState<"Dine-in Restaurant" | "Express Kiosk" | "Cloud Delivery Kitchen">("Dine-in Restaurant");
  const [targetSales, setTargetSales] = useState("60000");
  const [targetWraps, setTargetWraps] = useState("380");

  // Step 2: Franchise Partner & Portal Credentials
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("KoylaPartner#2026");
  const [showPassword, setShowPassword] = useState(false);

  // Step 3: Commercials & Operations
  const [activeSpits, setActiveSpits] = useState("2");
  const [royaltyRate, setRoyaltyRate] = useState("6.5");
  const [marketingFundRate, setMarketingFundRate] = useState("2.0");
  const [franchiseFeeAmount, setFranchiseFeeAmount] = useState("1500000");
  const [securityDepositAmount, setSecurityDepositAmount] = useState("500000");
  const [managerName, setManagerName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [fssaiNumber, setFssaiNumber] = useState("11526008000123");
  const [gstin, setGstin] = useState("27AABCZ8810A1Z2");

  // Success State
  const [provisionedOutlet, setProvisionedOutlet] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPack, setCopiedPack] = useState(false);

  // Auto-calculated outlet code
  const cityCode = city === "Mumbai" ? "MUM" : city === "Pune" ? "PUN" : city === "Thane" ? "THA" : "HYD";
  const areaCode = (area.trim() || name.trim() || "HUB").slice(0, 3).toUpperCase();
  const previewOutletCode = `IK-${cityCode}-${areaCode}`;

  // Smart suggestions
  const suggestedEmail = (name.trim() || ownerName.trim())
    ? `partner.${(name || ownerName).toLowerCase().replace(/[^a-z0-9]+/g, "")}@iranikoyla.com`
    : "partner.branch@iranikoyla.com";

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pwd = "Koyla#";
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setLoginPassword(pwd);
  };

  const handleCompleteOnboarding = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const cleanEmail = loginEmail.trim() || suggestedEmail;
    const cleanPass = loginPassword.trim() || "password123";

    const payload = {
      name: name.trim() || `${city} Central Hub`,
      city,
      area: area.trim() || "Prime Commercial Belt",
      address: address.trim() || `${area}, ${city}`,
      status: "active" as const,
      dailyTargetSales: parseFloat(targetSales) || 60000,
      dailyTargetWraps: parseInt(targetWraps) || 380,
      activeSpits: parseInt(activeSpits) || 2,
      totalSpits: parseInt(activeSpits) || 2,
      ownerName: ownerName.trim() || "Franchise Partner",
      ownerEmail: ownerEmail.trim() || cleanEmail,
      ownerPhone: ownerPhone.trim() || "+91 98200 00000",
      whatsappNumber: whatsappNumber.trim() || ownerPhone || "+91 98200 00000",
      panOrAadhaar: "ABCDE1234F",
      loginEmail: cleanEmail,
      loginPassword: cleanPass,
      franchiseFeeAmount: parseFloat(franchiseFeeAmount) || 1500000,
      franchiseFeeStatus: "paid" as const,
      securityDepositAmount: parseFloat(securityDepositAmount) || 500000,
      royaltyRatePercent: parseFloat(royaltyRate) || 6.5,
      marketingFeePercent: parseFloat(marketingFundRate) || 2.0,
      territoryRadiusKm: 3.0,
      agreementTermYears: 5,
      managerName: managerName.trim() || "Store Manager",
      managerPhone: managerPhone.trim() || ownerPhone,
      fssaiNumber,
      fssaiExpiry: "2028-06-30",
      lastAuditScore: 98,
      gstin,
      openedAt: new Date().toISOString().split("T")[0],
    };

    addOutlet(payload);

    const magicUrl = typeof window !== "undefined"
      ? `${window.location.origin}/login?direct_login=true&email=${encodeURIComponent(cleanEmail)}&outlet=${encodeURIComponent(payload.name)}`
      : `/login?direct_login=true&email=${encodeURIComponent(cleanEmail)}`;

    setProvisionedOutlet({
      ...payload,
      code: previewOutletCode,
      magicUrl,
    });

    setStep(4);
  };

  const copyMagicLink = () => {
    if (!provisionedOutlet) return;
    navigator.clipboard.writeText(provisionedOutlet.magicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const copyWhatsAppPack = () => {
    if (!provisionedOutlet) return;
    const msg = `🔥 *WELCOME TO IRANI KOYLA SHAWARMA FRANCHISE NETWORK* 🔥\n\n` +
      `Official store provisioning completed for *${provisionedOutlet.name}* (*${provisionedOutlet.code}*).\n\n` +
      `👤 *Franchise Partner:* ${provisionedOutlet.ownerName}\n` +
      `📍 *Location:* ${provisionedOutlet.area}, ${provisionedOutlet.city}\n\n` +
      `🔐 *STORE POS & OPERATING SYSTEM LOGIN:*\n` +
      `🌐 Portal: https://crm.iranikoylashawarma.com/login\n` +
      `📧 Login ID: ${provisionedOutlet.loginEmail}\n` +
      `🔑 Password: ${provisionedOutlet.loginPassword}\n\n` +
      `⚡ *1-Click Magic Direct Login:* ${provisionedOutlet.magicUrl}\n\n` +
      `Please ensure initial float of ₹2,000 is verified at store opening. Brand Central HQ is standing by.`;

    navigator.clipboard.writeText(msg);
    setCopiedPack(true);
    setTimeout(() => setCopiedPack(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#161618] text-white p-4 sm:p-8 font-sans selection:bg-orange-500/30">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2e2e30]">
          <div className="space-y-1">
            <Link
              href="/admin/outlets"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-orange-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Franchise Hubs Directory</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Store className="w-7 h-7 text-orange-500" />
              <span>Franchise Partner Onboarding Studio</span>
            </h1>
            <p className="text-xs text-zinc-400">
              Provision a new franchise unit with verified credentials, commercial terms, and instant POS access.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-zinc-400 bg-[#1f1f1f] px-3 py-1.5 rounded-xl border border-[#303030]">
              Step {step} of 3
            </span>
          </div>
        </div>

        {/* Step Indicator Bar */}
        {step < 4 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { num: 1, title: "Store & Territory", desc: "Location & Identity", icon: MapPin },
              { num: 2, title: "Partner & Credentials", desc: "Access & Security", icon: Key },
              { num: 3, title: "Operations & Agreement", desc: "Spits & Royalty", icon: ShieldCheck },
            ].map((s) => {
              const Icon = s.icon;
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => step > s.num && setStep(s.num)}
                  className={cn(
                    "p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3",
                    isActive
                      ? "bg-orange-500/10 border-orange-500 text-white shadow-lg shadow-orange-500/10"
                      : isPast
                      ? "bg-[#1f1f1f] border-emerald-500/40 text-emerald-400 cursor-pointer"
                      : "bg-[#1a1a1c] border-[#2e2e30] text-zinc-500 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border",
                    isActive
                      ? "bg-orange-600 text-white border-orange-500"
                      : isPast
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-[#242427] text-zinc-500 border-[#333]"
                  )}>
                    {isPast ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <p className={cn("text-xs font-bold truncate", isActive ? "text-white" : isPast ? "text-zinc-200" : "text-zinc-500")}>
                      {s.title}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content Layout (Form on Left, Live Card on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Area */}
          <div className={cn(step === 4 ? "lg:col-span-12" : "lg:col-span-7", "space-y-6")}>
            <AnimatePresence mode="wait">
              {/* STEP 1: Store & Territory */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-6 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-5 shadow-xl"
                >
                  <div className="border-b border-[#2e2e30] pb-3">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      <span>Step 1: Store & Territory Profile</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Enter the physical branch name, metropolitan territory, and store layout.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                        Franchise Outlet Display Name <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bandra West Food Street, Mohak City Hub"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-semibold"
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
                          className="w-full h-11 px-3 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white focus:outline-none focus:border-orange-500 font-semibold cursor-pointer"
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
                          className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                        Store Format Type
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { title: "Dine-in Restaurant", icon: Store },
                          { title: "Express Kiosk", icon: Flame },
                          { title: "Cloud Delivery Kitchen", icon: Compass },
                        ].map((fmt) => (
                          <button
                            key={fmt.title}
                            type="button"
                            onClick={() => setFormatType(fmt.title as any)}
                            className={cn(
                              "p-3 rounded-xl border text-center transition-all text-xs font-bold flex flex-col items-center gap-1.5",
                              formatType === fmt.title
                                ? "bg-orange-500/15 border-orange-500 text-white shadow-sm"
                                : "bg-[#141416] border-[#2e2e30] text-zinc-400 hover:text-white"
                            )}
                          >
                            <fmt.icon className="w-4 h-4 text-orange-400" />
                            <span>{fmt.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                          Daily Sales Target (₹ INR)
                        </label>
                        <input
                          type="number"
                          value={targetSales}
                          onChange={(e) => setTargetSales(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                          Daily Target Wraps Count
                        </label>
                        <input
                          type="number"
                          value={targetWraps}
                          onChange={(e) => setTargetWraps(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm font-mono font-bold text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                        Full Premises Address
                      </label>
                      <input
                        type="text"
                        placeholder="Shop No. 4, Ground Floor, Near Main Market..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2e2e30] flex justify-end">
                    <Button
                      type="button"
                      disabled={!name.trim() || !area.trim()}
                      onClick={() => setStep(2)}
                      className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider h-11 px-6 rounded-xl shadow-lg shadow-orange-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span>Continue to Partner Credentials</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Partner & Credentials */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-6 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-5 shadow-xl"
                >
                  <div className="border-b border-[#2e2e30] pb-3">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <Key className="w-5 h-5 text-orange-500" />
                      <span>Step 2: Franchise Partner & Portal Credentials</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Set up the store owner identity and system login credentials for POS and Store Admin.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                          Franchise Owner / Partner Name <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tariq Merchant, Faisal Khan"
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                          Contact Phone Number <span className="text-orange-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98205 11984"
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                          WhatsApp Notification Number
                        </label>
                        <input
                          type="tel"
                          placeholder={ownerPhone || "+91 98205 11984"}
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                          Partner Personal Email
                        </label>
                        <input
                          type="email"
                          placeholder="tariq@gmail.com"
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#141416] border border-orange-500/30 space-y-3.5">
                      <span className="text-xs font-black text-orange-400 uppercase tracking-wider block">
                        🔑 Portal Sign-in Credentials (Generated)
                      </span>

                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1">
                          Login Email ID (Username)
                        </label>
                        <input
                          type="email"
                          value={loginEmail}
                          placeholder={suggestedEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full h-10 px-3.5 rounded-xl bg-[#1b1b1e] border border-[#303030] text-xs font-mono font-bold text-white focus:outline-none focus:border-orange-500"
                        />
                        <span className="text-[10px] text-zinc-500 mt-1 block">
                          Defaults to: {suggestedEmail}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-zinc-300">
                            Initial Portal Password
                          </label>
                          <button
                            type="button"
                            onClick={handleGeneratePassword}
                            className="text-[10px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Regenerate Secure Pass</span>
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full h-10 px-3.5 pr-10 rounded-xl bg-[#1b1b1e] border border-[#303030] text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2e2e30] flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="bg-[#1f1f1f] border-[#303030] text-zinc-300 hover:text-white text-xs font-bold h-11 px-4 rounded-xl"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      <span>Back</span>
                    </Button>

                    <Button
                      type="button"
                      disabled={!ownerName.trim() || !ownerPhone.trim()}
                      onClick={() => setStep(3)}
                      className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider h-11 px-6 rounded-xl shadow-lg shadow-orange-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span>Continue to Agreement Terms</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Commercials & Operations */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="p-6 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-5 shadow-xl"
                >
                  <div className="border-b border-[#2e2e30] pb-3">
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-orange-500" />
                      <span>Step 3: Commercial Agreement & Roaster Setup</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Define the royalty agreement, roaster spit count, and store compliance.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                          Brand Royalty Fee Rate (% of Gross Sales)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={royaltyRate}
                          onChange={(e) => setRoyaltyRate(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm font-mono font-bold text-amber-400 focus:outline-none focus:border-orange-500"
                        />
                        <span className="text-[10px] text-zinc-500 mt-1 block">Brand standard: 6.5%</span>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                          Central Marketing Fund (% of Sales)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={marketingFundRate}
                          onChange={(e) => setMarketingFundRate(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm font-mono font-bold text-zinc-300 focus:outline-none focus:border-orange-500"
                        />
                        <span className="text-[10px] text-zinc-500 mt-1 block">Standard: 2.0%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                          Number of Charcoal Shawarma Spits
                        </label>
                        <select
                          value={activeSpits}
                          onChange={(e) => setActiveSpits(e.target.value)}
                          className="w-full h-11 px-3 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white font-mono font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          <option value="1">1 Spit (30kg capacity)</option>
                          <option value="2">2 Spits (Dual Roaster 60kg capacity)</option>
                          <option value="3">3 Spits (Triple Mega Roaster 90kg capacity)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                          Onsite Store Manager Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Master Chef Raheem"
                          value={managerName}
                          onChange={(e) => setManagerName(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                          FSSAI License Number
                        </label>
                        <input
                          type="text"
                          value={fssaiNumber}
                          onChange={(e) => setFssaiNumber(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white font-mono focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                          GSTIN Registration Number
                        </label>
                        <input
                          type="text"
                          value={gstin}
                          onChange={(e) => setGstin(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white font-mono focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#2e2e30] flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="bg-[#1f1f1f] border-[#303030] text-zinc-300 hover:text-white text-xs font-bold h-11 px-4 rounded-xl"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      <span>Back</span>
                    </Button>

                    <Button
                      type="button"
                      onClick={handleCompleteOnboarding}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider h-11 px-6 rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Authorize & Launch Franchise Hub</span>
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: SUCCESS PROVISIONED STATE */}
              {step === 4 && provisionedOutlet && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-3xl bg-[#1a1a1c] border border-emerald-500/40 text-center space-y-6 shadow-2xl"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">
                      Franchise Provisioning Authorized & Active
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      {provisionedOutlet.name} is Live!
                    </h2>
                    <p className="text-xs text-zinc-400 max-w-lg mx-auto">
                      Branch code <strong>{provisionedOutlet.code}</strong> has been enrolled into Brand Central HQ. The store can now punch live POS orders and mount spit batches.
                    </p>
                  </div>

                  {/* Credentials Dispatch Pack */}
                  <div className="max-w-xl mx-auto p-5 rounded-2xl bg-[#141416] border border-[#303030] text-left space-y-3.5">
                    <div className="flex items-center justify-between border-b border-[#262628] pb-2.5">
                      <span className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                        <Key className="w-4 h-4 text-orange-400" />
                        <span>Franchise Partner Access Pack</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        ● READY TO BILL
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-[#1c1c1f] border border-[#2e2e30]">
                        <span className="text-[10px] text-zinc-500 block font-sans">Login Email ID</span>
                        <strong className="text-white block mt-0.5 select-all">{provisionedOutlet.loginEmail}</strong>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#1c1c1f] border border-[#2e2e30]">
                        <span className="text-[10px] text-zinc-500 block font-sans">Temporary Password</span>
                        <strong className="text-amber-400 block mt-0.5 select-all">{provisionedOutlet.loginPassword}</strong>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                      <Button
                        type="button"
                        onClick={copyWhatsAppPack}
                        className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold h-10 rounded-xl gap-1.5 shadow-md cursor-pointer"
                      >
                        {copiedPack ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                        <span>{copiedPack ? "Copied WhatsApp Pack!" : "Copy WhatsApp Invite Pack"}</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={copyMagicLink}
                        className="w-full sm:flex-1 bg-[#1f1f1f] border-[#303030] text-zinc-300 hover:text-white text-xs font-bold h-10 rounded-xl gap-1.5 cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedLink ? "Link Copied!" : "Copy Magic Direct Link"}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Link href="/admin/outlets">
                      <Button
                        variant="outline"
                        className="bg-[#1f1f1f] border-[#303030] text-zinc-300 hover:text-white text-xs font-bold h-11 px-5 rounded-xl cursor-pointer"
                      >
                        <span>View Outlets Matrix</span>
                      </Button>
                    </Link>

                    <Link href="/pos">
                      <Button
                        className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider h-11 px-6 rounded-xl shadow-lg shadow-orange-600/25 flex items-center gap-2 cursor-pointer"
                      >
                        <span>Open POS Billing Terminal</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Area: Live Interactive Badge Preview (Only when step < 4) */}
          {step < 4 && (
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-3xl bg-[#1a1a1c] border border-[#2e2e30] space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#2e2e30] pb-3">
                  <span className="text-[11px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live Access Pass Preview</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 bg-[#242427] px-2 py-0.5 rounded-md border border-[#333]">
                    {previewOutletCode}
                  </span>
                </div>

                {/* Simulated Store ID Card */}
                <div className="p-4 rounded-2xl bg-[#141416] border border-[#333336] space-y-3 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                        {previewOutletCode}
                      </span>
                      <h3 className="text-base font-black text-white mt-1.5">
                        {name.trim() || "Store Display Name"}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {area.trim() || "Area"}, {city}
                      </p>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center font-black text-xs">
                      <Flame className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#262629]">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-sans block">Partner</span>
                      <strong className="text-white text-xs truncate block">{ownerName.trim() || "Partner Name"}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-sans block">Target Sales</span>
                      <strong className="text-emerald-400 text-xs">₹{parseInt(targetSales || "0").toLocaleString("en-IN")}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-sans block">Royalty Agreement</span>
                      <strong className="text-amber-400 text-xs">{royaltyRate}%</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 font-sans block">Spits Mounted</span>
                      <strong className="text-white text-xs">{activeSpits} Roasters</strong>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-[#1c1c1f] border border-[#2e2e30] text-[11px] font-mono text-zinc-400 truncate">
                    Login: <span className="text-zinc-200">{loginEmail.trim() || suggestedEmail}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Instant POS register binding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Automated 6.5% monthly royalty ledger</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Central kitchen raw meat dispatch ready</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
