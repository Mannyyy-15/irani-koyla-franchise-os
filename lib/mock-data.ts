export interface Outlet {
  id: string;
  name: string;
  code: string;
  city: string;
  area: string;
  address: string;
  status: "active" | "onboarding" | "suspended";
  dailyTargetSales: number;
  dailyTargetWraps: number;
  currentDaySales: number;
  currentDayWraps: number;
  spitEfficiency: number; // percentage, e.g. 94.2
  activeSpits: number;
  totalSpits: number;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  managerName: string;
  managerPhone: string;
  fssaiNumber: string;
  fssaiExpiry: string;
  lastAuditScore: number; // percentage, e.g. 96
  gstin: string;
  openedAt: string;
  loginEmail?: string;
  loginPassword?: string;
  magicLoginToken?: string;
  franchiseFeeAmount?: number;
  franchiseFeeStatus?: "paid" | "partial" | "pending";
  securityDepositAmount?: number;
  royaltyRatePercent?: number;
  marketingFeePercent?: number;
  territoryRadiusKm?: number;
  agreementTermYears?: number;
  whatsappNumber?: string;
  panOrAadhaar?: string;
}

export interface MeatBatch {
  id: string;
  batchNumber: string;
  outletId: string;
  outletName: string;
  meatType: "Koyla Marinated Chicken" | "Smoked Charcoal Mutton" | "Special Spiced Chicken";
  spitId: string;
  date: string;
  timeLoaded: string;
  rawMeatReceivedKg: number;
  marinationLossKg: number;
  skewerWeightKg: number; // Net meat loaded on spit
  cookedWeightKg: number; // Meat carved
  wrapsProduced: number;
  jumboWrapsProduced: number;
  plattersProduced: number;
  wasteScrapsKg: number;
  targetYieldKg: number;
  actualYieldPercent: number; // e.g. 93.4%
  coreTempCelsius: number; // target >= 75°C
  status: "roasting" | "carving" | "completed" | "flagged";
  loggedBy: string;
  notes?: string;
}

export interface ShiftRegister {
  id: string;
  outletId: string;
  outletName: string;
  date: string;
  shiftType: "Morning Shift (11:00 AM - 05:00 PM)" | "Evening Shift (05:00 PM - 01:00 AM)";
  cashierName: string;
  openingCash: number;
  cashSalesExpected: number;
  cashInDrawerActual: number;
  cashDifference: number; // Actual - Expected
  upiSales: number; // PhonePe, GPay, Paytm
  swiggySales: number;
  zomatoSales: number;
  posCardSales: number;
  pettyCashExpenses: number;
  totalOrders: number;
  totalGrossSales: number;
  discountsGiven: number;
  netRevenue: number;
  status: "open" | "reconciled" | "variance_flagged";
  varianceReason?: string;
  reconciledAt?: string;
}

export interface RoyaltyStatement {
  id: string;
  invoiceNumber: string;
  outletId: string;
  outletName: string;
  month: string; // e.g. "August 2026"
  grossSales: number;
  royaltyRatePercent: number; // 6.5%
  royaltyAmount: number;
  marketingFeePercent: number; // 2.0%
  marketingFeeAmount: number;
  centralKitchenSupplyCost: number;
  deductionsAndAdjustments: number;
  gstAmount: number; // 18% on royalty
  totalPayable: number;
  dueDate: string;
  status: "paid" | "pending" | "disputed" | "overdue";
  paidAt?: string;
  disputeReason?: string;
  disputeStatus?: "open" | "resolved" | "under_review";
}

export interface SplitPaymentDetail {
  cashAmount: number;
  digitalAmount: number;
  digitalMethod: "GPay / UPI" | "Card / POS";
}

export interface LiveOrder {
  id: string;
  orderNumber: string;
  date: string; // YYYY-MM-DD
  time: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  channel: "Walk-in Counter" | "Zomato" | "Swiggy";
  paymentMethod: "Cash" | "GPay / UPI" | "Card / POS" | "Split Payment";
  splitDetail?: SplitPaymentDetail;
  status: "Completed";
  customerName?: string;
  outletId: string;
}

