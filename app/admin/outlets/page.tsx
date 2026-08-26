"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Store,
  Plus,
  Search,
  Flame,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Clock,
  TrendingUp,
  MapPin,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Building,
  ArrowUpRight,
  UtensilsCrossed,
  Receipt,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Truck,
  DollarSign,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  Copy,
  Check,
  Send,
  Lock,
  Compass,
  Edit3,
  Trash2,
  Ban,
  Power,
  Settings,
} from "lucide-react";
import { useFranchise } from "@/lib/franchise-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { cn } from "@/components/ui/cn";

export default function OutletsPage() {
  const { outlets, addOutlet, updateOutlet, deleteOutlet, terminateOutlet, role, activeOutlet, setSelectedOutletId, shifts, royalties, complianceList, meatBatches, dispatchShipment } = useFranchise();
  const isSuperAdmin = role === "SUPER_ADMIN";

  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "onboarding">("all");
  const [sortBy, setSortBy] = useState<"sales" | "yield" | "wraps" | "name">("sales");

  // Modals & Drawers
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDossierOutlet, setSelectedDossierOutlet] = useState<typeof outlets[0] | null>(null);
  const [dossierTab, setDossierTab] = useState<"credentials" | "sales" | "yield" | "royalties" | "compliance" | "actions">("credentials");
  const [showDispatchSuccess, setShowDispatchSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPack, setCopiedPack] = useState(false);

  // Success Provisioning Modal
  const [createdOutletResult, setCreatedOutletResult] = useState<any | null>(null);

  // Edit Outlet State
  const [editingOutlet, setEditingOutlet] = useState<typeof outlets[0] | null>(null);
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("Mumbai");
  const [editArea, setEditArea] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editOwnerName, setEditOwnerName] = useState("");
  const [editOwnerPhone, setEditOwnerPhone] = useState("");
  const [editLoginPassword, setEditLoginPassword] = useState("");
  const [editTargetSales, setEditTargetSales] = useState("60000");
  const [editActiveSpits, setEditActiveSpits] = useState("2");
  const [editRoyaltyRate, setEditRoyaltyRate] = useState("6.5");
  const [editMarketingRate, setEditMarketingRate] = useState("2.0");
  const [editStatus, setEditStatus] = useState<"active" | "onboarding" | "suspended" | "terminated">("active");

  // Terminate & Delete Modals State
  const [terminatingOutlet, setTerminatingOutlet] = useState<typeof outlets[0] | null>(null);
  const [terminationReason, setTerminationReason] = useState("Franchise Agreement Renewal Period Ended");
  const [deletingOutlet, setDeletingOutlet] = useState<typeof outlets[0] | null>(null);

  const openEditModal = (outlet: typeof outlets[0]) => {
    setEditingOutlet(outlet);
    setEditName(outlet.name);
    setEditCity(outlet.city);
    setEditArea(outlet.area);
    setEditAddress(outlet.address || "");
    setEditOwnerName(outlet.ownerName);
    setEditOwnerPhone(outlet.ownerPhone);
    setEditLoginPassword(outlet.loginPassword || "");
    setEditTargetSales(String(outlet.dailyTargetSales || 60000));
    setEditActiveSpits(String(outlet.activeSpits || 2));
    setEditRoyaltyRate(String(outlet.royaltyRatePercent || 6.5));
    setEditMarketingRate(String(outlet.marketingFeePercent || 2.0));
    setEditStatus(outlet.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOutlet) return;

    updateOutlet(editingOutlet.id, {
      name: editName,
      city: editCity,
      area: editArea,
      address: editAddress,
      ownerName: editOwnerName,
      ownerPhone: editOwnerPhone,
      loginPassword: editLoginPassword,
      dailyTargetSales: parseFloat(editTargetSales) || 60000,
      activeSpits: parseInt(editActiveSpits) || 2,
      royaltyRatePercent: parseFloat(editRoyaltyRate) || 6.5,
      marketingFeePercent: parseFloat(editMarketingRate) || 2.0,
      status: editStatus,
    });

    if (selectedDossierOutlet?.id === editingOutlet.id) {
      setSelectedDossierOutlet((prev) => prev ? {
        ...prev,
        name: editName,
        city: editCity,
        area: editArea,
        address: editAddress,
        ownerName: editOwnerName,
        ownerPhone: editOwnerPhone,
        loginPassword: editLoginPassword,
        dailyTargetSales: parseFloat(editTargetSales) || 60000,
        activeSpits: parseInt(editActiveSpits) || 2,
        royaltyRatePercent: parseFloat(editRoyaltyRate) || 6.5,
        marketingFeePercent: parseFloat(editMarketingRate) || 2.0,
        status: editStatus,
      } : null);
    }

    setEditingOutlet(null);
  };

  const handleConfirmTerminate = () => {
    if (!terminatingOutlet) return;
    terminateOutlet(terminatingOutlet.id, terminationReason);
    if (selectedDossierOutlet?.id === terminatingOutlet.id) {
      setSelectedDossierOutlet((prev) => prev ? { ...prev, status: "terminated" } : null);
    }
    setTerminatingOutlet(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingOutlet) return;
    deleteOutlet(deletingOutlet.id);
    if (selectedDossierOutlet?.id === deletingOutlet.id) {
      setSelectedDossierOutlet(null);
    }
    setDeletingOutlet(null);
  };

  // Form states (5-Step Onboarding)
  const [name, setName] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [targetSales, setTargetSales] = useState("60000");
  const [targetWraps, setTargetWraps] = useState("380");
  const [activeSpits, setActiveSpits] = useState("2");
  
  // Franchisee KYC & Identity
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [panOrAadhaar, setPanOrAadhaar] = useState("");
  
  // Credentials (Set by Super Admin)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("KoylaPartner#2026");
  const [showPassword, setShowPassword] = useState(false);

  // Commercial Terms
  const [franchiseFeeAmount, setFranchiseFeeAmount] = useState("1500000");
  const [franchiseFeeStatus, setFranchiseFeeStatus] = useState<"paid" | "partial" | "pending">("paid");
  const [securityDepositAmount, setSecurityDepositAmount] = useState("500000");
  const [royaltyRate, setRoyaltyRate] = useState("6.5");
  const [marketingFundRate, setMarketingFundRate] = useState("2.0");
  const [territoryRadius, setTerritoryRadius] = useState("3.0");

  // Operations
  const [managerName, setManagerName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [fssaiNumber, setFssaiNumber] = useState("11526008000123");
  const [gstin, setGstin] = useState("27AABCZ8810A1Z2");

  // Auto-generate strong password helper
  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let pwd = "Koyla#";
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setLoginPassword(pwd);
  };

  // Filter & Sort Logic
  const filteredOutlets = outlets
    .filter((o) => {
      const matchesSearch =
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = cityFilter === "all" || o.city.toLowerCase() === cityFilter.toLowerCase();
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesCity && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "sales") return b.currentDaySales - a.currentDaySales;
      if (sortBy === "yield") return b.spitEfficiency - a.spitEfficiency;
      if (sortBy === "wraps") return b.currentDayWraps - a.currentDayWraps;
      return a.name.localeCompare(b.name);
    });

  const totalNetworkSales = outlets.reduce((sum, o) => sum + o.currentDaySales, 0);
  const totalNetworkWraps = outlets.reduce((sum, o) => sum + o.currentDayWraps, 0);
  const activeOutletsCount = outlets.filter((o) => o.status === "active").length;
  const totalSpitsCount = outlets.reduce((sum, o) => sum + o.activeSpits, 0);

  const handleCreateOutlet = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim() || `partner.${name.toLowerCase().replace(/[^a-z0-9]+/g, "")}@iranikoyla.com`;
    const cleanPass = loginPassword.trim() || "password123";

    const payload = {
      name,
      city,
      area,
      address,
      status: "active" as const,
      dailyTargetSales: parseFloat(targetSales) || 50000,
      dailyTargetWraps: parseInt(targetWraps) || 300,
      activeSpits: parseInt(activeSpits) || 2,
      totalSpits: parseInt(activeSpits) || 2,
      ownerName,
      ownerEmail: ownerEmail.trim() || cleanEmail,
      ownerPhone,
      whatsappNumber: whatsappNumber.trim() || ownerPhone,
      panOrAadhaar,
      loginEmail: cleanEmail,
      loginPassword: cleanPass,
      franchiseFeeAmount: parseFloat(franchiseFeeAmount) || 1500000,
      franchiseFeeStatus,
      securityDepositAmount: parseFloat(securityDepositAmount) || 500000,
      royaltyRatePercent: parseFloat(royaltyRate) || 6.5,
      marketingFeePercent: parseFloat(marketingFundRate) || 2.0,
      territoryRadiusKm: parseFloat(territoryRadius) || 3.0,
      agreementTermYears: 5,
      managerName: managerName.trim() || "Store Manager",
      managerPhone: managerPhone.trim() || ownerPhone,
      fssaiNumber,
      fssaiExpiry: "2028-06-30",
      lastAuditScore: 95,
      gstin,
      openedAt: new Date().toISOString().split("T")[0],
    };

    addOutlet(payload);
    setShowAddModal(false);

    const magicUrl = typeof window !== "undefined"
      ? `${window.location.origin}/login?direct_login=true&email=${encodeURIComponent(cleanEmail)}&outlet=${encodeURIComponent(name)}`
      : `/login?direct_login=true&email=${encodeURIComponent(cleanEmail)}`;

    setCreatedOutletResult({
      ...payload,
      magicUrl,
    });

    // Reset Form
    setName("");
    setArea("");
    setAddress("");
    setOwnerName("");
    setOwnerEmail("");
    setOwnerPhone("");
    setLoginEmail("");
  };

  const getMagicLinkForOutlet = (outlet: typeof outlets[0]) => {
    const email = outlet.loginEmail || outlet.ownerEmail;
    if (typeof window !== "undefined") {
      return `${window.location.origin}/login?direct_login=true&email=${encodeURIComponent(email)}&outlet=${encodeURIComponent(outlet.code)}`;
    }
    return `/login?direct_login=true&email=${encodeURIComponent(email)}&outlet=${encodeURIComponent(outlet.code)}`;
  };

  const copyMagicLink = (outlet: typeof outlets[0]) => {
    const link = getMagicLinkForOutlet(outlet);
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const copyWhatsAppPack = (outlet: typeof outlets[0]) => {
    const magicLink = getMagicLinkForOutlet(outlet);
    const email = outlet.loginEmail || outlet.ownerEmail;
    const pwd = outlet.loginPassword || "password123";

    const text = `🔥 *IRANI KOYLA SHAWARMA — FRANCHISE PORTAL CREDENTIALS* 🔥

Dear ${outlet.ownerName},
Welcome to the Irani Koyla Shawarma Franchise Family! Your store terminal and management dashboard are ready.

📍 *Store Branch:* ${outlet.name} (${outlet.code})
🏙️ *Territory:* ${outlet.area}, ${outlet.city}
🛡️ *Exclusivity Zone:* ${outlet.territoryRadiusKm || 3.0} km Non-Compete

━━━━━━━━━━━━━━━━━━━━━━━━
🔐 *LOGIN CREDENTIALS*
━━━━━━━━━━━━━━━━━━━━━━━━
🌐 *Direct 1-Click Login Link:*
${magicLink}

📧 *Portal Email:* ${email}
🔑 *Password:* ${pwd}

📱 *Access Instructions:*
1. Click the 1-Click Login Link above.
2. Select *Counter POS Terminal* for live billing & order punching.
3. Select *Store Management* to view sales, spit yield, and FSSAI audits.

For central commissary refills or support, contact HQ Operations.
*Irani Koyla Shawarma Brand HQ*`;

    navigator.clipboard.writeText(text);
    setCopiedPack(true);
    setTimeout(() => setCopiedPack(false), 3000);
  };

  const handleQuickDispatchCone = (targetOutlet: typeof outlets[0]) => {
    dispatchShipment({
      shipmentNumber: `IK-DISP-${Date.now().toString().slice(-6)}`,
      outletId: targetOutlet.id,
      outletName: targetOutlet.name,
      dispatchedAt: "Just now, Express",
      status: "in_transit",
      chickenConesCount: 2,
      muttonConesCount: 1,
      totalMeatWeightKg: 78.0,
      spiceMixBagsCount: 3,
      toumJarsCount: 6,
      vanVehicleNumber: "MH 02 EE 4092 (Reefer)",
      driverName: "Sultan Sheikh (Express)",
      driverPhone: "+91 98205 11984",
      temperatureCelsius: 2.8,
      securitySealNumber: `SEAL-K-${Math.floor(10000 + Math.random() * 90000)}`,
    });
    setShowDispatchSuccess(true);
    setTimeout(() => setShowDispatchSuccess(false), 4000);
  };

  // Target Outlet data for Dossier with bulletproof safe defaults
  const dossierShift = shifts.find((s) => s.outletId === selectedDossierOutlet?.id) || {
    id: "shift-fallback",
    outletId: selectedDossierOutlet?.id || "outlet-1",
    date: new Date().toISOString().split("T")[0],
    shiftType: "EVENING" as const,
    managerName: selectedDossierOutlet?.managerName || "Store Manager",
    cashierName: "Cashier 1",
    openingCash: 2000,
    cashInDrawerActual: selectedDossierOutlet?.currentDaySales ? Math.round(selectedDossierOutlet.currentDaySales * 0.45) : 0,
    cashInDrawerCalculated: selectedDossierOutlet?.currentDaySales ? Math.round(selectedDossierOutlet.currentDaySales * 0.45) : 0,
    cashDifference: 0,
    upiSales: selectedDossierOutlet?.currentDaySales ? Math.round(selectedDossierOutlet.currentDaySales * 0.40) : 0,
    posCardSales: selectedDossierOutlet?.currentDaySales ? Math.round(selectedDossierOutlet.currentDaySales * 0.15) : 0,
    zomatoSales: 0,
    swiggySales: 0,
    totalGrossSales: selectedDossierOutlet?.currentDaySales || 0,
    totalDiscounts: 0,
    totalNetSales: selectedDossierOutlet?.currentDaySales || 0,
    totalOrders: Math.round((selectedDossierOutlet?.currentDaySales || 0) / 160),
    totalWrapsSold: selectedDossierOutlet?.currentDayWraps || 0,
    meatUsedKg: selectedDossierOutlet?.currentDayWraps ? Number((selectedDossierOutlet.currentDayWraps * 0.11).toFixed(1)) : 0,
    status: "OPEN" as const,
    auditNotes: "Live shift counter stream",
  };

  const dossierRoyalty = royalties.find((r) => r.outletId === selectedDossierOutlet?.id) || {
    id: "royalty-fallback",
    outletId: selectedDossierOutlet?.id || "outlet-1",
    periodMonth: new Date().toISOString().slice(0, 7),
    grossSales: selectedDossierOutlet?.currentDaySales || 0,
    royaltyRatePercent: selectedDossierOutlet?.royaltyRatePercent || 6.5,
    royaltyAmount: Math.round((selectedDossierOutlet?.currentDaySales || 0) * ((selectedDossierOutlet?.royaltyRatePercent || 6.5) / 100)),
    marketingFeeAmount: Math.round((selectedDossierOutlet?.currentDaySales || 0) * ((selectedDossierOutlet?.marketingFeePercent || 2.0) / 100)),
    softwareFeeAmount: 5000,
    totalPayable: Math.round((selectedDossierOutlet?.currentDaySales || 0) * 0.085) + 5000,
    status: "pending" as const,
    generatedDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0],
  };

  const dossierCompliance = complianceList.find((c) => c.outletId === selectedDossierOutlet?.id) || {
    id: "compliance-fallback",
    outletId: selectedDossierOutlet?.id || "outlet-1",
    date: new Date().toISOString().split("T")[0],
    auditType: "MORNING" as const,
    inspectedBy: "Brand Quality Lead",
    overallScore: selectedDossierOutlet?.lastAuditScore || 96,
    deepFreezerTemp: -19.5,
    chillerTemp: 3.2,
    spitCoreTemp: 78.4,
    oilPolarCompoundPercent: 14.5,
    hairnetsWorn: true,
    glovesUsed: true,
    fssaiDisplayValid: true,
    remarks: "Standard commissary operating guidelines active.",
    passed: true,
  };

  const dossierBatches = meatBatches.filter((b) => b.outletId === selectedDossierOutlet?.id);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showDispatchSuccess && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-bold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span>Cold-Chain Shipment Dispatched</span>
            <span className="text-[10px] text-emerald-300/70 block">
              2x Chicken + 1x Mutton Cones dispatched to {selectedDossierOutlet?.name}.
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-1.5">
          <p className="text-[11px] font-black text-orange-500 uppercase tracking-widest leading-none flex items-center gap-2">
            <Store className="w-3.5 h-3.5" />
            <span>{isSuperAdmin ? "Brand HQ Franchise Network" : "Store Profile"}</span>
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-0.5">
            {isSuperAdmin ? "Franchise Hubs & Provisioning Center" : activeOutlet?.name || "Bandra West (Flagship)"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl pt-1">
            {isSuperAdmin
              ? "Onboard new partners, provision custom credentials, manage magic login links, and audit live sales across all franchise hubs."
              : `Branch Code: ${activeOutlet?.code || "IK-MUM-01"} · ${activeOutlet?.address}`}
          </p>
        </div>

        {isSuperAdmin && (
          <div className="flex items-center gap-2">
            <Link href="/admin/outlets/new">
              <Button
                className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-xl gap-2 shadow-lg shadow-orange-600/25 cursor-pointer h-11 px-5"
              >
                <Plus className="w-4 h-4" />
                <span>Onboard New Franchise Partner</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Network Overview Summary Cards (Super Admin) */}
      {isSuperAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Card className="border-[#303030] bg-[#1f1f1f]">
            <CardContent className="p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#b8b8c5]/70 uppercase tracking-wider block">Network Hubs</span>
                <p className="text-xl font-black text-white font-mono mt-0.5">{outlets.length} Branches</p>
                <span className="text-[10px] text-emerald-400 font-semibold block">{activeOutletsCount} Live & Billing · 1 Launching</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#303030] bg-[#1f1f1f]">
            <CardContent className="p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#b8b8c5]/70 uppercase tracking-wider block">Network Today Sales</span>
                <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">₹{totalNetworkSales.toLocaleString("en-IN")}</p>
                <span className="text-[10px] text-[#b8b8c5]/60 block">{totalNetworkWraps.toLocaleString()} Wraps Carved Today</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#303030] bg-[#1f1f1f]">
            <CardContent className="p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#b8b8c5]/70 uppercase tracking-wider block">Active Spit Roasters</span>
                <p className="text-xl font-black text-white font-mono mt-0.5">{totalSpitsCount} Live Spits</p>
                <span className="text-[10px] text-amber-400 font-semibold block">93.0% Avg Carving Yield</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#303030] bg-[#1f1f1f]">
            <CardContent className="p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Receipt className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#b8b8c5]/70 uppercase tracking-wider block">Monthly System Royalty</span>
                <p className="text-xl font-black text-blue-400 font-mono mt-0.5">₹5.20 Lakhs</p>
                <span className="text-[10px] text-zinc-400 block">6.5% Gross + 2.0% Marketing</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search, Filter & Sort Controls */}
      <div className="p-4 rounded-2xl bg-[#1f1f1f] border border-[#303030] flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search branch name, code, owner, area…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* City Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {["all", "Mumbai", "Thane", "Pune"].map((c) => (
              <button
                key={c}
                onClick={() => setCityFilter(c)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                  cityFilter === c
                    ? "bg-orange-600 text-white shadow-sm"
                    : "bg-[#161618] text-zinc-400 border border-[#303030] hover:text-white hover:border-orange-500/40"
                )}
              >
                {c === "all" ? "All Cities" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider hidden sm:inline">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs font-bold text-zinc-300 focus:outline-none focus:border-orange-500"
          >
            <option value="sales">Today's Sales (High to Low)</option>
            <option value="wraps">Wraps Sold (High to Low)</option>
            <option value="yield">Spit Meat Yield %</option>
            <option value="name">Outlet Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Franchise Outlets Matrix Grid (Bigger, Higher Visibility Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {filteredOutlets.map((outlet) => {
          const targetPercent = Math.min(100, Math.round((outlet.currentDaySales / outlet.dailyTargetSales) * 100)) || 0;
          const isFlaggedYield = outlet.status === "active" && outlet.spitEfficiency < 90;

          return (
            <div
              key={outlet.id}
              className={cn(
                "group rounded-3xl bg-[#1f1f1f] border p-5 sm:p-6 space-y-4 hover:border-orange-500 transition-all duration-300 shadow-xl hover:shadow-orange-500/10 relative flex flex-col justify-between",
                isFlaggedYield ? "border-amber-500/50" : "border-[#303030]"
              )}
            >
              {/* Top Header & Status Badges */}
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0 shadow-inner">
                      <Store className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2.5 py-0.5 rounded-lg">
                          {outlet.code}
                        </span>
                        <span className={cn(
                          "text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg border flex items-center gap-1",
                          outlet.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            outlet.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                          )} />
                          <span>{outlet.status === "active" ? "Live & Billing" : "Pre-Launch"}</span>
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-orange-400 transition-colors mt-1 truncate">
                        {outlet.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDossierTab("credentials");
                      setSelectedDossierOutlet(outlet);
                    }}
                    className="w-9 h-9 rounded-xl bg-[#161618] border border-[#303030] hover:bg-orange-600 hover:text-white text-zinc-400 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                    title="Open 360° Operations Dossier"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-zinc-400 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>{outlet.area}, {outlet.city} &middot; <strong className="text-zinc-300 font-normal">{outlet.territoryRadiusKm || 3.0} km Radius</strong></span>
                </p>

                {/* Franchisee Partner & Direct Login Chip */}
                <div className="p-3 rounded-2xl bg-[#161618] border border-[#303030] text-xs space-y-1.5 shadow-inner">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Franchisee Owner:</span>
                    <span className="font-black text-white">{outlet.ownerName}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400 text-xs">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Login ID:</span>
                    <span className="font-mono text-orange-400 font-bold truncate max-w-[170px]">{outlet.loginEmail || outlet.ownerEmail}</span>
                  </div>
                </div>

                {/* Big Live Sales & Target Progress */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#161618] to-[#1a1a1c] border border-[#303030] space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Today's Live Gross Sales</span>
                      <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-tight">
                        ₹{outlet.currentDaySales.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Daily Goal (₹{(outlet.dailyTargetSales / 1000).toFixed(0)}k)</span>
                      <span className="text-sm font-black text-white font-mono">{targetPercent}%</span>
                    </div>
                  </div>
                  <Progress value={targetPercent} className="h-2 bg-[#1f1f1f]" />
                </div>

                {/* 3 High-Visibility Operational KPIs */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2.5 rounded-2xl bg-[#161618] border border-[#303030] shadow-sm">
                    <span className="text-[9px] text-zinc-500 block uppercase font-sans font-bold">Wraps Sold</span>
                    <span className="text-sm sm:text-base font-black text-white">{outlet.currentDayWraps}</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-[#161618] border border-[#303030] shadow-sm">
                    <span className="text-[9px] text-zinc-500 block uppercase font-sans font-bold">Meat Yield</span>
                    <span className={cn(
                      "text-sm sm:text-base font-black",
                      outlet.spitEfficiency >= 93 ? "text-emerald-400" : "text-amber-400"
                    )}>
                      {outlet.spitEfficiency}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-[#161618] border border-[#303030] shadow-sm">
                    <span className="text-[9px] text-zinc-500 block uppercase font-sans font-bold">Live Spits</span>
                    <span className="text-sm sm:text-base font-black text-orange-400">{outlet.activeSpits}/{outlet.totalSpits}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="pt-3 border-t border-[#303030] flex items-center gap-2">
                <Link
                  href="/pos"
                  onClick={() => setSelectedOutletId(outlet.id)}
                  className="flex-1"
                >
                  <Button
                    type="button"
                    className="w-full h-10 bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-xl gap-1.5 shadow-md shadow-orange-600/20 cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Open POS</span>
                  </Button>
                </Link>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDossierTab("credentials");
                    setSelectedDossierOutlet(outlet);
                  }}
                  className="h-10 px-3 rounded-xl border-[#383838] bg-[#161618] text-xs font-bold text-zinc-300 hover:text-white hover:border-orange-500 cursor-pointer"
                  title="View Credentials, KYC & Royalty Dossier"
                >
                  <Key className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden sm:inline">Dossier</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openEditModal(outlet)}
                  className="h-10 px-3 rounded-xl border-[#383838] bg-[#161618] text-xs font-bold text-zinc-300 hover:text-white hover:border-orange-500 cursor-pointer"
                  title="Edit Franchise Profile"
                >
                  <Edit3 className="w-3.5 h-3.5 text-zinc-300" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeletingOutlet(outlet)}
                  className="h-10 px-3 rounded-xl border-[#383838] bg-[#161618] text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500 cursor-pointer"
                  title="Delete Franchise Outlet Record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => copyWhatsAppPack(outlet)}
                  className="h-10 px-3 rounded-xl border-[#383838] bg-[#161618] text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 cursor-pointer"
                  title="Copy WhatsApp Access Pack"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          );
        })}

        {filteredOutlets.length === 0 && (
          <div className="col-span-full py-16 px-6 rounded-3xl bg-[#1f1f1f] border border-dashed border-[#303030] flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner">
              <Store className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="text-xl font-black text-white">No Franchise Outlets Registered</h3>
              <p className="text-xs text-zinc-400">
                You are logged in as Super Admin. Click the button below to onboard your first franchise partner, configure split rates, and issue credentials.
              </p>
            </div>
            {isSuperAdmin && (
              <Link href="/admin/outlets/new">
                <Button
                  className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider rounded-xl gap-2 shadow-lg shadow-orange-600/25 h-11 px-6 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Onboard First Franchise Hub</span>
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ── FRANCHISE 360° OPERATIONS DOSSIER MODAL ──────────────────────── */}
      {selectedDossierOutlet && (
        <Dialog open={true} onOpenChange={() => setSelectedDossierOutlet(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1f1f1f] border border-[#303030] text-white p-6 rounded-3xl">
            <DialogHeader className="border-b border-[#303030] pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-lg">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-md">
                        {selectedDossierOutlet.code}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        {selectedDossierOutlet.status.toUpperCase()}
                      </span>
                    </div>
                    <DialogTitle className="text-xl font-black text-white mt-1">
                      {selectedDossierOutlet.name}
                    </DialogTitle>
                    <p className="text-xs text-zinc-400">
                      {selectedDossierOutlet.address} &middot; Opened {selectedDossierOutlet.openedAt}
                    </p>
                  </div>
                </div>

                {/* Top Quick Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => copyWhatsAppPack(selectedDossierOutlet)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl gap-1.5"
                  >
                    {copiedPack ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{copiedPack ? "Copied Pack!" : "Copy WhatsApp Pack"}</span>
                  </Button>
                </div>
              </div>

              {/* Dossier Tabs Bar */}
              <div className="flex items-center gap-2 pt-4 overflow-x-auto">
                {[
                  { id: "credentials", label: "Login & Magic Link", icon: Key },
                  { id: "sales", label: "Live Sales & Orders", icon: Receipt },
                  { id: "yield", label: "Spit Yield & Meat", icon: Flame },
                  { id: "royalties", label: "Contract & Royalties", icon: DollarSign },
                  { id: "compliance", label: "FSSAI & Hygiene", icon: ShieldCheck },
                  { id: "actions", label: "HQ Terminal Control", icon: Layers },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDossierTab(tab.id as any)}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer",
                      dossierTab === tab.id
                        ? "bg-orange-600 text-white shadow-sm"
                        : "bg-[#161618] text-zinc-400 border border-[#303030] hover:text-white hover:border-orange-500/40"
                    )}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </DialogHeader>

            {/* TAB 0: LOGIN & MAGIC LINK (SUPER ADMIN PROVISIONING VIEW) */}
            {dossierTab === "credentials" && (
              <div className="space-y-4 mt-4">
                <div className="p-5 rounded-2xl bg-[#161618] border border-orange-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#303030] pb-3">
                    <div>
                      <span className="text-xs font-black text-white flex items-center gap-2">
                        <Key className="w-4 h-4 text-orange-500" />
                        <span>Franchise Partner Portal & POS Credentials</span>
                      </span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        These credentials give the franchise owner direct access to their POS register and Store Dashboard.
                      </span>
                    </div>

                    <a
                      href={getMagicLinkForOutlet(selectedDossierOutlet)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Direct 1-Click Login</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Login Email */}
                    <div className="p-3 rounded-xl bg-[#1f1f1f] border border-[#303030] space-y-1">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase block">Portal Login Email</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-white truncate">
                          {selectedDossierOutlet.loginEmail || selectedDossierOutlet.ownerEmail}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedDossierOutlet.loginEmail || selectedDossierOutlet.ownerEmail);
                            alert("Copied Login Email!");
                          }}
                          className="text-zinc-400 hover:text-white p-1"
                          title="Copy Email"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Login Password */}
                    <div className="p-3 rounded-xl bg-[#1f1f1f] border border-[#303030] space-y-1">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase block">Portal Login Password</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-emerald-400">
                          {selectedDossierOutlet.loginPassword || "password123"}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedDossierOutlet.loginPassword || "password123");
                            alert("Copied Password!");
                          }}
                          className="text-zinc-400 hover:text-white p-1"
                          title="Copy Password"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Direct Magic URL Box */}
                  <div className="p-3.5 rounded-xl bg-[#1f1f1f] border border-[#303030] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-orange-400 font-bold uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Direct 1-Click Magic Login URL</span>
                      </span>
                      <button
                        onClick={() => copyMagicLink(selectedDossierOutlet)}
                        className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
                      </button>
                    </div>
                    <div className="p-2 rounded-lg bg-[#161618] border border-[#303030] font-mono text-[11px] text-zinc-300 truncate select-all">
                      {getMagicLinkForOutlet(selectedDossierOutlet)}
                    </div>
                    <span className="text-[10px] text-zinc-500 block">
                      When the franchisee opens this link on their mobile or counter POS tablet, it automatically authenticates and routes directly into their store dashboard.
                    </span>
                  </div>

                  {/* WhatsApp Welcome Package Action */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-300 block">Send WhatsApp Onboarding Package</span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        Copies a pre-formatted WhatsApp message ready to send to {selectedDossierOutlet.ownerName} ({selectedDossierOutlet.ownerPhone}).
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => copyWhatsAppPack(selectedDossierOutlet)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl gap-1.5 shrink-0"
                    >
                      {copiedPack ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                      <span>{copiedPack ? "Pack Copied to Clipboard!" : "Copy WhatsApp Pack"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: LIVE SALES & ORDERS */}
            {dossierTab === "sales" && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Today's Sales</span>
                    <span className="text-xl font-black font-mono text-emerald-400 mt-1 block">
                      ₹{selectedDossierOutlet.currentDaySales.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-zinc-400">Target: ₹{selectedDossierOutlet.dailyTargetSales.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Total Orders</span>
                    <span className="text-xl font-black font-mono text-white mt-1 block">
                      {dossierShift.totalOrders} Orders
                    </span>
                    <span className="text-[10px] text-zinc-400">AOV: ₹{Math.round(selectedDossierOutlet.currentDaySales / (dossierShift.totalOrders || 1))}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Cash in Drawer</span>
                    <span className="text-xl font-black font-mono text-emerald-400 mt-1 block">
                      ₹{dossierShift.cashInDrawerActual.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-zinc-400">Opening: ₹{dossierShift.openingCash}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">UPI / Online</span>
                    <span className="text-xl font-black font-mono text-blue-400 mt-1 block">
                      ₹{dossierShift.upiSales.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-zinc-400">POS Card: ₹{dossierShift.posCardSales}</span>
                  </div>
                </div>

                {/* Sales Channels Breakdown */}
                <div className="p-4 rounded-2xl bg-[#161618] border border-[#303030] space-y-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">Sales Channels Breakdown</span>
                  <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-[#1f1f1f] border border-[#303030]">
                      <span className="text-[10px] text-orange-400 block font-bold">Walk-in Counter (60%)</span>
                      <span className="text-base font-black text-white mt-1 block">
                        ₹{(selectedDossierOutlet.currentDaySales * 0.6).toFixed(0)}
                      </span>
                      <span className="text-[10px] text-zinc-500">Fast Register</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1f1f1f] border border-[#303030]">
                      <span className="text-[10px] text-rose-400 block font-bold">Zomato Online (25%)</span>
                      <span className="text-base font-black text-white mt-1 block">
                        ₹{dossierShift.zomatoSales.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-zinc-500">Direct KOT</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#1f1f1f] border border-[#303030]">
                      <span className="text-[10px] text-amber-400 block font-bold">Swiggy Delivery (15%)</span>
                      <span className="text-base font-black text-white mt-1 block">
                        ₹{dossierShift.swiggySales.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-zinc-500">Direct KOT</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SPIT YIELD & MEAT BATCHES */}
            {dossierTab === "yield" && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Spit Efficiency</span>
                    <span className="text-xl font-black font-mono text-emerald-400 mt-1 block">
                      {selectedDossierOutlet.spitEfficiency}%
                    </span>
                    <span className="text-[10px] text-zinc-400">Target Standard: &gt; 92.0%</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Wraps Produced</span>
                    <span className="text-xl font-black font-mono text-white mt-1 block">
                      {selectedDossierOutlet.currentDayWraps} Wraps
                    </span>
                    <span className="text-[10px] text-zinc-400">110g portion avg</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Active Spit Units</span>
                    <span className="text-xl font-black font-mono text-orange-400 mt-1 block">
                      {selectedDossierOutlet.activeSpits} Roasting
                    </span>
                    <span className="text-[10px] text-zinc-400">Capacity: {selectedDossierOutlet.totalSpits} Roasters</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">Active Meat Spit Batches</span>
                  {dossierBatches.length > 0 ? (
                    dossierBatches.map((batch) => (
                      <div key={batch.id} className="p-3 rounded-2xl bg-[#161618] border border-[#303030] flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="font-bold text-white block">{batch.meatType} ({batch.batchNumber})</span>
                          <span className="text-[10px] text-zinc-400 font-sans">{batch.spitId} &middot; Loaded {batch.timeLoaded} &middot; Core Temp: {batch.coreTempCelsius}°C</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-emerald-400 block">{batch.actualYieldPercent}% Yield</span>
                          <span className="text-[10px] text-zinc-400">{batch.cookedWeightKg}kg Carved / {batch.rawMeatReceivedKg}kg Raw</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-zinc-500 bg-[#161618] rounded-2xl border border-[#303030]">
                      No custom batch overrides recorded for this outlet today. Operating on standard commissary schedule.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: CONTRACT & ROYALTIES */}
            {dossierTab === "royalties" && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block font-sans">Franchise Fee</span>
                    <span className="text-lg font-black text-emerald-400 mt-1 block">₹{((selectedDossierOutlet.franchiseFeeAmount || 1500000) / 100000).toFixed(1)} Lakhs</span>
                    <span className="text-[10px] text-emerald-400 font-bold font-sans">✓ {selectedDossierOutlet.franchiseFeeStatus?.toUpperCase() || "PAID"}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block font-sans">Security Deposit</span>
                    <span className="text-lg font-black text-white mt-1 block">₹{((selectedDossierOutlet.securityDepositAmount || 500000) / 100000).toFixed(1)} Lakhs</span>
                    <span className="text-[10px] text-zinc-400 font-sans">Held in Escrow</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block font-sans">Royalty Rate</span>
                    <span className="text-lg font-black text-orange-400 mt-1 block">{selectedDossierOutlet.royaltyRatePercent || 6.5}% Net</span>
                    <span className="text-[10px] text-zinc-400 font-sans">+ {selectedDossierOutlet.marketingFeePercent || 2.0}% Marketing</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block font-sans">July 2026 Royalty</span>
                    <span className="text-lg font-black text-blue-400 mt-1 block">
                      ₹{dossierRoyalty ? Math.round(dossierRoyalty.totalPayable).toLocaleString("en-IN") : "1,45,000"}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-sans">Status: {dossierRoyalty?.status.toUpperCase() || "PENDING"}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#161618] border border-[#303030] text-xs space-y-2">
                  <span className="font-bold text-white uppercase text-[10px] tracking-wider block">Contract Legal Information</span>
                  <div className="grid grid-cols-2 gap-3 text-zinc-300">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Territory Exclusivity Radius:</span>
                      <strong className="text-white">{selectedDossierOutlet.territoryRadiusKm || 3.0} km Non-Compete Exclusivity Zone</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">Agreement Term:</span>
                      <strong className="text-white">{selectedDossierOutlet.agreementTermYears || 5}-Year Renewable (Lock-in: 3 Years)</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">GSTIN Number:</span>
                      <strong className="font-mono text-orange-400">{selectedDossierOutlet.gstin}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">FSSAI License:</span>
                      <strong className="font-mono text-emerald-400">{selectedDossierOutlet.fssaiNumber} (Exp: {selectedDossierOutlet.fssaiExpiry})</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: FSSAI & HYGIENE COMPLIANCE */}
            {dossierTab === "compliance" && (
              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-2xl bg-[#161618] border border-[#303030] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-lg">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">FSSAI Hygiene Score: {dossierCompliance.overallScore}/100</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Grade A - Full Certification Active</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">Inspected by {dossierCompliance.inspectedBy}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 block font-sans font-bold">Deep Freezer Temp</span>
                    <span className="text-base font-black text-blue-400 mt-1 block">{dossierCompliance.deepFreezerTemp}°C</span>
                    <span className="text-[9px] text-zinc-400">Target &le; -18°C</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 block font-sans font-bold">Chiller Walk-in</span>
                    <span className="text-base font-black text-emerald-400 mt-1 block">{dossierCompliance.chillerTemp}°C</span>
                    <span className="text-[9px] text-zinc-400">Target 2°C - 4°C</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 block font-sans font-bold">Spit Core Temp</span>
                    <span className="text-base font-black text-orange-400 mt-1 block">{dossierCompliance.spitCoreTemp}°C</span>
                    <span className="text-[9px] text-zinc-400">Target &ge; 75°C</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#161618] border border-[#303030]">
                    <span className="text-[10px] text-zinc-500 block font-sans font-bold">Fryer Oil TPM %</span>
                    <span className="text-base font-black text-amber-400 mt-1 block">{dossierCompliance.oilPolarCompoundPercent}%</span>
                    <span className="text-[9px] text-zinc-400">Target &lt; 24%</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#161618] border border-[#303030] text-xs text-zinc-300">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Inspector Notes & Remarks</span>
                  <p>{dossierCompliance.remarks}</p>
                </div>
              </div>
            )}

            {/* TAB 5: HQ TERMINAL CONTROL ACTIONS */}
            {dossierTab === "actions" && (
              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-2xl bg-[#161618] border border-orange-500/30 space-y-3">
                  <span className="text-xs font-black text-orange-400 uppercase tracking-wider block">
                    Super Admin Console Actions
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      onClick={() => {
                        setSelectedOutletId(selectedDossierOutlet.id);
                        setSelectedDossierOutlet(null);
                      }}
                      className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs h-11 rounded-xl gap-2"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Impersonate / Filter Console to This Branch</span>
                    </Button>

                    <Button
                      onClick={() => openEditModal(selectedDossierOutlet)}
                      variant="outline"
                      className="w-full border-[#383838] bg-[#1a1a1c] text-white font-bold text-xs h-11 rounded-xl gap-2 hover:border-orange-500"
                    >
                      <Edit3 className="w-4 h-4 text-orange-400" />
                      <span>Edit Franchise Commercials & Info</span>
                    </Button>

                    <Button
                      onClick={() => setTerminatingOutlet(selectedDossierOutlet)}
                      variant="outline"
                      className="w-full border-amber-500/40 bg-amber-500/10 text-amber-300 font-bold text-xs h-11 rounded-xl gap-2 hover:bg-amber-500/20"
                    >
                      <Ban className="w-4 h-4" />
                      <span>Suspend / Terminate Franchise Agreement</span>
                    </Button>

                    <Button
                      onClick={() => setDeletingOutlet(selectedDossierOutlet)}
                      variant="outline"
                      className="w-full border-rose-500/40 bg-rose-500/10 text-rose-300 font-bold text-xs h-11 rounded-xl gap-2 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Permanently Delete Outlet Record</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* ── EDIT FRANCHISE OUTLET MODAL ──────────────────────────────────── */}
      {editingOutlet && (
        <Dialog open={true} onOpenChange={() => setEditingOutlet(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1c] border border-[#303030] text-white p-6 rounded-3xl">
            <DialogHeader className="border-b border-[#303030] pb-3">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-orange-500" />
                  <span>Edit Franchise Hub: {editingOutlet.name}</span>
                </DialogTitle>
                <span className="text-xs font-mono font-bold bg-[#242427] text-orange-400 px-2.5 py-1 rounded-lg border border-[#383838]">
                  {editingOutlet.code}
                </span>
              </div>
            </DialogHeader>

            <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Outlet Display Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white focus:border-orange-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white focus:border-orange-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Neighborhood / Area</label>
                  <input
                    type="text"
                    required
                    value={editArea}
                    onChange={(e) => setEditArea(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white focus:border-orange-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Agreement Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white focus:border-orange-500 font-semibold cursor-pointer"
                  >
                    <option value="active">Active & Live</option>
                    <option value="onboarding">Onboarding / Pre-Launch</option>
                    <option value="suspended">Suspended</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Franchise Partner Name</label>
                  <input
                    type="text"
                    required
                    value={editOwnerName}
                    onChange={(e) => setEditOwnerName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#303030] text-sm text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={editOwnerPhone}
                    onChange={(e) => setEditOwnerPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#303030] text-sm font-mono text-white focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Daily Sales Target (₹)</label>
                  <input
                    type="number"
                    value={editTargetSales}
                    onChange={(e) => setEditTargetSales(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#303030] text-sm font-mono font-bold text-emerald-400 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Active Spits</label>
                  <input
                    type="number"
                    value={editActiveSpits}
                    onChange={(e) => setEditActiveSpits(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#303030] text-sm font-mono font-bold text-orange-400 focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">Royalty Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editRoyaltyRate}
                    onChange={(e) => setEditRoyaltyRate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#303030] text-sm font-mono font-bold text-amber-400 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-300 block mb-1">Portal Login Password</label>
                <input
                  type="text"
                  value={editLoginPassword}
                  onChange={(e) => setEditLoginPassword(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#303030] text-sm font-mono text-amber-400 focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#303030]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingOutlet(null)}
                  className="bg-[#141416] border-[#303030] text-zinc-300 hover:text-white text-xs font-bold h-10 px-4 rounded-xl cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider h-10 px-5 rounded-xl cursor-pointer"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* ── TERMINATE AGREEMENT MODAL ─────────────────────────────────────── */}
      {terminatingOutlet && (
        <Dialog open={true} onOpenChange={() => setTerminatingOutlet(null)}>
          <DialogContent className="max-w-md bg-[#1a1a1c] border border-amber-500/40 text-white p-6 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Ban className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <DialogTitle className="text-lg font-black text-white">
                Terminate Franchise Agreement?
              </DialogTitle>
              <p className="text-xs text-zinc-400">
                You are terminating the brand franchise contract for <strong>{terminatingOutlet.name}</strong> ({terminatingOutlet.code}).
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block">Termination Reason / Audit Note</label>
              <input
                type="text"
                value={terminationReason}
                onChange={(e) => setTerminationReason(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#141416] border border-[#303030] text-xs text-white focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setTerminatingOutlet(null)}
                className="w-1/2 bg-[#141416] border-[#303030] text-zinc-300 text-xs font-bold h-10 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmTerminate}
                className="w-1/2 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider h-10 rounded-xl"
              >
                Confirm Terminate
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ── DELETE CONFIRMATION MODAL ─────────────────────────────────────── */}
      {deletingOutlet && (
        <Dialog open={true} onOpenChange={() => setDeletingOutlet(null)}>
          <DialogContent className="max-w-md bg-[#1a1a1c] border border-rose-500/40 text-white p-6 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <DialogTitle className="text-lg font-black text-white">
                Permanently Delete Franchise Outlet?
              </DialogTitle>
              <p className="text-xs text-zinc-400">
                Are you sure you want to permanently delete <strong>{deletingOutlet.name}</strong> ({deletingOutlet.code})? This will remove the branch from all registers.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingOutlet(null)}
                className="w-1/2 bg-[#141416] border-[#303030] text-zinc-300 text-xs font-bold h-10 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider h-10 rounded-xl"
              >
                Delete Outlet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ── ONBOARD NEW FRANCHISE MODAL (5-STAGE DOSSIER) ─────────────────── */}
      {showAddModal && (
        <Dialog open={true} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1f1f1f] border border-[#303030] text-white p-6 rounded-3xl">
            <DialogHeader className="border-b border-[#303030] pb-3">
              <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-orange-500" />
                <span>Onboard New Franchise Partner & Provision Access</span>
              </DialogTitle>
              <p className="text-xs text-zinc-400">
                Setup store territory, partner KYC, custom login credentials, and commercial franchise terms.
              </p>
            </DialogHeader>

            <form onSubmit={handleCreateOutlet} className="space-y-4 mt-3">
              {/* SECTION 1: STORE IDENTITY & TERRITORY */}
              <div className="space-y-3">
                <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>1. Store Identity & Territory Zone</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Franchise Branch Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white focus:outline-none focus:border-orange-500"
                      placeholder="e.g. Pune Koregaon Park"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">City *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white focus:outline-none focus:border-orange-500 font-semibold"
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Thane">Thane</option>
                      <option value="Navi Mumbai">Navi Mumbai</option>
                      <option value="Pune">Pune</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Locality / Area *</label>
                    <input
                      type="text"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white focus:outline-none focus:border-orange-500"
                      placeholder="e.g. North Main Road, Koregaon Park"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Exclusivity Radius (km)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={territoryRadius}
                      onChange={(e) => setTerritoryRadius(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white font-mono"
                      placeholder="3.0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">Full Store Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white focus:outline-none focus:border-orange-500"
                    placeholder="Shop No, Building Name, Landmark, Street, Pincode"
                  />
                </div>
              </div>

              {/* SECTION 2: FRANCHISEE KYC & CONTACT */}
              <div className="space-y-3 pt-3 border-t border-[#303030]">
                <span className="text-[11px] font-black text-blue-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>2. Franchisee Partner Profile & KYC</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Owner Full Name *</label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Dr. Rohan Kulkarni"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white focus:outline-none focus:border-blue-500"
                      placeholder="+91 98220 55198"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">PAN / Aadhaar KYC #</label>
                    <input
                      type="text"
                      value={panOrAadhaar}
                      onChange={(e) => setPanOrAadhaar(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white uppercase font-mono focus:outline-none focus:border-blue-500"
                      placeholder="ABCDE1234F / 9812..."
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: CREDENTIALS (SET BY SUPER ADMIN) */}
              <div className="p-4 rounded-2xl bg-[#161618] border border-orange-500/40 space-y-3">
                <span className="text-[11px] font-black text-orange-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  <span>3. Portal & POS Credentials (Set by Super Admin)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Portal Login Email *</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#1f1f1f] border border-[#303030] text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                      placeholder="partner.pune@iranikoyla.com"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-zinc-300">Login Password *</label>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        className="text-[10px] text-orange-400 font-bold hover:underline cursor-pointer"
                      >
                        Auto-Generate Strong
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full h-10 pl-3 pr-9 rounded-xl bg-[#1f1f1f] border border-[#303030] text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-orange-500"
                        placeholder="password123"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] text-zinc-500 block">
                  A direct 1-click magic login link and WhatsApp onboarding pack will automatically be generated for this franchisee.
                </span>
              </div>

              {/* SECTION 4: COMMERCIAL & LEGAL TERMS */}
              <div className="space-y-3 pt-3 border-t border-[#303030]">
                <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>4. Commercial Terms, Fees & Royalties</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Franchise Fee (₹)</label>
                    <input
                      type="number"
                      value={franchiseFeeAmount}
                      onChange={(e) => setFranchiseFeeAmount(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Fee Status</label>
                    <select
                      value={franchiseFeeStatus}
                      onChange={(e) => setFranchiseFeeStatus(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white"
                    >
                      <option value="paid">Paid in Full</option>
                      <option value="partial">50% Advance Paid</option>
                      <option value="pending">Payment Pending</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={securityDepositAmount}
                      onChange={(e) => setSecurityDepositAmount(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Royalty Rate (% Gross)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={royaltyRate}
                      onChange={(e) => setRoyaltyRate(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">Marketing Fund (% Gross)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={marketingFundRate}
                      onChange={(e) => setMarketingFundRate(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: HARDWARE & TARGETS */}
              <div className="space-y-3 pt-3 border-t border-[#303030]">
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>5. Hardware Capacity & Operations</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Daily Target Sales (₹)</label>
                    <input
                      type="number"
                      value={targetSales}
                      onChange={(e) => setTargetSales(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Daily Wraps Target</label>
                    <input
                      type="number"
                      value={targetWraps}
                      onChange={(e) => setTargetWraps(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Spit Roaster Units</label>
                    <select
                      value={activeSpits}
                      onChange={(e) => setActiveSpits(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white"
                    >
                      <option value="2">2 Spits (1 Chicken + 1 Mutton)</option>
                      <option value="3">3 Spits (2 Chicken + 1 Mutton)</option>
                      <option value="1">1 Spit (Express Format)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">FSSAI License #</label>
                    <input
                      type="text"
                      value={fssaiNumber}
                      onChange={(e) => setFssaiNumber(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">GSTIN Number</label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl bg-[#161618] border border-[#303030] text-xs text-white font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#303030]">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddModal(false)} className="border-[#303030] bg-[#161618] text-zinc-300">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-orange-600 hover:bg-orange-500 text-white font-black h-11 px-5 rounded-xl">
                  Provision Franchise Partner & Generate Magic Link
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* ── PROVISIONING SUCCESS & MAGIC LINK DISPLAY MODAL ────────────────── */}
      {createdOutletResult && (
        <Dialog open={true} onOpenChange={() => setCreatedOutletResult(null)}>
          <DialogContent className="max-w-lg bg-[#1f1f1f] border border-[#303030] text-white p-6 rounded-3xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">Franchise Provisioned Successfully</span>
              <h3 className="text-xl font-black text-white mt-1">{createdOutletResult.name}</h3>
              <p className="text-xs text-zinc-400">{createdOutletResult.area}, {createdOutletResult.city}</p>
            </div>

            {/* Generated Credentials Card */}
            <div className="p-4 rounded-2xl bg-[#161618] border border-[#303030] text-left space-y-2.5 text-xs font-mono">
              <div className="flex justify-between border-b border-[#303030] pb-2">
                <span className="text-zinc-500">Login Email:</span>
                <span className="font-bold text-white">{createdOutletResult.loginEmail}</span>
              </div>
              <div className="flex justify-between border-b border-[#303030] pb-2">
                <span className="text-zinc-500">Password:</span>
                <span className="font-bold text-emerald-400">{createdOutletResult.loginPassword}</span>
              </div>
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-orange-400 font-bold uppercase block font-sans">Direct Magic Login Link</span>
                <div className="p-2 rounded-xl bg-[#1f1f1f] border border-[#303030] text-[11px] text-zinc-300 truncate select-all">
                  {createdOutletResult.magicUrl}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(createdOutletResult.magicUrl);
                  alert("Magic Login Link Copied!");
                }}
                variant="outline"
                className="flex-1 border-[#303030] bg-[#161618] text-white font-bold h-11 rounded-xl gap-1.5"
              >
                <Copy className="w-4 h-4 text-orange-400" />
                <span>Copy Magic Link</span>
              </Button>

              <Button
                onClick={() => setCreatedOutletResult(null)}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold h-11 rounded-xl"
              >
                Done & View Outlets
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
