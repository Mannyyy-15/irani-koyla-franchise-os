"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  Volume2,
  VolumeX,
  Keyboard,
  Zap,
} from "lucide-react";
import { useFranchise } from "@/lib/franchise-context";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { cn } from "@/components/ui/cn";

// Web Audio API Synthesizer (Instant, 0 asset latency, crisp haptic sound feedback)
const playAudioEffect = (type: "tap" | "success" | "park" | "clear" | "mode", soundEnabled: boolean = true) => {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "tap") {
      // Crisp mechanical pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } else if (type === "mode") {
      // Subtle mode selection blip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.03); // A5
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "success") {
      // Cash Register Register Dual Chime (Harmonized high triad C6 -> E6 -> G6)
      const playTone = (freq: number, delay: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.14, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + dur);
      };
      playTone(1046.5, 0, 0.12);    // C6
      playTone(1318.5, 0.07, 0.22); // E6
      playTone(1567.98, 0.14, 0.35); // G6
    } else if (type === "park") {
      // Soft ascending park chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === "clear") {
      // Low dismissal sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    }
  } catch {}
};

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
    breadType: m.breadType,
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
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

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

  // Keyboard Navigation & Fast Focus States
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [focusedCardIndex, setFocusedCardIndex] = useState<number>(0);
  const [instantPunchToast, setInstantPunchToast] = useState<{
    show: boolean;
    orderNumber: string;
    amount: number;
    paymentMethod: string;
  } | null>(null);

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
  const [showCashModal, setShowCashModal] = useState(false);
  const [offlineQueuedToast, setOfflineQueuedToast] = useState(false);
  const cashModalInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { name: "Most Ordered", icon: "⭐" },
    { name: "All Items", icon: "🔥" },
    { name: "Koyla Shawarma", icon: "🌯" },
    { name: "Rumali Shawarma", icon: "🫓" },
    { name: "Open Salad", icon: "🥗" },
    { name: "Shawarma Platter", icon: "🍽️" },
    { name: "Irani Chai & Drinks", icon: "☕" },
  ];

  const filteredMenuItems = activePosItems.filter((item) => {
    let matchesCat = false;
    if (activeCategory === "All Items") {
      matchesCat = true;
    } else if (activeCategory === "Most Ordered") {
      matchesCat = item.popularRank <= 6 || ["pos-iks-01", "pos-iks-02", "pos-iks-03", "pos-irs-01", "pos-ios-01", "pos-isp-01"].includes(item.id);
    } else if (activeCategory === "Koyla Shawarma") {
      matchesCat = item.breadType === "Khubz (Lebanese)" && item.category === "Shawarma Wraps";
    } else if (activeCategory === "Rumali Shawarma") {
      matchesCat = item.breadType === "Rumali Roti" && item.category === "Shawarma Wraps";
    } else if (activeCategory === "Open Salad") {
      matchesCat = item.name.includes("Open Salad");
    } else if (activeCategory === "Shawarma Platter") {
      matchesCat = item.name.includes("Platter") || item.category === "Platters & Dips";
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
    playAudioEffect("tap", soundEnabled);
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
    playAudioEffect("tap", soundEnabled);
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
    playAudioEffect("tap", soundEnabled);
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
    playAudioEffect("clear", soundEnabled);
    setCart([]);
  };

  const handleParkBill = () => {
    if (cart.length === 0) return;
    playAudioEffect("park", soundEnabled);
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
    playAudioEffect("park", soundEnabled);
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

  const handlePunchOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

    playAudioEffect("success", soundEnabled);
    addLiveOrder(orderPayload);
    setCompletedOrder({
      ...orderPayload,
      subtotal,
      gstAmount,
      cashTendered: paymentMode === "Split Payment" ? splitCash : cashTendered,
      changeDue: paymentMode === "Split Payment" ? 0 : changeDue,
    });

    // Auto-trigger direct thermal receipt print without blocking cashier
    if (typeof window !== "undefined") {
      try {
        window.print();
      } catch {}
    }

    setInstantPunchToast({
      show: true,
      orderNumber: orderNum,
      amount: grandTotal,
      paymentMethod: paymentMode,
    });
    setTimeout(() => {
      setInstantPunchToast(null);
    }, 3500);

    setShowCashModal(false);
    setCart([]);
    setCustomerToken(`Counter Order #${Math.floor(10 + Math.random() * 80)}`);
  };

  const handleInitiatePunch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return;

    if (paymentMode === "Cash") {
      const currentCashVal = parseFloat(cashTendered) || 0;
      if (currentCashVal < grandTotal) {
        const roundedDefault = Math.max(grandTotal, Math.ceil(grandTotal / 100) * 100);
        setCashTendered(roundedDefault.toString());
      }
      setShowCashModal(true);
      setTimeout(() => {
        cashModalInputRef.current?.focus();
        cashModalInputRef.current?.select();
      }, 50);
      return;
    }

    handlePunchOrder();
  };

  // Direct One-Click Thermal ESC/POS Print
  const handleDirectPrint = () => {
    playAudioEffect("tap", soundEnabled);
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Global Keyboard Shortcuts (Tab to Search, Arrow Keys, Space/+, Backspace, Enter, F1-F4, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

      // Tab Key: Instantly jump into search bar
      if (e.key === "Tab") {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
          playAudioEffect("tap", soundEnabled);
        }
        return;
      }

      // Function Keys: F1 (Cash), F2 (UPI), F3 (Card), F4 (Split)
      if (e.key === "F1") {
        e.preventDefault();
        setPaymentMode("Cash");
        playAudioEffect("mode", soundEnabled);
        return;
      }
      if (e.key === "F2") {
        e.preventDefault();
        setPaymentMode("GPay / UPI");
        playAudioEffect("mode", soundEnabled);
        return;
      }
      if (e.key === "F3") {
        e.preventDefault();
        setPaymentMode("Card / POS");
        playAudioEffect("mode", soundEnabled);
        return;
      }
      if (e.key === "F4") {
        e.preventDefault();
        setPaymentMode("Split Payment");
        playAudioEffect("mode", soundEnabled);
        return;
      }

      // Arrow Keys navigation over food items
      if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
        if (!isInput || document.activeElement === searchInputRef.current) {
          e.preventDefault();
          if (document.activeElement === searchInputRef.current && (e.key === "ArrowDown" || e.key === "ArrowRight")) {
            searchInputRef.current?.blur();
          }
          const totalItems = filteredMenuItems.length;
          if (totalItems === 0) return;

          setFocusedCardIndex((prev) => {
            let nextIndex = prev;
            if (e.key === "ArrowRight") {
              nextIndex = (prev + 1) % totalItems;
            } else if (e.key === "ArrowLeft") {
              nextIndex = (prev - 1 + totalItems) % totalItems;
            } else if (e.key === "ArrowDown") {
              nextIndex = Math.min(totalItems - 1, prev + 4);
            } else if (e.key === "ArrowUp") {
              nextIndex = Math.max(0, prev - 4);
            }
            playAudioEffect("tap", soundEnabled);
            return nextIndex;
          });
          return;
        }
      }

      // Space or '+' key to add currently focused item to basket
      if ((e.key === " " || e.key === "+") && !isInput && !showCashModal) {
        e.preventDefault();
        const currentItem = filteredMenuItems[focusedCardIndex];
        if (currentItem) {
          addToCart(currentItem);
        }
        return;
      }

      // Backspace or '-' key to remove/decrement currently focused item from basket (when not in text input)
      if ((e.key === "Backspace" || e.key === "-") && !isInput && !showCashModal) {
        e.preventDefault();
        const currentItem = filteredMenuItems[focusedCardIndex];
        if (currentItem) {
          removeFromCart(currentItem.id);
        }
        return;
      }

      // Escape: Close modals or clear cart / blur search
      if (e.key === "Escape") {
        if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur();
          return;
        }
        if (showCashModal) {
          setShowCashModal(false);
          return;
        }
        if (showKotModal) {
          setShowKotModal(false);
          return;
        }
        if (showParkedModal) {
          setShowParkedModal(false);
          return;
        }
        if (showUpiQrModal) {
          setShowUpiQrModal(false);
          return;
        }
        if (cart.length > 0) {
          clearCart();
          return;
        }
      }

      // 'P' or 'p' to park bill or open parked bills modal
      if ((e.key === "p" || e.key === "P") && !isInput && !showCashModal) {
        e.preventDefault();
        if (cart.length > 0) {
          handleParkBill();
        } else if (parkedBills.length > 0) {
          setShowParkedModal(true);
        }
        return;
      }

      // Enter: Instant Direct Punch Order or Open Cash Tender Modal
      if (e.key === "Enter") {
        if (showCashModal) {
          e.preventDefault();
          handlePunchOrder();
          return;
        }
        if (document.activeElement === searchInputRef.current) {
          // Blur search and add the top matched item or focus grid
          searchInputRef.current?.blur();
          if (filteredMenuItems.length > 0 && cart.length === 0) {
            addToCart(filteredMenuItems[0]);
            return;
          }
        }
        if (showKotModal) {
          e.preventDefault();
          handleDirectPrint();
          return;
        }
        if (cart.length > 0) {
          e.preventDefault();
          handleInitiatePunch();
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, paymentMode, showKotModal, showParkedModal, showUpiQrModal, showCashModal, parkedBills, soundEnabled, grandTotal, splitRemaining, filteredMenuItems, focusedCardIndex, cashTendered]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 relative items-start pb-6" suppressHydrationWarning>
      {/* Instant Direct Punch Success Floating Banner */}
      {instantPunchToast && instantPunchToast.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 p-4 px-6 rounded-2xl bg-[#1a1a1c] border border-emerald-500/60 text-white font-bold shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-emerald-400">Order {instantPunchToast.orderNumber} Punched!</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                {instantPunchToast.paymentMethod} · ₹{instantPunchToast.amount}
              </span>
            </div>
            <span className="text-[11px] text-zinc-300 block mt-0.5">Receipt automatically dispatched to thermal ESC/POS printer.</span>
          </div>
        </div>
      )}

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
      <div className="lg:col-span-7 xl:col-span-8 space-y-2.5 min-w-0">
        {/* Category Filters Bar & Fast Search + Sound & Hotkeys Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-64 xl:w-72 shrink-0">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search or Press Tab..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-12 rounded-2xl bg-[#1f1f1f] border border-[#303030] text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors font-medium shadow-inner"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-[#2a2a2e] text-[9px] text-zinc-400 font-mono border border-[#383838]">
                Tab
              </kbd>
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
                  if (cat.name === "Most Ordered") return i.popularRank <= 6 || ["pos-iks-01", "pos-iks-02", "pos-iks-03", "pos-irs-01", "pos-ios-01", "pos-isp-01"].includes(i.id);
                  if (cat.name === "Koyla Shawarma") return i.breadType === "Khubz (Lebanese)" && i.category === "Shawarma Wraps";
                  if (cat.name === "Rumali Shawarma") return i.breadType === "Rumali Roti" && i.category === "Shawarma Wraps";
                  if (cat.name === "Open Salad") return i.name.includes("Open Salad");
                  if (cat.name === "Shawarma Platter") return i.name.includes("Platter") || i.category === "Platters & Dips";
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

            {/* Sound Toggle Button */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={cn(
                "h-8 px-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer",
                soundEnabled
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                  : "bg-[#1f1f1f] border-[#303030] text-zinc-500 hover:text-zinc-300"
              )}
              title={soundEnabled ? "POS Sound Enabled (Click to Mute)" : "POS Sound Muted (Click to Enable)"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden md:inline text-[10px]">{soundEnabled ? "Sound ON" : "Muted"}</span>
            </button>
          </div>
        </div>

        {/* Fast Cashier Keyboard Hotkeys Bar */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#161618] border border-[#303030] text-[10px] font-mono text-zinc-400 justify-between select-none shadow-sm">
          <div className="flex items-center gap-1.5 font-bold">
            <Keyboard className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-zinc-300 uppercase tracking-wider text-[9px]">Cashier Hotkeys:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-[10px]">
            <span className="bg-[#1f1f1f] px-1.5 py-0.5 rounded border border-[#383838] text-zinc-300"><strong className="text-orange-400">Tab</strong> Search</span>
            <span className="bg-[#1f1f1f] px-1.5 py-0.5 rounded border border-[#383838] text-zinc-300"><strong className="text-orange-400">← ↑ ↓ →</strong> Select</span>
            <span className="bg-[#1f1f1f] px-1.5 py-0.5 rounded border border-[#383838] text-zinc-300"><strong className="text-orange-400">Space/+</strong> Add</span>
            <span className="bg-[#1f1f1f] px-1.5 py-0.5 rounded border border-[#383838] text-zinc-300"><strong className="text-rose-400">Backspace</strong> Remove</span>
            <span className="bg-[#1f1f1f] px-1.5 py-0.5 rounded border border-[#383838] text-zinc-300"><strong className="text-amber-400">F1</strong> Cash</span>
            <span className="bg-[#1f1f1f] px-1.5 py-0.5 rounded border border-[#383838] text-zinc-300"><strong className="text-amber-400">F2</strong> UPI</span>
            <span className="bg-[#1f1f1f] px-1.5 py-0.5 rounded border border-[#383838] text-zinc-300"><strong className="text-amber-400">F3</strong> Card</span>
            <span className="bg-[#1f1f1f] px-1.5 py-0.5 rounded border border-[#383838] text-zinc-300"><strong className="text-emerald-400">Enter</strong> Punch</span>
            <span className="bg-[#1f1f1f] px-1.5 py-0.5 rounded border border-[#383838] text-zinc-300"><strong className="text-zinc-400">Esc</strong> Clear</span>
          </div>
        </div>

        {/* Big Food Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
          {filteredMenuItems.map((item, index) => {
            const inCartQty = getItemCartQuantity(item.id);
            const isKeyFocused = focusedCardIndex === index;

            return (
              <div
                key={item.id}
                onClick={() => {
                  setFocusedCardIndex(index);
                  addToCart(item);
                }}
                className={cn(
                  "group relative rounded-3xl bg-[#1f1f1f] border overflow-hidden transition-all duration-200 cursor-pointer shadow-md flex flex-col justify-between select-none",
                  isKeyFocused
                    ? "border-orange-500 ring-2 ring-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.45)] scale-[1.02] z-10"
                    : inCartQty > 0
                    ? "border-orange-500 bg-[#25201d] ring-1 ring-orange-500/50 shadow-orange-600/20"
                    : "border-[#303030] hover:border-orange-500/80"
                )}
              >
                {/* Keyboard Focus Tag */}
                {isKeyFocused && (
                  <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-black/85 backdrop-blur-md text-orange-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded-lg border border-orange-500/50 shadow-lg">
                    <Keyboard className="w-2.5 h-2.5" />
                    <span>Space to Add</span>
                  </div>
                )}

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
                        onClick={(e) => {
                          e.stopPropagation();
                          setFocusedCardIndex(index);
                          addToCart(item);
                        }}
                        className="h-8 px-3 rounded-xl bg-[#2a2a2a] hover:bg-orange-600 text-zinc-200 hover:text-white text-xs font-bold flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
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
        <form onSubmit={handleInitiatePunch} className="flex flex-col justify-between overflow-hidden rounded-3xl bg-[#1f1f1f] border border-[#303030] p-3.5 sm:p-4 shadow-2xl space-y-2.5 max-h-[calc(100vh-5.5rem)]">
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
            {/* Realistic Thermal Paper Receipt Container with Print ID */}
            <div
              id="thermal-print-receipt"
              className="bg-[#fcfbf7] rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] border border-zinc-300/80 p-6 font-mono text-xs text-zinc-900 relative overflow-hidden"
            >
              {/* Paper Jagged Top Tear Effect */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[radial-gradient(circle,_transparent_3px,_#fcfbf7_3px)] bg-[length:10px_10px] -mt-1 print:hidden" />

              {/* Receipt Header */}
              <div className="text-center pb-3 border-b-2 border-dashed border-zinc-400 space-y-1">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-600 flex items-center justify-center mx-auto mb-1 print:hidden">
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
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-[radial-gradient(circle,_transparent_3px,_#fcfbf7_3px)] bg-[length:10px_10px] -mb-1 print:hidden" />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3">
              <div className="flex gap-2.5">
                <Button
                  type="button"
                  onClick={handleDirectPrint}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs uppercase h-11 rounded-2xl gap-2 shadow-lg cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-orange-400" />
                  <span>1-Click Thermal Print (80mm/58mm)</span>
                </Button>

                <Button
                  type="button"
                  onClick={() => setShowKotModal(false)}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-95 text-white font-black text-xs uppercase h-11 rounded-2xl shadow-lg shadow-orange-600/30 cursor-pointer"
                >
                  Done & Next (1-Tap)
                </Button>
              </div>
              <p className="text-[10px] text-center text-zinc-400 font-mono">
                Press <strong className="text-white">Enter</strong> to Print Slip &bull; <strong className="text-white">Esc</strong> to dismiss
              </p>
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

      {/* ── MODAL: Cash Received & Change Due Popup ────────────────────── */}
      {showCashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl bg-[#18181b] border border-[#383838] p-6 shadow-2xl space-y-5 text-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2d2d30] pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Cash Tender & Change Due</h3>
                  <span className="text-xs text-zinc-400">Press Enter to Confirm & Print Receipt</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCashModal(false)}
                className="w-7 h-7 rounded-lg bg-[#27272a] hover:bg-[#333] text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bill Total Banner */}
            <div className="p-4 rounded-2xl bg-[#202024] border border-[#303030] flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bill Amount</span>
              <span className="font-mono text-2xl font-black text-orange-400">₹{grandTotal.toFixed(2)}</span>
            </div>

            {/* Cash Received Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                <span>Cash Received from Customer (₹)</span>
                <span className="text-[10px] text-zinc-500 font-mono">Type or tap preset</span>
              </label>
              <input
                ref={cashModalInputRef}
                type="number"
                min="0"
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handlePunchOrder();
                  }
                }}
                className="w-full h-12 px-4 rounded-2xl bg-[#121214] border-2 border-emerald-500/60 text-emerald-400 font-mono text-xl font-black focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
              />

              {/* Quick Note Presets */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[
                  { label: "Exact", val: grandTotal },
                  { label: "₹100", val: 100 },
                  { label: "₹200", val: 200 },
                  { label: "₹500", val: 500 },
                  { label: "₹2000", val: 2000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setCashTendered(preset.val.toString());
                      cashModalInputRef.current?.focus();
                    }}
                    className={cn(
                      "py-1.5 rounded-xl border text-xs font-mono font-black transition-all cursor-pointer text-center",
                      parseFloat(cashTendered) === preset.val
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-md"
                        : "bg-[#202024] border-[#383838] text-zinc-300 hover:bg-[#28282c] hover:text-white"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Change Due Big Display */}
            <div className="p-4 rounded-2xl bg-[#121214] border border-[#303030] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-400 block">Change to Return</span>
                <span className="text-[10px] text-zinc-500">Hand back to customer</span>
              </div>
              <span className={cn(
                "font-mono text-2xl sm:text-3xl font-black",
                changeDue > 0 ? "text-emerald-400" : "text-zinc-500"
              )}>
                ₹{changeDue.toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowCashModal(false)}
                className="px-4 py-2.5 rounded-xl bg-[#27272a] hover:bg-[#333] text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel (Esc)
              </button>
              <button
                type="button"
                onClick={() => handlePunchOrder()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Confirm & Print Bill (Enter)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