export interface RiderPickupOrder {
  id: string;
  orderNumber: string;
  channel: "Zomato" | "Swiggy";
  customerName: string;
  items: { name: string; quantity: number }[];
  totalAmount: number;
  riderName: string;
  riderPhone: string;
  vehicleNumber: string;
  etaMinutes: number; // 0 = at counter, > 0 = mins away
  status: "Ready for Pickup" | "Rider Arrived" | "Preparing" | "Handed Over";
  otp: string; // 4-digit OTP
  bagToken: string; // e.g. "BAG-01"
  readyAtTime: string;
  handedOverAt?: string;
  outletId: string;
}

export interface PettyCashExpense {
  id: string;
  timestamp: string;
  amount: number;
  category: "Ice & Perishables" | "Fresh Herbs & Veg" | "Cleaning Supplies" | "Staff Refreshment" | "Emergency Packaging" | "Other";
  reason: string;
  paidBy: string;
  outletId: string;
}

export interface SafeDrop {
  id: string;
  timestamp: string;
  amount: number;
  authorizedBy: string;
  safeNumber: string;
  outletId: string;
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: "Present" | "On Leave" | "Late";
  checkInTime?: string;
  phone: string;
  avatar: string;
}

export interface ComplianceChecklist {
  id: string;
  outletId: string;
  outletName: string;
  date: string;
  inspectedBy: string;
  deepFreezerTemp: number; // target <= -18°C
  chillerTemp: number; // target 2°C - 4°C
  spitCoreTemp: number; // target >= 75°C
  oilPolarCompoundPercent: number; // target < 24% TPM
  fssaiDisplayVerified: boolean;
  staffHairnetsGloves: boolean;
  pestControlVerified: boolean;
  waterQualityTested: boolean;
  overallScore: number; // percentage
  status: "pass" | "requires_action" | "critical_fail";
  remarks: string;
}

export interface MenuItemRecipe {
  id: string;
  name: string;
  category: "Shawarma Wraps" | "Combos & Meals" | "Platters & Dips" | "Irani Chai & Drinks" | "Sides & Toum";
  meatPortionGrams: number;
  sauceGrams: number;
  breadType: "Khubz (Lebanese)" | "Rumali Roti" | "Samoli Bread" | "N/A";
  sellingPrice: number;
  cogsCost: number;
  grossMarginPercent: number;
  spitType: "Chicken" | "Mutton" | "Both" | "Beverage" | "Dip" | "Side";
  popularRank: number;
  active: boolean;
  image: string;
  meatWeight?: string;
  tag?: string;
  modifiers: string[];
}

export interface CentralShipment {
  id: string;
  shipmentNumber: string;
  outletId: string;
  outletName: string;
  dispatchedAt: string;
  deliveredAt?: string;
  status: "in_transit" | "delivered" | "preparing";
  chickenConesCount: number; // 30kg cones
  muttonConesCount: number; // 18kg cones
  totalMeatWeightKg: number;
  spiceMixBagsCount: number;
  toumJarsCount: number;
  vanVehicleNumber: string;
  driverName: string;
  driverPhone: string;
  temperatureCelsius: number; // target 2°C - 4°C
  securitySealNumber: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  outletName: string;
  user: string;
  role: string;
  action: string;
  module: "Yield" | "Sales" | "Royalty" | "Compliance" | "Pricing" | "SupplyChain" | "Operations";
  severity: "info" | "warning" | "critical";
  details: string;
}

// ── INITIAL DATASETS ────────────────────────────────────────────────────────

export const INITIAL_OUTLETS: Outlet[] = [];

export const INITIAL_MEAT_BATCHES: MeatBatch[] = [];

export const INITIAL_SHIFTS: ShiftRegister[] = [];

export const INITIAL_ROYALTIES: RoyaltyStatement[] = [];

export const INITIAL_COMPLIANCE: ComplianceChecklist[] = [];

