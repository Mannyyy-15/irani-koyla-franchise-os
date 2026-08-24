"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Flame,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Printer,
  ShoppingBag,
  CreditCard,
  Smartphone,
  Banknote,
  Clock,
  CheckCircle2,
  X,
  Search,
  PauseCircle,
  PlayCircle,
  QrCode,
  Sparkles,
  Split,
  Wifi,
  WifiOff,
  AlertCircle,
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useFranchise } from "@/lib/franchise-context";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { cn } from "@/components/ui/cn";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  selectedModifiers: string[];
}

interface ParkedBill {
  id: string;
  customerName: string;
  cart: CartItem[];
  time: string;
}

export default function PosBillingTerminal() {
  const { activeOutlet, outlets, addLiveOrder, menuItems } = useFranchise();
  const currentOutlet = activeOutlet || outlets[0];

  const activePosItems = menuItems.filter((m) => m.active).map((m) => ({
    id: m.id,
    name: m.name,
    category: m.category,
    price: m.sellingPrice,
    meatWeight: m.meatWeight || (m.meatPortionGrams > 0 ? `${m.meatPortionGrams}g` : "N/A"),
    spit: m.spitType,
    tag: m.tag || "",
    popularRank: m.popularRank || 99,
    image: m.image || "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=600&q=80",
    modifiers: m.modifiers || [],
  }));

  const [activeCategory, setActiveCategory] = useState<string>("Most Ordered");
  const [searchTerm, setSearchTerm] = useState("");

  // Category Scrolling Ref & Mouse Drag State
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const scrollCategories = (direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmt = direction === "left" ? -240 : 240;
      categoryScrollRef.current.scrollBy({ left: scrollAmt, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = categoryScrollRef.current;
    if (!el) return;

    // Translate standard vertical mouse wheel into horizontal scroll
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.2;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!categoryScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - categoryScrollRef.current.offsetLeft);
    setScrollLeftPos(categoryScrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !categoryScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    categoryScrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  // Cart & Order State
  const [cart, setCart] = useState<CartItem[]>([]);

  const [paymentMode, setPaymentMode] = useState<"Cash" | "GPay / UPI" | "Card / POS" | "Split Payment">("Cash");
  const [customerToken, setCustomerToken] = useState("Counter Order #14");
  const [cashTendered, setCashTendered] = useState<string>("500");

  // Split-Tender States
  const [splitCash, setSplitCash] = useState("200");
  const [splitDigital, setSplitDigital] = useState("");
  const [splitDigitalType, setSplitDigitalType] = useState<"GPay / UPI" | "Card / POS">("GPay / UPI");

  // Parked Bills
  const [parkedBills, setParkedBills] = useState<ParkedBill[]>([]);
  const [showParkedModal, setShowParkedModal] = useState(false);

  // Dialogs
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [showKotModal, setShowKotModal] = useState(false);
  const [showUpiQrModal, setShowUpiQrModal] = useState(false);
  const [offlineQueuedToast, setOfflineQueuedToast] = useState(false);

  const categories = [
    { name: "Most Ordered", icon: "⭐" },
    { name: "All Items", icon: "🔥" },
    { name: "Shawarma Wraps", icon: "🌯" },
    { name: "Combos & Meals", icon: "🍱" },
    { name: "Platters & Dips", icon: "🍽️" },
    { name: "Irani Chai & Drinks", icon: "☕" },
    { name: "Sides & Toum", icon: "🍟" },
  ];

  const filteredMenuItems = activePosItems.filter((item) => {
    let matchesCat = false;
    if (activeCategory === "All Items") {
      matchesCat = true;
    } else if (activeCategory === "Most Ordered") {
      matchesCat = ["pos-01", "pos-02", "pos-03", "pos-05", "pos-07"].includes(item.id) || item.popularRank <= 4;
    } else {
      matchesCat = item.category === activeCategory;
    }

    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getItemCartQuantity = (itemId: string) => {
    return cart
      .filter((c) => c.id === itemId)
      .reduce((sum, c) => sum + c.quantity, 0);
  };

  const addToCart = (item: typeof activePosItems[0]) => {
    const existingIndex = cart.findIndex((c) => c.id === item.id && c.selectedModifiers.length === 0);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          category: item.category,
          image: item.image,
          selectedModifiers: [],
        },
      ]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const existingIndex = cart.findIndex((c) => c.id === itemId && c.selectedModifiers.length === 0);
    if (existingIndex > -1) {
      const updated = [...cart];
      if (updated[existingIndex].quantity > 1) {
        updated[existingIndex].quantity -= 1;
      } else {
        updated.splice(existingIndex, 1);
      }
      setCart(updated);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    const newQty = updated[index].quantity + delta;
    if (newQty <= 0) {
      updated.splice(index, 1);
    } else {
      updated[index].quantity = newQty;
    }
    setCart(updated);
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleParkBill = () => {
    if (cart.length === 0) return;
    const bill: ParkedBill = {
      id: `park-${Date.now()}`,
      customerName: customerToken || "Order",
      cart: [...cart],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setParkedBills([...parkedBills, bill]);
    setCart([]);
    setCustomerToken(`Counter Order #${Math.floor(10 + Math.random() * 80)}`);
  };

  const handleRecallBill = (bill: ParkedBill) => {
    setCart(bill.cart);
    setCustomerToken(bill.customerName);
    setParkedBills(parkedBills.filter((b) => b.id !== bill.id));
    setShowParkedModal(false);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const gstAmount = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = subtotal + gstAmount;

  // Auto-set initial cash tendered when grand total changes if default
  const cashNum = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, cashNum - grandTotal);

  // Split calculations
  useEffect(() => {
    if (paymentMode === "Split Payment") {
      const cNum = parseFloat(splitCash) || 0;
      const remainder = Math.max(0, grandTotal - cNum);
      setSplitDigital(remainder.toString());
    }
  }, [grandTotal, paymentMode, splitCash]);

  const splitCashVal = parseFloat(splitCash) || 0;
  const splitDigitalVal = parseFloat(splitDigital) || 0;
  const splitRemaining = grandTotal - splitCashVal - splitDigitalVal;

  const handlePunchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (paymentMode === "Split Payment" && Math.abs(splitRemaining) > 1) {
      alert(`Split balance remaining: ₹${splitRemaining.toFixed(2)}. Please ensure full settlement.`);
      return;
    }

    const orderNum = `IK-${Math.floor(1000 + Math.random() * 9000)}`;
    const timeNow = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

    const orderPayload = {
      orderNumber: orderNum,
      time: timeNow,
      items: cart.map((c) => ({
        name: c.name,
        quantity: c.quantity,
        price: c.price,
      })),
      totalAmount: grandTotal,
      channel: "Walk-in Counter" as const,
      paymentMethod: paymentMode,
      splitDetail: paymentMode === "Split Payment" ? {
        cashAmount: splitCashVal,
        digitalAmount: splitDigitalVal,
        digitalMethod: splitDigitalType,
      } : undefined,
      status: "Completed" as const,
      customerName: customerToken.trim() || "Counter Customer",
      outletId: currentOutlet.id,
    };

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const existingOffline = JSON.parse(localStorage.getItem("koyla_offline_orders") || "[]");
      localStorage.setItem("koyla_offline_orders", JSON.stringify([...existingOffline, orderPayload]));
      setOfflineQueuedToast(true);
      setTimeout(() => setOfflineQueuedToast(false), 4000);
    }

    addLiveOrder(orderPayload);
    setCompletedOrder({
      ...orderPayload,
      subtotal,
      gstAmount,
      cashTendered: paymentMode === "Split Payment" ? splitCash : cashTendered,
      changeDue: paymentMode === "Split Payment" ? 0 : changeDue,
    });
    setShowKotModal(true);
    setCart([]);
    setCustomerToken(`Counter Order #${Math.floor(10 + Math.random() * 80)}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 relative items-start pb-6">
      {/* Offline Toast Notification */}
      {offlineQueuedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-amber-950/90 border border-amber-500/50 text-amber-200 text-xs font-bold shadow-2xl flex items-center gap-3">
          <WifiOff className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
          <div>
            <span>Offline Resilience Active</span>
            <span className="text-[10px] text-amber-300/70 block">Bill queued in local device memory. Auto-syncs when online.</span>
          </div>
        </div>
      )}

      {/* LEFT COLUMN: Big Touch Visual Menu */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-3 min-w-0">
        {/* Category Filters Bar & Fast Search */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-64 xl:w-72 shrink-0">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search shawarma, combo, chai…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-2xl bg-[#1f1f1f] border border-[#303030] text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors font-medium shadow-inner"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Smooth Scrollable Touch Category Pills */}
          <div className="relative flex items-center gap-1.5 w-full sm:flex-1 min-w-0">
            <button
              type="button"
              onClick={() => scrollCategories("left")}
              className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#1f1f1f] border border-[#303030] text-zinc-400 hover:text-white hover:border-orange-500 transition-colors shadow-md cursor-pointer"
              title="Scroll Left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <div
              ref={categoryScrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeaveOrUp}
              onMouseUp={handleMouseLeaveOrUp}
              onMouseMove={handleMouseMove}
              className="flex items-center gap-1.5 overflow-x-auto overflow-y-hidden pb-0.5 no-scrollbar scrollbar-none w-full select-none cursor-grab active:cursor-grabbing touch-pan-x"
            >
              {categories.map((cat) => {
                const count = activePosItems.filter((i) => {
                  if (cat.name === "All Items") return true;
                  if (cat.name === "Most Ordered") return ["pos-01", "pos-02", "pos-03", "pos-05", "pos-07"].includes(i.id) || i.popularRank <= 4;
                  return i.category === cat.name;
                }).length;
                const isActive = activeCategory === cat.name;

                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setActiveCategory(cat.name)}
                    className={cn(
                      "px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0 select-none",
                      isActive
                        ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30 scale-[1.02]"
                        : "bg-[#1f1f1f] text-zinc-300 border border-[#303030] hover:border-orange-500/50 hover:text-white"
                    )}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold",
                      isActive ? "bg-black/30 text-white" : "bg-[#161618] text-zinc-400"
                    )}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollCategories("right")}
              className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#1f1f1f] border border-[#303030] text-zinc-400 hover:text-white hover:border-orange-500 transition-colors shadow-md cursor-pointer"
              title="Scroll Right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Big Food Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
          {filteredMenuItems.map((item) => {
            const inCartQty = getItemCartQuantity(item.id);

            return (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className={cn(
                  "group relative rounded-3xl bg-[#1f1f1f] border overflow-hidden transition-all duration-200 cursor-pointer shadow-md hover:shadow-2xl flex flex-col justify-between select-none",
                  inCartQty > 0
                    ? "border-orange-500 bg-[#25201d] ring-1 ring-orange-500/50 shadow-orange-600/20"
                    : "border-[#303030] hover:border-orange-500/80"
                )}
              >
                {/* Big Full-Bleed Clear Food Photo */}
                <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-[#161618]">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=600&q=80";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Quantity In-Basket Float Tag */}
                  {inCartQty > 0 && (
                    <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-orange-600 text-white font-black text-[11px] px-2.5 py-1 rounded-xl shadow-2xl border border-orange-400/50 animate-in fade-in">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>{inCartQty} in Basket</span>
                    </div>
                  )}
                </div>

                {/* Card Body with Large Title & Price */}
                <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 space-y-2.5">
                  <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-orange-400 transition-colors leading-snug line-clamp-2">
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between pt-2 border-t border-[#303030]">
                    <div className="flex flex-col">
                      <span className="font-mono text-base sm:text-lg font-black text-orange-400">
                        ₹{item.price}
                      </span>
                    </div>

                    {/* Quick + / - Controls or 1-Tap Add */}
                    {inCartQty > 0 ? (
                      <div
                        className="flex items-center gap-1 bg-[#161618] p-1 rounded-xl border border-orange-500/50 shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded-lg bg-[#1f1f1f] hover:bg-rose-500/20 text-white hover:text-rose-400 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs font-black text-white px-1 text-center">
                          {inCartQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="w-7 h-7 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center justify-center transition-colors cursor-pointer shadow-md"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="h-8 px-3 rounded-xl bg-orange-600/20 text-orange-400 group-hover:bg-orange-600 group-hover:text-white flex items-center gap-1 font-black text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Ultra-Clean Counter Billing Register (Sticky & Max-Height Constrained) */}
      <div className="lg:col-span-5 xl:col-span-4 sticky top-3 lg:top-4 z-20 self-start w-full">
        <form onSubmit={handlePunchOrder} className="flex flex-col justify-between overflow-hidden rounded-3xl bg-[#1f1f1f] border border-[#303030] p-3.5 sm:p-4 shadow-2xl space-y-2.5 max-h-[calc(100vh-5.5rem)]">
          {/* Header Bar */}
          <div className="shrink-0 flex items-center justify-between border-b border-[#303030] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-black text-white block leading-none">Register Basket</span>
                <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block font-bold">{customerToken}</span>
              </div>
            </div>

            {/* Quick Actions: Clear & Park / Recall */}
            <div className="flex items-center gap-1.5">
              {parkedBills.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowParkedModal(true)}
                  className="px-2 py-1 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-orange-500/20"
                >
                  <PlayCircle className="w-3 h-3" />
                  <span>Recall ({parkedBills.length})</span>
                </button>
              )}

              {cart.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleParkBill}
                    className="px-2 py-1 rounded-xl bg-[#161618] border border-[#303030] text-zinc-300 hover:text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    title="Park bill to serve next customer"
                  >
                    <PauseCircle className="w-3 h-3 text-orange-400" />
                    <span>Park</span>
                  </button>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="p-1 rounded-xl bg-[#161618] border border-[#303030] text-zinc-500 hover:text-rose-400 cursor-pointer transition-colors"
                    title="Clear Cart"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Cart Items Scroll Area - Big, Clear, High-Visibility Item Cards */}
          <div className="flex-1 min-h-[140px] max-h-[calc(100vh-27rem)] overflow-y-auto py-1 space-y-2.5 pr-1 no-scrollbar scrollbar-none">
            {cart.length === 0 ? (
              <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center text-xs text-zinc-500 font-semibold space-y-2.5">
                <div className="w-12 h-12 rounded-2xl bg-[#161618] border border-[#303030] flex items-center justify-center text-zinc-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-sm text-zinc-400 font-bold block">Basket is empty</span>
                <span className="text-xs text-zinc-500 block max-w-[220px]">Tap food cards on the left to add items to the order.</span>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="p-3 sm:p-3.5 rounded-2xl bg-[#161618] border border-[#303030] flex items-center justify-between gap-3 hover:border-[#3d3d3d] transition-colors shadow-sm">
                  {/* Item Thumbnail & Name */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=300&q=80";
                      }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-[#303030] shrink-0 bg-[#252525]"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-sm sm:text-base font-black text-white block truncate leading-tight">
                        {item.name}
                      </span>
                      <span className="text-xs sm:text-sm text-orange-400 font-mono font-bold block mt-1">
                        ₹{item.price} each
                      </span>
                    </div>
                  </div>

                  {/* Quantity Stepper & Line Price */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="flex items-center gap-1 bg-[#1f1f1f] p-1 rounded-xl border border-[#303030]">
                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, -1)}
                        className="w-8 h-8 rounded-xl bg-[#161618] text-white text-sm font-bold flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm sm:text-base font-black text-white w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(idx, 1)}
                        className="w-8 h-8 rounded-xl bg-orange-600 text-white text-sm font-bold flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer shadow-sm"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-sm sm:text-base font-black text-white w-14 text-right">
                      ₹{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Fixed Area: Bill Breakdown + Payment Tabs + Cash + Punch Order */}
          <div className="shrink-0 space-y-2 pt-2 border-t border-[#303030]">
            {/* Clean Bill Breakdown */}
            <div className="p-2.5 rounded-2xl bg-[#161618] border border-[#303030] space-y-1 text-xs font-mono">
              <div className="flex justify-between text-zinc-400 font-medium text-[11px]">
                <span>Items Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400 font-medium text-[11px]">
                <span>Restaurant GST (5%):</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#303030] font-black text-base sm:text-lg text-orange-400">
                <span className="font-sans text-xs sm:text-sm">Total Payable:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Tender Tabs */}
            <div className="space-y-1.5">
              <div className="grid grid-cols-4 gap-1">
                {[
                  { mode: "Cash", label: "Cash", icon: Banknote },
                  { mode: "GPay / UPI", label: "UPI", icon: Smartphone },
                  { mode: "Card / POS", label: "Card", icon: CreditCard },
                  { mode: "Split Payment", label: "Split", icon: Split },
                ].map((pm) => (
                  <button
                    key={pm.mode}
                    type="button"
                    onClick={() => setPaymentMode(pm.mode as any)}
                    className={cn(
                      "py-2 px-1 rounded-xl text-[11px] font-black border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer",
                      paymentMode === pm.mode
                        ? "bg-gradient-to-br from-orange-600/30 to-amber-600/30 border-orange-500 text-orange-300 shadow-sm scale-[1.02]"
                        : "bg-[#161618] border-[#303030] text-zinc-400 hover:border-orange-500/40 hover:text-white"
                    )}
                  >
                    <pm.icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Tender & Change Due Calculator */}
            {paymentMode === "Cash" && (
              <div className="p-2.5 rounded-2xl bg-[#161618] border border-[#303030] space-y-2">
                {/* 1-Tap Cash Currency Pills */}
                <div className="grid grid-cols-4 gap-1">
                  {[100, 200, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setCashTendered(amt.toString())}
                      className={cn(
                        "py-1.5 rounded-xl border text-xs font-mono font-black transition-all cursor-pointer text-center",
                        cashTendered === amt.toString()
                          ? "bg-orange-600 text-white border-orange-500 shadow-sm"
                          : "bg-[#1f1f1f] border-[#303030] text-zinc-300 hover:bg-[#252525] hover:text-white"
                      )}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                {/* Custom Cash Received Input & Change Due Display */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#303030] items-center">
                  <div>
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">
                      Cash Received (₹)
                    </span>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      className="w-full h-9 px-2.5 rounded-xl bg-[#1f1f1f] border border-[#383838] text-sm font-mono font-black text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div className="p-2 rounded-xl bg-[#1f1f1f] border border-[#303030] text-right">
                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">
                      Change Due
                    </span>
                    <span className={cn(
                      "text-base sm:text-lg font-black font-mono block",
                      changeDue > 0 ? "text-orange-400" : "text-zinc-500"
                    )}>
                      ₹{changeDue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Split-Tender Multi-Pay Interface */}
            {paymentMode === "Split Payment" && (
              <div className="p-2.5 rounded-2xl bg-[#161618] border border-orange-500/40 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-orange-400 mb-0.5">1. Cash (₹)</label>
                    <input
                      type="number"
                      value={splitCash}
                      onChange={(e) => setSplitCash(e.target.value)}
                      className="w-full h-8 px-2 rounded-xl bg-[#1f1f1f] border border-orange-500/40 text-xs font-mono font-bold text-white focus:outline-none focus:border-orange-500"
                      placeholder="e.g. 200"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-[9px] font-bold text-blue-400">2. Digital (₹)</label>
                      <select
                        value={splitDigitalType}
                        onChange={(e) => setSplitDigitalType(e.target.value as any)}
                        className="text-[8px] bg-[#1f1f1f] border border-blue-500/30 text-blue-300 rounded px-1"
                      >
                        <option value="GPay / UPI">UPI</option>
                        <option value="Card / POS">Card</option>
                      </select>
                    </div>
                    <input
                      type="number"
                      value={splitDigital}
                      onChange={(e) => setSplitDigital(e.target.value)}
                      className="w-full h-8 px-2 rounded-xl bg-[#1f1f1f] border border-blue-500/40 text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                      placeholder="Remainder"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic UPI Trigger */}
            {paymentMode === "GPay / UPI" && (
              <div className="p-2.5 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="text-blue-400 font-bold block text-[11px]">Dynamic UPI QR</span>
                  <span className="text-[9px] text-zinc-400 font-mono">irani.koyla.mohak@hdfcbank</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUpiQrModal(true)}
                  className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-500/40 cursor-pointer hover:bg-blue-500/30"
                >
                  Scan QR
                </button>
              </div>
            )}

            {/* Main Punch & Print Button */}
            <Button
              type="submit"
              disabled={cart.length === 0}
              className="w-full h-12 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:opacity-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-orange-600/30 gap-2 cursor-pointer transition-all disabled:opacity-40"
            >
              <Printer className="w-4 h-4" />
              <span>Punch Order & Print KOT</span>
            </Button>
          </div>
        </form>
      </div>

      {/* ── MODAL: Authentic Realistic Paper Receipt KOT & Bill ─────────────────────── */}
      {showKotModal && completedOrder && (
        <Dialog open={true} onOpenChange={setShowKotModal}>
          <DialogContent className="max-w-sm bg-transparent border-0 text-zinc-900 p-0 shadow-none overflow-visible">
            {/* Realistic Thermal Paper Receipt Container */}
            <div className="bg-[#fcfbf7] rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] border border-zinc-300/80 p-6 font-mono text-xs text-zinc-900 relative overflow-hidden">
              {/* Paper Jagged Top Tear Effect */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[radial-gradient(circle,_transparent_3px,_#fcfbf7_3px)] bg-[length:10px_10px] -mt-1" />

              {/* Receipt Header */}
              <div className="text-center pb-3 border-b-2 border-dashed border-zinc-400 space-y-1">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-600 flex items-center justify-center mx-auto mb-1">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black tracking-tight text-zinc-950">
                  IRANI KOYLA SHAWARMA
                </h3>
                <p className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider">
                  {currentOutlet.name}
                </p>
                <p className="text-[10px] text-zinc-600">
                  Shop 1-2, Mohak City Boulevard, Mumbai
                </p>
                <p className="text-[10px] text-zinc-600">
                  GSTIN: <span className="font-bold">27AABCI4920F1ZV</span> | FSSAI: <span className="font-bold">11524008000492</span>
                </p>
              </div>

              {/* Order Meta Info */}
              <div className="py-2.5 border-b border-dashed border-zinc-300 text-[11px] space-y-1">
                <div className="flex justify-between font-bold text-zinc-950">
                  <span>Order: {completedOrder.orderNumber}</span>
                  <span>{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-zinc-600 text-[10px]">
                  <span>Date: {new Date().toLocaleDateString("en-IN")}</span>
                  <span>Time: {completedOrder.time}</span>
                </div>
                <div className="flex justify-between text-zinc-600 text-[10px]">
                  <span>Cashier: Imran S.</span>
                  <span>POS: Terminal #01</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="py-3 border-b-2 border-dashed border-zinc-400 space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-zinc-700 border-b border-zinc-300 pb-1">
                  <span className="w-1/2">Item</span>
                  <span className="w-12 text-center">Qty</span>
                  <span className="w-16 text-right">Rate</span>
                  <span className="w-16 text-right">Amount</span>
                </div>

                {completedOrder.items.map((it: any, i: number) => (
                  <div key={i} className="flex justify-between text-[11px] text-zinc-900 leading-tight">
                    <span className="w-1/2 font-bold truncate pr-1">{it.name}</span>
                    <span className="w-12 text-center font-bold">{it.quantity}</span>
                    <span className="w-16 text-right text-zinc-600">₹{it.price}</span>
                    <span className="w-16 text-right font-bold">₹{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Taxes & Bill Totals */}
              <div className="py-2.5 border-b-2 border-zinc-900 space-y-1 text-[11px]">
                <div className="flex justify-between text-zinc-700">
                  <span>Subtotal:</span>
                  <span>₹{completedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 text-[10px]">
                  <span>CGST (2.5%):</span>
                  <span>₹{(completedOrder.gstAmount / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 text-[10px]">
                  <span>SGST (2.5%):</span>
                  <span>₹{(completedOrder.gstAmount / 2).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-black text-zinc-950 pt-2 border-t border-dashed border-zinc-300">
                  <span>NET TOTAL:</span>
                  <span>₹{completedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Settlement & Change */}
              <div className="py-2.5 border-b border-dashed border-zinc-400 text-[11px] space-y-1">
                <div className="flex justify-between font-bold text-zinc-800">
                  <span>Payment Mode:</span>
                  <span className="uppercase">{completedOrder.paymentMethod}</span>
                </div>

                {completedOrder.paymentMethod === "Cash" && (
                  <>
                    <div className="flex justify-between text-zinc-700">
                      <span>Cash Received:</span>
                      <span>₹{parseFloat(completedOrder.cashTendered).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-black text-emerald-800 text-xs pt-1 border-t border-zinc-200">
                      <span>CHANGE RETURNED:</span>
                      <span>₹{completedOrder.changeDue.toFixed(2)}</span>
                    </div>
                  </>
                )}

                {completedOrder.paymentMethod === "Split Payment" && (
                  <div className="text-[10px] text-zinc-600">
                    <span>Split Paid: Cash + Digital Settled</span>
                  </div>
                )}
              </div>

              {/* Barcode & Footer */}
              <div className="pt-3 text-center space-y-1.5">
                {/* Barcode representation */}
                <div className="h-7 w-48 mx-auto bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_4px,#000_4px,#000_7px,transparent_7px,transparent_9px)] opacity-80" />
                <p className="text-[10px] text-zinc-500 font-mono tracking-widest">{completedOrder.orderNumber}-KOT-VERIFIED</p>

                <p className="text-xs font-black text-zinc-900 uppercase pt-1">
                  *** THANK YOU! VISIT AGAIN ***
                </p>
                <p className="text-[9px] text-zinc-500">
                  Authentic Koyla Charcoal Shawarmas &bull; Fresh Daily
                </p>
              </div>

              {/* Paper Jagged Bottom Tear Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[radial-gradient(circle,_transparent_3px,_#fcfbf7_3px)] bg-[length:10px_10px] -mb-1" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-3">
              <Button
                type="button"
                onClick={() => window.print()}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase h-11 rounded-2xl gap-2 shadow-lg cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Slip</span>
              </Button>

              <Button
                type="button"
                onClick={() => setShowKotModal(false)}
                className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-95 text-white font-black text-xs uppercase h-11 rounded-2xl shadow-lg shadow-orange-600/30 cursor-pointer"
              >
                Done & Next (1-Tap)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ── MODAL: Dynamic UPI QR Code ────────────────────────────────── */}
      {showUpiQrModal && (
        <Dialog open={true} onOpenChange={setShowUpiQrModal}>
          <DialogContent className="max-w-xs bg-[#1f1f1f] border border-[#303030] text-white p-6 rounded-3xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-black text-white">Scan & Pay via UPI</h3>
              <p className="text-xs text-zinc-400 mt-0.5">GPay, PhonePe, Paytm, BHIM</p>
            </div>

            {/* Generated QR Placeholder Container */}
            <div className="p-4 bg-white rounded-2xl w-44 h-44 mx-auto flex items-center justify-center shadow-lg">
              <div className="w-36 h-36 border-4 border-dashed border-zinc-900 rounded-xl flex flex-col items-center justify-center p-2 text-zinc-900 text-center">
                <QrCode className="w-12 h-12 text-zinc-900 mb-1" />
                <span className="text-[10px] font-black font-mono">₹{grandTotal.toFixed(2)}</span>
                <span className="text-[8px] font-bold text-zinc-600 uppercase">Irani Koyla Shawarma</span>
              </div>
            </div>

            <p className="text-[11px] font-mono text-blue-400 font-bold">
              Amount: ₹{grandTotal.toFixed(2)}
            </p>

            <Button
              type="button"
              onClick={() => setShowUpiQrModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase rounded-xl cursor-pointer"
            >
              Payment Received
            </Button>
          </DialogContent>
        </Dialog>
      )}

      {/* ── MODAL: Parked Bills Recall ────────────────────────────────── */}
      {showParkedModal && (
        <Dialog open={true} onOpenChange={setShowParkedModal}>
          <DialogContent className="max-w-md bg-[#1f1f1f] border border-[#303030] text-white p-5 rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-base font-black text-white flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-orange-500" />
                <span>Held / Parked Bills ({parkedBills.length})</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-2 mt-3 max-h-64 overflow-y-auto">
              {parkedBills.map((bill) => (
                <div
                  key={bill.id}
                  className="p-3 rounded-2xl bg-[#161618] border border-[#303030] flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-sm text-white block">{bill.customerName}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {bill.cart.length} items &middot; Parked at {bill.time}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleRecallBill(bill)}
                    className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Resume Bill
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
