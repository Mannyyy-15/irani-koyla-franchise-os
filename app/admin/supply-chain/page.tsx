"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Truck,
  Flame,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Thermometer,
  ShieldCheck,
  PackageCheck,
  MapPin,
  Building,
  Store,
  ArrowUpRight,
  AlertCircle,
  Layers,
  Sparkles,
  ShoppingBag,
  ShoppingCart,
  Check,
  X,
  Send,
  Calendar,
  AlertTriangle,
  FileText,
  BadgeAlert,
  ArrowRight,
  Filter,
  Eye,
  KeyRound,
  RotateCcw,
  Boxes,
} from "lucide-react";
import { useFranchise } from "@/lib/franchise-context";
import { SUPPLY_CATALOG, SupplyCatalogItem, SupplyOrder } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { cn } from "@/components/ui/cn";

type CatalogCategory = "All" | "Raw Marinated Meat Cones" | "Spices & Marinades" | "Sauces & Dips" | "Breads & Khubz" | "Packaging & Disposables";

export default function SupplyChainPage() {
  const {
    role,
    outlets,
    activeOutlet,
    selectedOutletId,
    shipments,
    supplyOrders,
    placeSupplyOrder,
    approveSupplyOrder,
    declineSupplyOrder,
    dispatchSupplyOrder,
    markSupplyOrderDelivered,
    dispatchShipment,
  } = useFranchise();

  const isSuperAdmin = role === "SUPER_ADMIN";

  // Franchise Partner active outlet or chosen target
  const currentOutlet = activeOutlet || outlets.find((o) => o.id === selectedOutletId) || outlets[0];

  // Franchise View Tabs: Catalog / Order History
  const [partnerViewTab, setPartnerViewTab] = useState<"catalog" | "my_orders">("catalog");
  // Super Admin View Tabs: Requisitions / Live Fleet & Cold Chain
  const [adminViewTab, setAdminViewTab] = useState<"requisitions" | "fleet">("requisitions");

  // Requisition Status Filters
  const [adminStatusFilter, setAdminStatusFilter] = useState<"all" | "pending" | "approved" | "dispatched" | "delivered" | "declined">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Catalog Filter
  const [selectedCategory, setSelectedCategory] = useState<CatalogCategory>("All");
  const [catalogSearch, setCatalogSearch] = useState("");

  // Cart for ordering: Record<itemId, quantity>
  const [cart, setCart] = useState<Record<string, number>>({});
  const [urgency, setUrgency] = useState<SupplyOrder["urgency"]>("Normal (24-48h)");
  const [requestedDeliveryDate, setRequestedDeliveryDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  // Modals
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [selectedInspectOrder, setSelectedInspectOrder] = useState<SupplyOrder | null>(null);
  
  // Super Admin Action Modals
  const [approvingOrder, setApprovingOrder] = useState<SupplyOrder | null>(null);
  const [decliningOrder, setDecliningOrder] = useState<SupplyOrder | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [dispatchingOrder, setDispatchingOrder] = useState<SupplyOrder | null>(null);

  // Dispatch Form States
  const [dispatchDriverName, setDispatchDriverName] = useState("Sultan Sheikh");
  const [dispatchDriverPhone, setDispatchDriverPhone] = useState("+91 98205 11984");
  const [dispatchVehicleNo, setDispatchVehicleNo] = useState("MH 02 EE 4092 (Reefer Cold Van)");
  const [dispatchVanTemp, setDispatchVanTemp] = useState("2.8");
  const [dispatchSealNo, setDispatchSealNo] = useState(() => `SEAL-K-${Math.floor(10000 + Math.random() * 90000)}`);

  // Direct Cold-Chain Dispatch Modal (Manual HQ Dispatch)
  const [showManualDispatchModal, setShowManualDispatchModal] = useState(false);
  const [manualTargetOutletId, setManualTargetOutletId] = useState(outlets[0]?.id || "bandra-west");
  const [manualChickenCones, setManualChickenCones] = useState("3");
  const [manualMuttonCones, setManualMuttonCones] = useState("2");
  const [manualSpiceBags, setManualSpiceBags] = useState("5");
  const [manualToumJars, setManualToumJars] = useState("10");

  // Receive Delivery OTP Confirmation modal for franchise
  const [receivingOrder, setReceivingOrder] = useState<SupplyOrder | null>(null);
  const [enteredDeliveryOtp, setEnteredDeliveryOtp] = useState("");
  const [deliveryOtpError, setDeliveryOtpError] = useState("");

  // Cart operations
  const addToCart = (item: SupplyCatalogItem) => {
    setCart((prev) => {
      const currentQty = prev[item.id] || 0;
      return { ...prev, [item.id]: currentQty === 0 ? item.moq : currentQty + 1 };
    });
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (qty <= 0) {
        delete updated[itemId];
      } else {
        updated[itemId] = qty;
      }
      return updated;
    });
  };

  const clearCart = () => setCart({});

  const cartItemCount = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const cartTotalAmount = Object.entries(cart).reduce((sum, [itemId, qty]) => {
    const item = SUPPLY_CATALOG.find((c) => c.id === itemId);
    return sum + (item ? item.unitPrice * qty : 0);
  }, 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItemCount === 0) return;

    setIsSubmittingOrder(true);
    const targetOutletId = isSuperAdmin ? selectedOutletId === "all" ? (outlets[0]?.id || "bandra-west") : selectedOutletId : currentOutlet?.id || "bandra-west";

    const itemsPayload = Object.entries(cart).map(([itemId, quantity]) => ({ itemId, quantity }));

    const res = placeSupplyOrder({
      outletId: targetOutletId,
      urgency,
      requestedDeliveryDate,
      items: itemsPayload,
      notes: orderNotes,
    });

    setIsSubmittingOrder(false);
    if (res.success) {
      clearCart();
      setShowCartDrawer(false);
      setOrderSuccessMsg(res.message);
      setPartnerViewTab("my_orders");
      setTimeout(() => setOrderSuccessMsg(null), 5000);
    }
  };

  // Super Admin: Confirm Approval
  const handleConfirmApproval = () => {
    if (!approvingOrder) return;
    approveSupplyOrder(approvingOrder.id, approvingOrder.requestedDeliveryDate);
    setApprovingOrder(null);
  };

  // Super Admin: Confirm Decline
  const handleConfirmDecline = () => {
    if (!decliningOrder) return;
    if (!declineReason.trim()) return;
    declineSupplyOrder(decliningOrder.id, declineReason);
    setDecliningOrder(null);
    setDeclineReason("");
  };

  // Super Admin: Confirm Dispatch
  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingOrder) return;

    dispatchSupplyOrder(dispatchingOrder.id, {
      driverName: dispatchDriverName,
      driverPhone: dispatchDriverPhone,
      vehicleNumber: dispatchVehicleNo,
      temperatureCelsius: parseFloat(dispatchVanTemp) || 2.8,
      securitySealNumber: dispatchSealNo,
    });

    setDispatchingOrder(null);
  };

  // Super Admin: Manual Direct Dispatch
  const handleCreateManualDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const outlet = outlets.find((o) => o.id === manualTargetOutletId) || outlets[0];
    const targetId = outlet?.id || "hq-main";
    const targetName = outlet?.name || "Brand HQ";
    const cCount = parseInt(manualChickenCones) || 0;
    const mCount = parseInt(manualMuttonCones) || 0;
    const totalWeight = cCount * 30.0 + mCount * 18.0;

    dispatchShipment({
      shipmentNumber: `IK-DISP-${new Date().toISOString().replace(/\D/g, "").slice(2, 10)}`,
      outletId: targetId,
      outletName: targetName,
      dispatchedAt: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }) + ", Today",
      status: "in_transit",
      chickenConesCount: cCount,
      muttonConesCount: mCount,
      totalMeatWeightKg: totalWeight,
      spiceMixBagsCount: parseInt(manualSpiceBags) || 0,
      toumJarsCount: parseInt(manualToumJars) || 0,
      vanVehicleNumber: dispatchVehicleNo,
      driverName: dispatchDriverName,
      driverPhone: dispatchDriverPhone,
      temperatureCelsius: parseFloat(dispatchVanTemp) || 2.8,
      securitySealNumber: `SEAL-K-${Math.floor(10000 + Math.random() * 90000)}`,
    });

    setShowManualDispatchModal(false);
  };

  // Franchise Confirm Delivery
  const handleConfirmDeliveryReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receivingOrder) return;
    const res = markSupplyOrderDelivered(receivingOrder.id, enteredDeliveryOtp);
    if (!res.success) {
      setDeliveryOtpError(res.message);
    } else {
      setReceivingOrder(null);
      setEnteredDeliveryOtp("");
      setDeliveryOtpError("");
    }
  };

  // Filter Catalog
  const filteredCatalog = SUPPLY_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.sku.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter Orders for Display
  const filteredOrders = supplyOrders.filter((order) => {
    const matchesOutlet = isSuperAdmin
      ? selectedOutletId === "all" || order.outletId === selectedOutletId
      : order.outletId === currentOutlet?.id;

    const matchesStatus = adminStatusFilter === "all" || order.status === adminStatusFilter;

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.outletName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesOutlet && matchesStatus && matchesSearch;
  });

  // Requisition Stats
  const pendingCount = supplyOrders.filter((o) => o.status === "pending").length;
  const approvedCount = supplyOrders.filter((o) => o.status === "approved").length;
  const dispatchedCount = supplyOrders.filter((o) => o.status === "dispatched").length;
  const deliveredCount = supplyOrders.filter((o) => o.status === "delivered").length;

  return (
    <div className="space-y-6">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-orange-500" />
            <span>Supply Chain & Stock Orders</span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isSuperAdmin ? (
            <>
              {/* Super Admin Tab Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-[#1a1a1c] border border-[#2e2e30]">
                <button
                  type="button"
                  onClick={() => setAdminViewTab("requisitions")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                    adminViewTab === "requisitions"
                      ? "bg-orange-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>Franchise Orders</span>
                  {pendingCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
                      {pendingCount}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setAdminViewTab("fleet")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                    adminViewTab === "fleet"
                      ? "bg-orange-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Cold Fleet & Dispatch</span>
                </button>
              </div>

              <Button
                onClick={() => setShowManualDispatchModal(true)}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs h-9 px-3.5 rounded-xl gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Dispatch Direct Shipment</span>
              </Button>
            </>
          ) : (
            <>
              {/* Franchise Partner Tab Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-[#1a1a1c] border border-[#2e2e30]">
                <button
                  type="button"
                  onClick={() => setPartnerViewTab("catalog")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                    partnerViewTab === "catalog"
                      ? "bg-orange-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>Order Raw Materials</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPartnerViewTab("my_orders")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
                    partnerViewTab === "my_orders"
                      ? "bg-orange-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Requisition Status</span>
                  {supplyOrders.filter((o) => o.outletId === currentOutlet?.id && (o.status === "dispatched" || o.status === "pending")).length > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-orange-500 text-white font-bold">
                      {supplyOrders.filter((o) => o.outletId === currentOutlet?.id && (o.status === "dispatched" || o.status === "pending")).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Cart Button */}
              <Button
                onClick={() => setShowCartDrawer(true)}
                className="relative bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs h-9 px-4 rounded-xl gap-2 shadow-md cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>View Cart</span>
                {cartItemCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-white text-orange-600">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {orderSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2.5 animate-pop">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{orderSuccessMsg}</span>
        </div>
      )}

      {/* ── SUPER ADMIN DASHBOARD VIEW ──────────────────────────────────── */}
      {isSuperAdmin && adminViewTab === "requisitions" && (
        <div className="space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Pending Approval</span>
                  <p className="text-2xl font-bold text-white font-mono mt-0.5">{pendingCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Approved / Preparing</span>
                  <p className="text-2xl font-bold text-blue-400 font-mono mt-0.5">{approvedCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <PackageCheck className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">In-Transit Moving</span>
                  <p className="text-2xl font-bold text-orange-400 font-mono mt-0.5">{dispatchedCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Truck className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Delivered Completed</span>
                  <p className="text-2xl font-bold text-emerald-400 font-mono mt-0.5">{deliveredCount}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requisitions List & Action Queue */}
          <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-[#242427]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-orange-400" />
                  <CardTitle className="text-sm font-bold text-white">Franchise Supply Requisitions</CardTitle>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search order #, outlet..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-8 pl-8 pr-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Status Filters */}
                  <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
                    {[
                      { id: "all", label: "All" },
                      { id: "pending", label: "Pending" },
                      { id: "approved", label: "Approved" },
                      { id: "dispatched", label: "In Transit" },
                      { id: "delivered", label: "Delivered" },
                      { id: "declined", label: "Declined" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setAdminStatusFilter(st.id as any)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors",
                          adminStatusFilter === st.id
                            ? "bg-orange-600 text-white font-bold"
                            : "bg-[#141416] text-zinc-400 hover:text-white border border-[#2e2e30]"
                        )}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[#161618] border border-[#2e2e30] hover:border-orange-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    {/* Left: Outlet & Requisition Details */}
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black text-white">{order.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#242427] text-orange-400 border border-[#383838]">
                          {order.outletCode}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            order.status === "pending" && "bg-amber-500/15 text-amber-400 border border-amber-500/30",
                            order.status === "approved" && "bg-blue-500/15 text-blue-400 border border-blue-500/30",
                            order.status === "dispatched" && "bg-orange-500/15 text-orange-400 border border-orange-500/30 animate-pulse",
                            order.status === "delivered" && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
                            order.status === "declined" && "bg-red-500/15 text-red-400 border border-red-500/30"
                          )}
                        >
                          {order.status}
                        </span>
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {order.urgency}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-300">
                        <strong className="text-white text-sm font-sans">{order.outletName}</strong>
                        <span>· Placed: {order.createdAt}</span>
                        <span>· Required By: <strong className="text-orange-400">{order.requestedDeliveryDate}</strong></span>
                      </div>

                      {/* Item Tags Preview */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {order.items.map((it, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-[#202024] border border-[#2a2a2e] text-[11px] font-mono text-zinc-300"
                          >
                            <strong>{it.quantity}x</strong> {it.itemName}
                          </span>
                        ))}
                      </div>

                      {order.notes && (
                        <p className="text-[11px] text-zinc-400 italic">Note: &quot;{order.notes}&quot;</p>
                      )}
                      {order.declineReason && (
                        <p className="text-[11px] text-red-400 font-semibold">Declined Reason: &quot;{order.declineReason}&quot;</p>
                      )}
                    </div>

                    {/* Right: Financial Total & Super Admin Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#242427]">
                      <div className="text-left lg:text-right font-mono">
                        <span className="text-[10px] text-zinc-400 uppercase block font-sans">Requisition Value</span>
                        <span className="text-lg font-bold text-white">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                        <span className="text-[11px] text-zinc-400 block">{order.totalQuantity} Units</span>
                      </div>

                      {/* Action Buttons depending on status */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedInspectOrder(order)}
                          className="h-8 px-2.5 text-xs text-zinc-300 hover:text-white border-[#2e2e30] bg-[#1a1a1c]"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>View Detail</span>
                        </Button>

                        {order.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => setApprovingOrder(order)}
                              className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setDecliningOrder(order);
                                setDeclineReason("");
                              }}
                              className="h-8 px-2.5 text-xs text-red-400 hover:text-white hover:bg-red-500/20 font-bold rounded-xl cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5 mr-1" />
                              <span>Decline</span>
                            </Button>
                          </>
                        )}

                        {order.status === "approved" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setDispatchingOrder(order);
                              setDispatchSealNo(`SEAL-K-${Math.floor(10000 + Math.random() * 90000)}`);
                            }}
                            className="h-8 px-3 text-xs bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl gap-1 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Dispatch Van</span>
                          </Button>
                        )}

                        {order.status === "dispatched" && (
                          <div className="flex items-center gap-1.5 text-xs font-mono text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-xl border border-orange-500/20">
                            <Truck className="w-3.5 h-3.5 animate-bounce" />
                            <span>En Route ({order.trackingNumber})</span>
                          </div>
                        )}

                        {order.status === "delivered" && (
                          <div className="flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Delivered & Ingested</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-zinc-500 text-xs">
                  No stock requisitions found in this view.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── SUPER ADMIN LIVE FLEET & CENTRAL DISPATCH VIEW ────────────────── */}
      {isSuperAdmin && adminViewTab === "fleet" && (
        <div className="space-y-6">
          {/* High Level Supply Chain Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Central Cold Storage</span>
                <p className="text-xl font-bold text-white font-mono mt-0.5">450 kg Ready</p>
                <span className="text-[10px] text-emerald-400 font-semibold block">15x Chicken + 8x Mutton Cones</span>
              </CardContent>
            </Card>

            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Active In-Transit</span>
                <p className="text-xl font-bold text-blue-400 font-mono mt-0.5">
                  {shipments.filter((s) => s.status === "in_transit").length} Vans Moving
                </p>
                <span className="text-[10px] text-zinc-400 block">Target Temp: 2.0°C – 4.0°C</span>
              </CardContent>
            </Card>

            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Delivered Today</span>
                <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                  {shipments.filter((s) => s.status === "delivered").reduce((sum, s) => sum + s.totalMeatWeightKg, 0)} kg Meat
                </p>
                <span className="text-[10px] text-zinc-400 block">100% Tamper Seals Intact</span>
              </CardContent>
            </Card>

            <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
              <CardContent className="p-4">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">Signature Spice Reserve</span>
                <p className="text-xl font-bold text-orange-400 font-mono mt-0.5">85 Bags</p>
                <span className="text-[10px] text-zinc-400 block">Koyla Secret Spice Blend</span>
              </CardContent>
            </Card>
          </div>

          {/* Active Fleet Dispatches */}
          <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-[#242427]">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-orange-400" />
                <span>Cold-Chain Fleet Telemetry</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {shipments.map((shp) => (
                <div
                  key={shp.id}
                  className="p-4 rounded-2xl bg-[#161618] border border-[#2e2e30] flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 hover:border-orange-500/40 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-400">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-white">{shp.shipmentNumber}</span>
                        <span className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-md border",
                          shp.status === "delivered"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : shp.status === "in_transit"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30 animate-pulse"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        )}>
                          {shp.status.replace("_", " ")}
                        </span>
                      </div>

                      <span className="text-sm font-bold text-white block truncate mt-0.5">
                        Destination: {shp.outletName}
                      </span>
                      <span className="text-[11px] text-zinc-400">
                        Dispatched: {shp.dispatchedAt} &middot; Driver: {shp.driverName} ({shp.driverPhone})
                      </span>
                    </div>
                  </div>

                  {/* Payload Breakdown */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <div className="px-3 py-1.5 rounded-xl bg-[#1f1f1f] border border-[#2e2e30] text-center">
                      <span className="text-[9px] text-zinc-500 block uppercase font-sans">Chicken Cones</span>
                      <span className="font-black text-white">{shp.chickenConesCount}x (30kg)</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-[#1f1f1f] border border-[#2e2e30] text-center">
                      <span className="text-[9px] text-zinc-500 block uppercase font-sans">Mutton Cones</span>
                      <span className="font-black text-white">{shp.muttonConesCount}x (18kg)</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-[#1f1f1f] border border-[#2e2e30] text-center">
                      <span className="text-[9px] text-zinc-500 block uppercase font-sans">Total Meat</span>
                      <span className="font-black text-orange-400">{shp.totalMeatWeightKg} kg</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-[#1f1f1f] border border-[#2e2e30] text-center">
                      <span className="text-[9px] text-zinc-500 block uppercase font-sans">Van Temp</span>
                      <span className="font-black text-blue-400">{shp.temperatureCelsius}°C</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-[#1f1f1f] border border-[#2e2e30] text-center">
                      <span className="text-[9px] text-zinc-500 block uppercase font-sans">Security Seal</span>
                      <span className="font-bold text-emerald-400">{shp.securitySealNumber}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── FRANCHISE PARTNER VIEW: RAW MATERIALS CATALOG & ORDERING ─────── */}
      {!isSuperAdmin && partnerViewTab === "catalog" && (
        <div className="space-y-6">
          {/* Category Filter Chips & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(["All", "Raw Marinated Meat Cones", "Spices & Marinades", "Sauces & Dips", "Breads & Khubz", "Packaging & Disposables"] as CatalogCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer",
                    selectedCategory === cat
                      ? "bg-orange-600 text-white shadow-md shadow-orange-600/30"
                      : "bg-[#1a1a1c] text-zinc-400 hover:text-white border border-[#2e2e30]"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search raw materials, spices..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="w-full h-9 pl-8 pr-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCatalog.map((item) => {
              const inCartQty = cart[item.id] || 0;

              return (
                <Card
                  key={item.id}
                  className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl overflow-hidden flex flex-col justify-between hover:border-orange-500/40 transition-all group"
                >
                  <div>
                    {/* Item Image */}
                    <div className="relative h-40 w-full overflow-hidden bg-[#141416]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-[#141416]/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-[10px] font-mono text-orange-400 font-bold">
                        {item.sku}
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-zinc-300">
                        {item.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors leading-tight">
                          {item.name}
                        </h3>
                        <span className="text-[11px] text-zinc-400 font-medium mt-0.5 block">
                          Unit: <strong className="text-zinc-200">{item.unit}</strong> (MOQ: {item.moq})
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5 pt-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>Shelf Life: {item.shelfLife}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Add to Cart */}
                  <div className="p-4 pt-0 border-t border-[#242427] flex items-center justify-between mt-2">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block font-mono">Unit Price</span>
                      <span className="text-base font-bold font-mono text-white">
                        ₹{item.unitPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {inCartQty > 0 ? (
                      <div className="flex items-center gap-2 bg-[#242427] border border-[#383838] p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, inCartQty - 1)}
                          className="w-6 h-6 rounded-lg bg-[#18181a] text-white hover:bg-orange-600 flex items-center justify-center font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-xs text-orange-400 px-1">{inCartQty}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, inCartQty + 1)}
                          className="w-6 h-6 rounded-lg bg-[#18181a] text-white hover:bg-orange-600 flex items-center justify-center font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => addToCart(item)}
                        className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs h-8 px-3 rounded-xl gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Stock</span>
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FRANCHISE PARTNER VIEW: REQUISITION STATUS & TRACKING ─────────── */}
      {!isSuperAdmin && partnerViewTab === "my_orders" && (
        <div className="space-y-4">
          <Card className="border-[#2e2e30] bg-[#1a1a1c] shadow-sm rounded-2xl">
            <CardHeader className="pb-3 border-b border-[#242427]">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>My Stock Requisition History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[#161618] border border-[#2e2e30] hover:border-orange-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black text-white">{order.orderNumber}</span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            order.status === "pending" && "bg-amber-500/15 text-amber-400 border border-amber-500/30",
                            order.status === "approved" && "bg-blue-500/15 text-blue-400 border border-blue-500/30",
                            order.status === "dispatched" && "bg-orange-500/15 text-orange-400 border border-orange-500/30 animate-pulse",
                            order.status === "delivered" && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
                            order.status === "declined" && "bg-red-500/15 text-red-400 border border-red-500/30"
                          )}
                        >
                          {order.status}
                        </span>
                        <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          {order.urgency}
                        </span>
                      </div>

                      <div className="text-xs text-zinc-300">
                        <span>Submitted on: {order.createdAt}</span> · Required By: <strong className="text-white">{order.requestedDeliveryDate}</strong>
                      </div>

                      {/* Items */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {order.items.map((it, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-[#202024] border border-[#2a2a2e] text-[11px] font-mono text-zinc-300"
                          >
                            <strong>{it.quantity}x</strong> {it.itemName}
                          </span>
                        ))}
                      </div>

                      {order.driverDetails && (
                        <p className="text-xs text-blue-400 font-mono flex items-center gap-1.5 pt-0.5">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch Van: {order.driverDetails}</span>
                        </p>
                      )}

                      {order.declineReason && (
                        <p className="text-xs text-red-400 font-semibold">Declined Reason: &quot;{order.declineReason}&quot;</p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#242427]">
                      <div className="text-left lg:text-right font-mono">
                        <span className="text-[10px] text-zinc-400 uppercase block font-sans">Total Invoiced</span>
                        <span className="text-base font-bold text-white">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedInspectOrder(order)}
                          className="h-8 px-2.5 text-xs text-zinc-300 hover:text-white border-[#2e2e30] bg-[#1a1a1c]"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>View Detail</span>
                        </Button>

                        {order.status === "dispatched" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setReceivingOrder(order);
                              setEnteredDeliveryOtp("");
                              setDeliveryOtpError("");
                            }}
                            className="h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl gap-1 cursor-pointer"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Confirm Delivery Receipt</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-zinc-500 text-xs">
                  You haven&apos;t placed any raw material stock orders yet. Click &quot;Order Raw Materials&quot; above to request spices, meat cones, and supplies.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── CART REQUISITION DRAWER / MODAL ─────────────────────────────── */}
      <Dialog open={showCartDrawer} onOpenChange={setShowCartDrawer}>
        <DialogContent className="max-w-xl bg-[#18181b] border border-[#2e2e30] text-white p-0 rounded-3xl overflow-hidden shadow-2xl">
          <form onSubmit={handlePlaceOrder}>
            <div className="p-5 border-b border-[#2e2e30] bg-[#141416] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                <DialogTitle className="text-lg font-bold text-white">
                  Stock Requisition Cart ({cartItemCount} Items)
                </DialogTitle>
              </div>
              <span className="text-xs text-zinc-400">
                Outlet: <strong className="text-white">{currentOutlet?.name}</strong>
              </span>
            </div>

            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              {cartItemCount > 0 ? (
                <div className="space-y-2.5 divide-y divide-[#242427]">
                  {Object.entries(cart).map(([itemId, qty]) => {
                    const item = SUPPLY_CATALOG.find((c) => c.id === itemId);
                    if (!item) return null;

                    return (
                      <div key={itemId} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <span className="text-[11px] text-zinc-400 font-mono">
                            ₹{item.unitPrice} &times; {qty} {item.unit}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono font-bold text-xs text-white">
                            ₹{(item.unitPrice * qty).toLocaleString("en-IN")}
                          </span>
                          <div className="flex items-center gap-1.5 bg-[#242427] border border-[#383838] p-1 rounded-xl">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, qty - 1)}
                              className="w-5 h-5 rounded bg-[#18181a] text-white hover:bg-orange-600 flex items-center justify-center font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-xs text-orange-400 px-1">{qty}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, qty + 1)}
                              className="w-5 h-5 rounded bg-[#18181a] text-white hover:bg-orange-600 flex items-center justify-center font-bold text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-zinc-500 text-xs">
                  Your requisition cart is empty. Add spices, meat cones, or dips from the catalog.
                </div>
              )}

              {cartItemCount > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#2e2e30]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1">Requisition Urgency</label>
                      <select
                        value={urgency}
                        onChange={(e) => setUrgency(e.target.value as any)}
                        className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                      >
                        <option value="Normal (24-48h)">Normal Stock (24-48h)</option>
                        <option value="Express Rush (12h)">Express Rush (12h)</option>
                        <option value="Emergency Stockout (6h)">Emergency Stockout (6h)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-400 mb-1">Required Delivery Date</label>
                      <input
                        type="date"
                        value={requestedDeliveryDate}
                        onChange={(e) => setRequestedDeliveryDate(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Notes / Specific Instructions (Optional)</label>
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Please send extra cold ice packs with meat cones, delivery needed before 11 AM..."
                      rows={2}
                      className="w-full p-2.5 rounded-xl bg-[#141416] border border-[#2e2e30] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Summary Total */}
                  <div className="p-3.5 rounded-2xl bg-[#141416] border border-[#2e2e30] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Estimated Requisition Value</span>
                      <span className="text-xs text-zinc-500">Invoiced on central franchise ledger</span>
                    </div>
                    <span className="text-xl font-bold font-mono text-orange-400">
                      ₹{cartTotalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#2e2e30] bg-[#141416] flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCartDrawer(false)}
                className="border-[#2e2e30] bg-[#1f1f23] text-zinc-300 text-xs font-bold h-9 px-4 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={cartItemCount === 0 || isSubmittingOrder}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs h-9 px-5 rounded-xl gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Requisition to HQ</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── SUPER ADMIN APPROVE ORDER MODAL ─────────────────────────────── */}
      <Dialog open={!!approvingOrder} onOpenChange={(open) => !open && setApprovingOrder(null)}>
        <DialogContent className="max-w-md bg-[#18181b] border border-[#2e2e30] text-white p-6 rounded-3xl space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Approve Supply Requisition</span>
            </DialogTitle>
          </DialogHeader>

          {approvingOrder && (
            <div className="space-y-3 text-xs">
              <p className="text-zinc-300">
                Are you sure you want to approve Order <strong className="text-white font-mono">{approvingOrder.orderNumber}</strong> for <strong className="text-white">{approvingOrder.outletName}</strong>?
              </p>
              <div className="p-3 rounded-xl bg-[#141416] border border-[#2a2a2e] font-mono space-y-1">
                <div>Items: <strong className="text-white">{approvingOrder.totalQuantity} Units</strong></div>
                <div>Requisition Value: <strong className="text-orange-400">₹{approvingOrder.totalAmount.toLocaleString("en-IN")}</strong></div>
                <div>Urgency: <strong className="text-amber-400">{approvingOrder.urgency}</strong></div>
                <div>Requested Date: <strong className="text-white">{approvingOrder.requestedDeliveryDate}</strong></div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setApprovingOrder(null)}
              className="border-[#2e2e30] bg-[#1f1f23] text-zinc-300 text-xs font-bold h-9 px-4 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmApproval}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-4 rounded-xl cursor-pointer"
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── SUPER ADMIN DECLINE ORDER MODAL ─────────────────────────────── */}
      <Dialog open={!!decliningOrder} onOpenChange={(open) => !open && setDecliningOrder(null)}>
        <DialogContent className="max-w-md bg-[#18181b] border border-[#2e2e30] text-white p-6 rounded-3xl space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span>Decline Requisition</span>
            </DialogTitle>
          </DialogHeader>

          {decliningOrder && (
            <div className="space-y-3 text-xs">
              <p className="text-zinc-300">
                State reason for declining order <strong className="text-white font-mono">{decliningOrder.orderNumber}</strong> ({decliningOrder.outletName}):
              </p>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Temporary stockout at central commissary, please reorder on Monday..."
                rows={3}
                className="w-full p-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                required
              />
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDecliningOrder(null)}
              className="border-[#2e2e30] bg-[#1f1f23] text-zinc-300 text-xs font-bold h-9 px-4 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!declineReason.trim()}
              onClick={handleConfirmDecline}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs h-9 px-4 rounded-xl cursor-pointer disabled:opacity-50"
            >
              Confirm Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── SUPER ADMIN DISPATCH ORDER MODAL ─────────────────────────────── */}
      <Dialog open={!!dispatchingOrder} onOpenChange={(open) => !open && setDispatchingOrder(null)}>
        <DialogContent className="max-w-md bg-[#18181b] border border-[#2e2e30] text-white p-6 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-500" />
              <span>Dispatch Cold-Chain Requisition</span>
            </DialogTitle>
          </DialogHeader>

          {dispatchingOrder && (
            <form onSubmit={handleConfirmDispatch} className="space-y-3.5 mt-3 text-xs">
              <div className="p-3 rounded-xl bg-[#141416] border border-[#2e2e30] font-mono">
                <span className="text-zinc-400 block font-sans">Target Outlet</span>
                <strong className="text-white text-sm font-sans">{dispatchingOrder.outletName} ({dispatchingOrder.outletCode})</strong>
                <span className="text-orange-400 block mt-1">
                  Requisition #{dispatchingOrder.orderNumber} · {dispatchingOrder.totalQuantity} items
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={dispatchDriverName}
                    onChange={(e) => setDispatchDriverName(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Driver Phone</label>
                  <input
                    type="text"
                    value={dispatchDriverPhone}
                    onChange={(e) => setDispatchDriverPhone(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-white text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Cold Vehicle Number</label>
                <input
                  type="text"
                  value={dispatchVehicleNo}
                  onChange={(e) => setDispatchVehicleNo(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-white text-xs font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Van Temperature (°C)</label>
                  <input
                    type="text"
                    value={dispatchVanTemp}
                    onChange={(e) => setDispatchVanTemp(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-white text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Tamper Security Seal #</label>
                  <input
                    type="text"
                    value={dispatchSealNo}
                    onChange={(e) => setDispatchSealNo(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-emerald-400 text-xs font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDispatchingOrder(null)}
                  className="border-[#2e2e30] bg-[#1f1f23] text-zinc-300 text-xs font-bold h-9 px-4 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs h-9 px-4 rounded-xl cursor-pointer"
                >
                  Confirm Cold Dispatch
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ── FRANCHISE CONFIRM DELIVERY RECEIPT MODAL ─────────────────────── */}
      <Dialog open={!!receivingOrder} onOpenChange={(open) => !open && setReceivingOrder(null)}>
        <DialogContent className="max-w-md bg-[#18181b] border border-[#2e2e30] text-white p-6 rounded-3xl space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-400" />
              <span>Confirm Stock Delivery Receipt</span>
            </DialogTitle>
          </DialogHeader>

          {receivingOrder && (
            <form onSubmit={handleConfirmDeliveryReceipt} className="space-y-3.5 text-xs">
              <p className="text-zinc-300">
                Verify tamper seals and cold temperature with driver, then enter the 4-digit Delivery OTP:
              </p>

              <div className="p-3.5 rounded-xl bg-[#141416] border border-[#2e2e30] space-y-1 font-mono">
                <div>Order: <strong className="text-white">{receivingOrder.orderNumber}</strong></div>
                <div>Driver: <strong className="text-zinc-200">{receivingOrder.driverDetails || "Central Logistics"}</strong></div>
                <div className="text-[11px] text-zinc-400 pt-1">
                  (Assigned Delivery OTP: <span className="text-orange-400 font-bold font-mono">{receivingOrder.deliveryOtp}</span>)
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Enter 4-Digit Delivery OTP</label>
                <input
                  type="text"
                  maxLength={4}
                  value={enteredDeliveryOtp}
                  onChange={(e) => setEnteredDeliveryOtp(e.target.value)}
                  placeholder="e.g. 4821"
                  className="w-full h-11 px-3 text-center tracking-widest font-mono text-xl rounded-xl bg-[#141416] border border-[#2e2e30] text-white focus:outline-none focus:border-emerald-500"
                  required
                />
                {deliveryOtpError && (
                  <p className="text-red-400 text-xs mt-1 font-semibold">{deliveryOtpError}</p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReceivingOrder(null)}
                  className="border-[#2e2e30] bg-[#1f1f23] text-zinc-300 text-xs font-bold h-9 px-4 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-4 rounded-xl cursor-pointer"
                >
                  Confirm & Ingest Stock
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ── INSPECT FULL ORDER DETAIL MODAL ─────────────────────────────── */}
      <Dialog open={!!selectedInspectOrder} onOpenChange={(open) => !open && setSelectedInspectOrder(null)}>
        <DialogContent className="max-w-xl bg-[#18181b] border border-[#2e2e30] text-white p-0 rounded-3xl overflow-hidden shadow-2xl">
          {selectedInspectOrder && (
            <div>
              <div className="p-5 border-b border-[#2e2e30] bg-[#141416] flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                    {selectedInspectOrder.orderNumber}
                  </span>
                  <DialogTitle className="text-base font-bold text-white">
                    Stock Requisition Breakdown
                  </DialogTitle>
                </div>
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase",
                    selectedInspectOrder.status === "pending" && "bg-amber-500/15 text-amber-400 border border-amber-500/30",
                    selectedInspectOrder.status === "approved" && "bg-blue-500/15 text-blue-400 border border-blue-500/30",
                    selectedInspectOrder.status === "dispatched" && "bg-orange-500/15 text-orange-400 border border-orange-500/30",
                    selectedInspectOrder.status === "delivered" && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
                    selectedInspectOrder.status === "declined" && "bg-red-500/15 text-red-400 border border-red-500/30"
                  )}
                >
                  {selectedInspectOrder.status}
                </span>
              </div>

              <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto text-xs">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#141416] border border-[#2e2e30]">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Franchise Outlet</span>
                    <strong className="text-white text-xs">{selectedInspectOrder.outletName} ({selectedInspectOrder.outletCode})</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Urgency</span>
                    <strong className="text-amber-400 text-xs">{selectedInspectOrder.urgency}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Created Timestamp</span>
                    <span className="font-mono text-zinc-300">{selectedInspectOrder.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block">Required Delivery</span>
                    <span className="font-mono text-white font-bold">{selectedInspectOrder.requestedDeliveryDate}</span>
                  </div>
                </div>

                {/* Items Table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white block">Requisition Item Lines</span>
                  <div className="rounded-xl border border-[#2e2e30] bg-[#141416] overflow-hidden">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-[#242427] text-zinc-400 text-[10px] uppercase bg-[#18181b]">
                          <th className="py-2.5 px-3">Item</th>
                          <th className="py-2.5 px-3 text-right">Unit Price</th>
                          <th className="py-2.5 px-3 text-center">Qty</th>
                          <th className="py-2.5 px-3 text-right">Line Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#242427]">
                        {selectedInspectOrder.items.map((it, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 px-3">
                              <span className="font-sans font-semibold text-white block">{it.itemName}</span>
                              <span className="text-[10px] text-zinc-500 font-sans">{it.category} · {it.unit}</span>
                            </td>
                            <td className="py-2.5 px-3 text-right text-zinc-300">₹{it.unitPrice}</td>
                            <td className="py-2.5 px-3 text-center font-bold text-orange-400">{it.quantity}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-white">₹{it.totalPrice.toLocaleString("en-IN")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total */}
                <div className="p-3 rounded-xl bg-[#141416] border border-[#2e2e30] flex items-center justify-between font-mono">
                  <span className="text-zinc-400 font-sans">Total Order Value:</span>
                  <span className="text-base font-bold text-orange-400">₹{selectedInspectOrder.totalAmount.toLocaleString("en-IN")}</span>
                </div>

                {selectedInspectOrder.driverDetails && (
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
                    <span className="font-bold block">Cold-Chain Dispatch Info:</span>
                    <span className="text-[11px]">{selectedInspectOrder.driverDetails}</span>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-[#2e2e30] bg-[#141416] flex justify-end">
                <Button
                  onClick={() => setSelectedInspectOrder(null)}
                  className="bg-[#242427] hover:bg-[#333] text-zinc-200 text-xs font-bold h-8 px-4 rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── SUPER ADMIN MANUAL DISPATCH MODAL ────────────────────────────── */}
      {showManualDispatchModal && (
        <Dialog open={true} onOpenChange={setShowManualDispatchModal}>
          <DialogContent className="max-w-md bg-[#18181b] border border-[#2e2e30] text-white p-6 rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-500" />
                <span>Direct Cold-Chain Meat Dispatch</span>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateManualDispatch} className="space-y-3.5 mt-3 text-xs">
              <div>
                <label className="block font-bold text-zinc-400 mb-1">Destination Franchise Outlet</label>
                <select
                  value={manualTargetOutletId}
                  onChange={(e) => setManualTargetOutletId(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                >
                  {outlets.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-400 mb-1">30kg Chicken Cones</label>
                  <input
                    type="number"
                    value={manualChickenCones}
                    onChange={(e) => setManualChickenCones(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-400 mb-1">18kg Mutton Cones</label>
                  <input
                    type="number"
                    value={manualMuttonCones}
                    onChange={(e) => setManualMuttonCones(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-400 mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={dispatchDriverName}
                    onChange={(e) => setDispatchDriverName(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-400 mb-1">Van Temp (°C)</label>
                  <input
                    type="text"
                    value={dispatchVanTemp}
                    onChange={(e) => setDispatchVanTemp(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-[#141416] border border-[#2e2e30] text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowManualDispatchModal(false)}
                  className="border-[#2e2e30] bg-[#1f1f23] text-zinc-300 text-xs font-bold h-9 px-4 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs h-9 px-4 rounded-xl cursor-pointer"
                >
                  Dispatch Cold Shipment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