export const INITIAL_MENU_ITEMS: MenuItemRecipe[] = [
  // ── IRANI KOYLA SHAWARMA (REGULAR / KHUBZ) ──────────────────────────────────
  {
    id: "pos-iks-01",
    name: "Irani Koyla Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 80,
    sauceGrams: 25,
    breadType: "Khubz (Lebanese)",
    sellingPrice: 80,
    cogsCost: 28,
    grossMarginPercent: 65.0,
    spitType: "Chicken",
    popularRank: 1,
    active: true,
    meatWeight: "80g",
    tag: "Original Classic",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Garlic Toum (+₹20)", "Spicy Peri-Peri (+₹15)", "Extra Meat (+₹30)"],
  },
  {
    id: "pos-iks-02",
    name: "Cheese Koyla Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 80,
    sauceGrams: 30,
    breadType: "Khubz (Lebanese)",
    sellingPrice: 90,
    cogsCost: 32,
    grossMarginPercent: 64.4,
    spitType: "Chicken",
    popularRank: 2,
    active: true,
    meatWeight: "80g",
    tag: "Cheese Glaze",
    image: "https://images.unsplash.com/photo-1561719450-48226060c50d?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Cheese (+₹20)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-iks-03",
    name: "Rumali Roti Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 90,
    sauceGrams: 30,
    breadType: "Rumali Roti",
    sellingPrice: 100,
    cogsCost: 34,
    grossMarginPercent: 66.0,
    spitType: "Chicken",
    popularRank: 3,
    active: true,
    meatWeight: "90g",
    tag: "Popular",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Garlic Toum (+₹20)", "Spicy Schezwan (+₹15)"],
  },
  {
    id: "pos-iks-04",
    name: "BBQ Chicken Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 85,
    sauceGrams: 30,
    breadType: "Khubz (Lebanese)",
    sellingPrice: 100,
    cogsCost: 35,
    grossMarginPercent: 65.0,
    spitType: "Chicken",
    popularRank: 4,
    active: true,
    meatWeight: "85g",
    tag: "Smokey BBQ",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra BBQ Sauce (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-iks-05",
    name: "Peri Peri Chicken Shawarma", 
    category: "Shawarma Wraps",
    meatPortionGrams: 85,
    sauceGrams: 30,
    breadType: "Khubz (Lebanese)",
    sellingPrice: 100,
    cogsCost: 35,
    grossMarginPercent: 65.0,
    spitType: "Chicken",
    popularRank: 5,
    active: true,
    meatWeight: "85g",
    tag: "Spicy Peri-Peri",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Peri Dust (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-iks-06",
    name: "Peri Peri Cheese Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 85,
    sauceGrams: 35,
    breadType: "Khubz (Lebanese)",
    sellingPrice: 120,
    cogsCost: 40,
    grossMarginPercent: 66.7,
    spitType: "Chicken",
    popularRank: 6,
    active: true,
    meatWeight: "85g",
    tag: "Cheesy & Spicy",
    image: "https://images.unsplash.com/photo-1561719450-48226060c50d?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Cheese (+₹20)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-iks-07",
    name: "Butter Chicken Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 90,
    sauceGrams: 35,
    breadType: "Khubz (Lebanese)",
    sellingPrice: 120,
    cogsCost: 42,
    grossMarginPercent: 65.0,
    spitType: "Chicken",
    popularRank: 7,
    active: true,
    meatWeight: "90g",
    tag: "Makhani Butter",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Butter (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-iks-08",
    name: "Schezwan Chicken Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 90,
    sauceGrams: 35,
    breadType: "Khubz (Lebanese)",
    sellingPrice: 120,
    cogsCost: 40,
    grossMarginPercent: 66.7,
    spitType: "Chicken",
    popularRank: 8,
    active: true,
    meatWeight: "90g",
    tag: "Desi Hot",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Spicy Schezwan (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-iks-09",
    name: "Overloaded Chicken Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 130,
    sauceGrams: 40,
    breadType: "Khubz (Lebanese)",
    sellingPrice: 130,
    cogsCost: 46,
    grossMarginPercent: 64.6,
    spitType: "Chicken",
    popularRank: 9,
    active: true,
    meatWeight: "130g",
    tag: "Double Meat",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Garlic Toum (+₹20)", "Extra Cheese (+₹20)"],
  },
  {
    id: "pos-iks-10",
    name: "Tandoori Chicken Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 90,
    sauceGrams: 35,
    breadType: "Khubz (Lebanese)",
    sellingPrice: 130,
    cogsCost: 44,
    grossMarginPercent: 66.2,
    spitType: "Chicken",
    popularRank: 10,
    active: true,
    meatWeight: "90g",
    tag: "Charcoal Tandoori",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Tandoori Sauce (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-iks-11",
    name: "Chipotle Chicken Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 90,
    sauceGrams: 35,
    breadType: "Khubz (Lebanese)",
    sellingPrice: 130,
    cogsCost: 44,
    grossMarginPercent: 66.2,
    spitType: "Chicken",
    popularRank: 11,
    active: true,
    meatWeight: "90g",
    tag: "Creamy Chipotle",
    image: "https://images.unsplash.com/photo-1561719450-48226060c50d?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Chipotle Sauce (+₹15)", "Extra Garlic Toum (+₹20)"],
  },

  // ── IRANI RUMALI SHAWARMA (LARGE RUMALI ROLLS) ──────────────────────────────
  {
    id: "pos-irs-01",
    name: "Irani Rumali Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 100,
    sauceGrams: 35,
    breadType: "Rumali Roti",
    sellingPrice: 100,
    cogsCost: 35,
    grossMarginPercent: 65.0,
    spitType: "Chicken",
    popularRank: 12,
    active: true,
    meatWeight: "100g",
    tag: "Rumali Classic",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Garlic Toum (+₹20)", "Extra Meat (+₹30)"],
  },
  {
    id: "pos-irs-02",
    name: "Cheese Rumali Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 100,
    sauceGrams: 40,
    breadType: "Rumali Roti",
    sellingPrice: 120,
    cogsCost: 42,
    grossMarginPercent: 65.0,
    spitType: "Chicken",
    popularRank: 13,
    active: true,
    meatWeight: "100g",
    tag: "Cheese Rumali",
    image: "https://images.unsplash.com/photo-1561719450-48226060c50d?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Cheese (+₹20)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-irs-03",
    name: "Butter Rumali Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 100,
    sauceGrams: 40,
    breadType: "Rumali Roti",
    sellingPrice: 120,
    cogsCost: 42,
    grossMarginPercent: 65.0,
    spitType: "Chicken",
    popularRank: 14,
    active: true,
    meatWeight: "100g",
    tag: "Butter Glaze",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Butter (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-irs-04",
    name: "Schezwan Rumali Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 100,
    sauceGrams: 40,
    breadType: "Rumali Roti",
    sellingPrice: 120,
    cogsCost: 40,
    grossMarginPercent: 66.7,
    spitType: "Chicken",
    popularRank: 15,
    active: true,
    meatWeight: "100g",
    tag: "Spicy Rumali",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Schezwan (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-irs-05",
    name: "BBQ Rumali Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 105,
    sauceGrams: 40,
    breadType: "Rumali Roti",
    sellingPrice: 130,
    cogsCost: 45,
    grossMarginPercent: 65.4,
    spitType: "Chicken",
    popularRank: 16,
    active: true,
    meatWeight: "105g",
    tag: "Smokey BBQ",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra BBQ Sauce (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-irs-06",
    name: "Tandoori Rumali Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 105,
    sauceGrams: 40,
    breadType: "Rumali Roti",
    sellingPrice: 130,
    cogsCost: 45,
    grossMarginPercent: 65.4,
    spitType: "Chicken",
    popularRank: 17,
    active: true,
    meatWeight: "105g",
    tag: "Tandoori Rumali",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Tandoori Sauce (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-irs-07",
    name: "Chipotle Rumali Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 105,
    sauceGrams: 40,
    breadType: "Rumali Roti",
    sellingPrice: 130,
    cogsCost: 45,
    grossMarginPercent: 65.4,
    spitType: "Chicken",
    popularRank: 18,
    active: true,
    meatWeight: "105g",
    tag: "Chipotle Rumali",
    image: "https://images.unsplash.com/photo-1561719450-48226060c50d?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Chipotle (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-irs-08",
    name: "Peri Peri Rumali Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 105,
    sauceGrams: 40,
    breadType: "Rumali Roti",
    sellingPrice: 130,
    cogsCost: 45,
    grossMarginPercent: 65.4,
    spitType: "Chicken",
    popularRank: 19,
    active: true,
    meatWeight: "105g",
    tag: "Peri Peri Rumali",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Peri Dust (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-irs-09",
    name: "Peri Rumali Cheese Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 110,
    sauceGrams: 45,
    breadType: "Rumali Roti",
    sellingPrice: 150,
    cogsCost: 52,
    grossMarginPercent: 65.3,
    spitType: "Chicken",
    popularRank: 20,
    active: true,
    meatWeight: "110g",
    tag: "Peri Cheese Giant",
    image: "https://images.unsplash.com/photo-1561719450-48226060c50d?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Cheese (+₹20)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-irs-10",
    name: "Overloaded Rumali Shawarma",
    category: "Shawarma Wraps",
    meatPortionGrams: 150,
    sauceGrams: 45,
    breadType: "Rumali Roti",
    sellingPrice: 150,
    cogsCost: 54,
    grossMarginPercent: 64.0,
    spitType: "Chicken",
    popularRank: 21,
    active: true,
    meatWeight: "150g",
    tag: "Mega Jumbo Rumali",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Meat (+₹30)", "Extra Garlic Toum (+₹20)"],
  },

  // ── IRANI OPEN SALAD (NO BREAD / SALAD BOWLS) ───────────────────────────────
  {
    id: "pos-ios-01",
    name: "Irani Open Salad",
    category: "Platters & Dips",
    meatPortionGrams: 130,
    sauceGrams: 40,
    breadType: "N/A",
    sellingPrice: 150,
    cogsCost: 48,
    grossMarginPercent: 68.0,
    spitType: "Chicken",
    popularRank: 22,
    active: true,
    meatWeight: "130g",
    tag: "Keto / Protein Bowl",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Add Khubz Bread (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-ios-02",
    name: "Cheese Open Salad",
    category: "Platters & Dips",
    meatPortionGrams: 130,
    sauceGrams: 45,
    breadType: "N/A",
    sellingPrice: 170,
    cogsCost: 55,
    grossMarginPercent: 67.6,
    spitType: "Chicken",
    popularRank: 23,
    active: true,
    meatWeight: "130g",
    tag: "Cheese Salad Bowl",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Cheese (+₹20)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-ios-03",
    name: "Butter Open Salad",
    category: "Platters & Dips",
    meatPortionGrams: 130,
    sauceGrams: 45,
    breadType: "N/A",
    sellingPrice: 170,
    cogsCost: 55,
    grossMarginPercent: 67.6,
    spitType: "Chicken",
    popularRank: 24,
    active: true,
    meatWeight: "130g",
    tag: "Butter Tossed",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Butter (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-ios-04",
    name: "Schezwan Open Salad",
    category: "Platters & Dips",
    meatPortionGrams: 130,
    sauceGrams: 45,
    breadType: "N/A",
    sellingPrice: 170,
    cogsCost: 54,
    grossMarginPercent: 68.2,
    spitType: "Chicken",
    popularRank: 25,
    active: true,
    meatWeight: "130g",
    tag: "Spicy Salad Bowl",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Schezwan (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-ios-05",
    name: "BBQ Open Salad",
    category: "Platters & Dips",
    meatPortionGrams: 130,
    sauceGrams: 45,
    breadType: "N/A",
    sellingPrice: 170,
    cogsCost: 55,
    grossMarginPercent: 67.6,
    spitType: "Chicken",
    popularRank: 26,
    active: true,
    meatWeight: "130g",
    tag: "Smokey BBQ Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra BBQ Sauce (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-ios-06",
    name: "Tandoori Open Salad",
    category: "Platters & Dips",
    meatPortionGrams: 130,
    sauceGrams: 45,
    breadType: "N/A",
    sellingPrice: 170,
    cogsCost: 55,
    grossMarginPercent: 67.6,
    spitType: "Chicken",
    popularRank: 27,
    active: true,
    meatWeight: "130g",
    tag: "Tandoori Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Tandoori Sauce (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-ios-07",
    name: "Chipotle Open Salad",
    category: "Platters & Dips",
    meatPortionGrams: 130,
    sauceGrams: 45,
    breadType: "N/A",
    sellingPrice: 170,
    cogsCost: 55,
    grossMarginPercent: 67.6,
    spitType: "Chicken",
    popularRank: 28,
    active: true,
    meatWeight: "130g",
    tag: "Chipotle Bowl",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Chipotle (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-ios-08",
    name: "Peri Peri Open Salad",
    category: "Platters & Dips",
    meatPortionGrams: 130,
    sauceGrams: 45,
    breadType: "N/A",
    sellingPrice: 170,
    cogsCost: 55,
    grossMarginPercent: 67.6,
    spitType: "Chicken",
    popularRank: 29,
    active: true,
    meatWeight: "130g",
    tag: "Peri Peri Bowl",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Peri Dust (+₹15)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-ios-09",
    name: "Peri Open Cheese Salad",
    category: "Platters & Dips",
    meatPortionGrams: 130,
    sauceGrams: 50,
    breadType: "N/A",
    sellingPrice: 170,
    cogsCost: 56,
    grossMarginPercent: 67.0,
    spitType: "Chicken",
    popularRank: 30,
    active: true,
    meatWeight: "130g",
    tag: "Peri Cheese Bowl",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Cheese (+₹20)", "Extra Garlic Toum (+₹20)"],
  },
  {
    id: "pos-ios-10",
    name: "Overloaded Open Salad",
    category: "Platters & Dips",
    meatPortionGrams: 200,
    sauceGrams: 60,
    breadType: "N/A",
    sellingPrice: 200,
    cogsCost: 68,
    grossMarginPercent: 66.0,
    spitType: "Chicken",
    popularRank: 31,
    active: true,
    meatWeight: "200g",
    tag: "Mega Protein Platter",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Add 2x Khubz Roti (+₹30)", "Extra Garlic Toum (+₹20)"],
  },

  // ── IRANI SPECIAL PLATTER ───────────────────────────────────────────────────
  {
    id: "pos-isp-01",
    name: "Irani Shawarma Platter",
    category: "Platters & Dips",
    meatPortionGrams: 180,
    sauceGrams: 60,
    breadType: "Khubz (Lebanese)",
    sellingPrice: 249,
    cogsCost: 78,
    grossMarginPercent: 68.7,
    spitType: "Chicken",
    popularRank: 32,
    active: true,
    meatWeight: "180g",
    tag: "Signature Platter",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Extra Khubz Bread (+₹15)", "Extra Garlic Toum (+₹20)", "Add Extra Fries (+₹30)"],
  },

  // ── IRANI CHAI & SIDES ──────────────────────────────────────────────────────
  {
    id: "pos-bev-01",
    name: "Authentic Irani Dum Chai",
    category: "Irani Chai & Drinks",
    meatPortionGrams: 0,
    sauceGrams: 0,
    breadType: "N/A",
    sellingPrice: 30,
    cogsCost: 8,
    grossMarginPercent: 73.3,
    spitType: "Beverage",
    popularRank: 33,
    active: true,
    meatWeight: "N/A",
    tag: "Hot Brew",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
    modifiers: ["Less Sugar", "Strong Kadak"],
  },
  {
    id: "pos-dip-01",
    name: "Signature Garlic Toum Dip",
    category: "Sides & Toum",
    meatPortionGrams: 0,
    sauceGrams: 60,
    breadType: "N/A",
    sellingPrice: 30,
    cogsCost: 7,
    grossMarginPercent: 76.7,
    spitType: "Dip",
    popularRank: 34,
    active: true,
    meatWeight: "N/A",
    tag: "Side",
    image: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?auto=format&fit=crop&w=400&q=80",
    modifiers: [],
  },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

export const INITIAL_ORDERS: LiveOrder[] = [];

export const INITIAL_STAFF: StaffMember[] = [];

export const INITIAL_SHIPMENTS: CentralShipment[] = [];

export const INITIAL_RIDER_ORDERS: RiderPickupOrder[] = [];


