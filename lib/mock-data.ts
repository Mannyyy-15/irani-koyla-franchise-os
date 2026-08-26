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

export const INITIAL_OUTLETS: Outlet[] = [
  {
    id: "mohak-city",
    name: "Mohak City Branch",
    code: "IK-MOH-01",
    city: "Mumbai",
    area: "Mohak City Plaza, Central Spine",
    address: "Shop 1 & 2, Grand Mohak Boulevard, Mohak City, Mumbai 400088",
    status: "active",
    dailyTargetSales: 75000,
    dailyTargetWraps: 450,
    currentDaySales: 68500,
    currentDayWraps: 428,
    spitEfficiency: 94.2,
    activeSpits: 2,
    totalSpits: 2,
    ownerName: "Mohak Franchise Partner",
    ownerEmail: "partner.mohak@iranikoyla.com",
    ownerPhone: "+91 98201 44521",
    managerName: "Farhan Qureshi",
    managerPhone: "+91 97690 12845",
    fssaiNumber: "11524008000492",
    fssaiExpiry: "2027-11-30",
    lastAuditScore: 97,
    gstin: "27AABCI4920F1ZV",
    openedAt: "2024-03-15",
    loginEmail: "partner.mohak@iranikoyla.com",
    loginPassword: "password123",
    magicLoginToken: "tok_mohak_990182",
    franchiseFeeAmount: 1500000,
    franchiseFeeStatus: "paid",
    securityDepositAmount: 500000,
    royaltyRatePercent: 6.5,
    marketingFeePercent: 2.0,
    territoryRadiusKm: 3.0,
    agreementTermYears: 5,
    whatsappNumber: "+919820144521",
    panOrAadhaar: "AAAPM1209K / 9081 2291 0019",
  },
];

export const INITIAL_MEAT_BATCHES: MeatBatch[] = [
  {
    id: "batch-101",
    batchNumber: "IK-MOH-260821-A",
    outletId: "mohak-city",
    outletName: "Mohak City Branch",
    meatType: "Koyla Marinated Chicken",
    spitId: "Spit-01 (Main Front)",
    date: "2026-08-21",
    timeLoaded: "11:30 AM",
    rawMeatReceivedKg: 35.0,
    marinationLossKg: 1.2,
    skewerWeightKg: 33.8,
    cookedWeightKg: 28.6,
    wrapsProduced: 245,
    jumboWrapsProduced: 65,
    plattersProduced: 22,
    wasteScrapsKg: 0.9,
    targetYieldKg: 30.5,
    actualYieldPercent: 94.2,
    coreTempCelsius: 78.5,
    status: "roasting",
    loggedBy: "Master Carver Farhan",
    notes: "Perfect charcoal smokiness and seasoning balance.",
  },
  {
    id: "batch-102",
    batchNumber: "IK-MOH-260821-B",
    outletId: "mohak-city",
    outletName: "Mohak City Branch",
    meatType: "Smoked Charcoal Mutton",
    spitId: "Spit-02 (Specialty)",
    date: "2026-08-21",
    timeLoaded: "01:00 PM",
    rawMeatReceivedKg: 22.0,
    marinationLossKg: 0.8,
    skewerWeightKg: 21.2,
    cookedWeightKg: 17.6,
    wrapsProduced: 120,
    jumboWrapsProduced: 42,
    plattersProduced: 15,
    wasteScrapsKg: 0.6,
    targetYieldKg: 18.5,
    actualYieldPercent: 93.8,
    coreTempCelsius: 79.2,
    status: "roasting",
    loggedBy: "Master Carver Farhan",
    notes: "Prime mutton cuts supplied from Central Commissary.",
  },
];

export const INITIAL_SHIFTS: ShiftRegister[] = [
  {
    id: "shift-201",
    outletId: "mohak-city",
    outletName: "Mohak City Branch",
    date: "2026-08-21",
    shiftType: "Morning Shift (11:00 AM - 05:00 PM)",
    cashierName: "Aman Siddiqui",
    openingCash: 5000,
    cashSalesExpected: 18500,
    cashInDrawerActual: 18500,
    cashDifference: 0,
    upiSales: 28400,
    swiggySales: 11200,
    zomatoSales: 7900,
    posCardSales: 2500,
    pettyCashExpenses: 850,
    totalOrders: 168,
    totalGrossSales: 68500,
    discountsGiven: 1450,
    netRevenue: 67050,
    status: "reconciled",
    reconciledAt: "2026-08-21T17:15:00Z",
  },
];

export const INITIAL_ROYALTIES: RoyaltyStatement[] = [
  {
    id: "roy-001",
    invoiceNumber: "IK-ROY-2026-08-01",
    outletId: "mohak-city",
    outletName: "Mohak City Branch",
    month: "July 2026",
    grossSales: 2145000,
    royaltyRatePercent: 6.5,
    royaltyAmount: 139425,
    marketingFeePercent: 2.0,
    marketingFeeAmount: 42900,
    centralKitchenSupplyCost: 310000,
    deductionsAndAdjustments: 0,
    gstAmount: 32818,
    totalPayable: 215143,
    dueDate: "2026-08-10",
    status: "paid",
    paidAt: "2026-08-07T14:30:00Z",
  },
  {
    id: "roy-002",
    invoiceNumber: "IK-ROY-2026-08-02",
    outletId: "mohak-city",
    outletName: "Mohak City Branch",
    month: "August 2026",
    grossSales: 1890000,
    royaltyRatePercent: 6.5,
    royaltyAmount: 122850,
    marketingFeePercent: 2.0,
    marketingFeeAmount: 37800,
    centralKitchenSupplyCost: 280000,
    deductionsAndAdjustments: 0,
    gstAmount: 28917,
    totalPayable: 189567,
    dueDate: "2026-09-10",
    status: "pending",
  },
];

export const INITIAL_COMPLIANCE: ComplianceChecklist[] = [
  {
    id: "comp-01",
    outletId: "mohak-city",
    outletName: "Mohak City Branch",
    date: "2026-08-21",
    inspectedBy: "Audit Lead Imran Sayed",
    deepFreezerTemp: -19.4,
    chillerTemp: 3.1,
    spitCoreTemp: 78.5,
    oilPolarCompoundPercent: 14.5,
    fssaiDisplayVerified: true,
    staffHairnetsGloves: true,
    pestControlVerified: true,
    waterQualityTested: true,
    overallScore: 98,
    status: "pass",
    remarks: "Exemplary food safety & hygiene standards maintained.",
  },
];

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

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "audit-01",
    timestamp: "2026-08-21 17:15:22",
    outletName: "Mohak City Branch",
    user: "Aman Siddiqui",
    role: "Cashier",
    action: "Closed Morning Shift #201",
    module: "Sales",
    severity: "info",
    details: "Reconciled ₹68,500 total gross sales. Zero cash discrepancy.",
  },
  {
    id: "audit-02",
    timestamp: "2026-08-21 15:10:04",
    outletName: "HQ Central",
    user: "Tariq Mansoori",
    role: "Brand Director",
    action: "Royalty Statement Issued",
    module: "Royalty",
    severity: "info",
    details: "Issued July 2026 royalty invoice #IK-ROY-2026-08-01 to Mohak City Branch (₹2,15,143).",
  },
  {
    id: "audit-03",
    timestamp: "2026-08-21 11:30:50",
    outletName: "Mohak City Branch",
    user: "Farhan Qureshi",
    role: "Master Carver",
    action: "Loaded Spit Batch #IK-MOH-260821-A",
    module: "Yield",
    severity: "info",
    details: "33.8 kg Koyla Marinated Chicken loaded on Front Spit #1.",
  },
];

export const INITIAL_ORDERS: LiveOrder[] = [
  // ── TODAY (2026-08-26) ──────────────────────────────────────────────────
  {
    id: "ord-101",
    orderNumber: "IK-9081",
    date: "2026-08-26",
    time: "02:54 PM",
    items: [
      { name: "Irani Koyla Shawarma", quantity: 2, price: 80 },
      { name: "Signature Garlic Toum Dip", quantity: 1, price: 30 },
    ],
    totalAmount: 190,
    channel: "Walk-in Counter",
    paymentMethod: "Cash",
    status: "Completed",
    customerName: "Mohak Customer",
    outletId: "bandra-west",
  },
  {
    id: "ord-102",
    orderNumber: "IK-9082",
    date: "2026-08-26",
    time: "02:48 PM",
    items: [
      { name: "Irani Rumali Special Chicken Shawarma", quantity: 1, price: 120 },
      { name: "Authentic Irani Dum Chai", quantity: 2, price: 30 },
    ],
    totalAmount: 180,
    channel: "Zomato",
    paymentMethod: "Card / POS",
    status: "Completed",
    customerName: "Rohan V.",
    outletId: "bandra-west",
  },
  {
    id: "ord-103",
    orderNumber: "IK-9083",
    date: "2026-08-26",
    time: "02:41 PM",
    items: [
      { name: "Irani Shawarma Platter", quantity: 1, price: 249 },
      { name: "Irani Koyla Cheese Shawarma", quantity: 1, price: 110 },
    ],
    totalAmount: 359,
    channel: "Walk-in Counter",
    paymentMethod: "GPay / UPI",
    status: "Completed",
    customerName: "Dr. Kulkarni",
    outletId: "bandra-west",
  },
  {
    id: "ord-104",
    orderNumber: "IK-9084",
    date: "2026-08-26",
    time: "02:35 PM",
    items: [
      { name: "Irani Koyla Peri Peri Shawarma", quantity: 2, price: 100 },
    ],
    totalAmount: 200,
    channel: "Swiggy",
    paymentMethod: "GPay / UPI",
    status: "Completed",
    customerName: "Pooja Hegde",
    outletId: "bandra-west",
  },
  {
    id: "ord-105",
    orderNumber: "IK-9085",
    date: "2026-08-26",
    time: "02:22 PM",
    items: [
      { name: "Irani Open Salad", quantity: 1, price: 150 },
      { name: "Signature Garlic Toum Dip", quantity: 1, price: 30 },
    ],
    totalAmount: 180,
    channel: "Walk-in Counter",
    paymentMethod: "Cash",
    status: "Completed",
    customerName: "Vikram Malhotra",
    outletId: "bandra-west",
  },

  // ── YESTERDAY (2026-08-25) ──────────────────────────────────────────────
  {
    id: "ord-201",
    orderNumber: "IK-8840",
    date: "2026-08-25",
    time: "09:30 PM",
    items: [
      { name: "Irani Shawarma Platter", quantity: 2, price: 249 },
      { name: "Authentic Irani Dum Chai", quantity: 3, price: 30 },
    ],
    totalAmount: 588,
    channel: "Walk-in Counter",
    paymentMethod: "Cash",
    status: "Completed",
    customerName: "Imran S.",
    outletId: "bandra-west",
  },
  {
    id: "ord-202",
    orderNumber: "IK-8841",
    date: "2026-08-25",
    time: "08:15 PM",
    items: [
      { name: "Irani Rumali Special Chicken Shawarma", quantity: 3, price: 120 },
      { name: "Irani Koyla Special Shawarma", quantity: 2, price: 100 },
    ],
    totalAmount: 560,
    channel: "Zomato",
    paymentMethod: "GPay / UPI",
    status: "Completed",
    customerName: "Alia Bhatt",
    outletId: "bandra-west",
  },
  {
    id: "ord-203",
    orderNumber: "IK-8842",
    date: "2026-08-25",
    time: "06:40 PM",
    items: [
      { name: "Irani Open Cheese Salad", quantity: 2, price: 180 },
    ],
    totalAmount: 360,
    channel: "Swiggy",
    paymentMethod: "Card / POS",
    status: "Completed",
    customerName: "Kunal Roy",
    outletId: "bandra-west",
  },
  {
    id: "ord-204",
    orderNumber: "IK-8843",
    date: "2026-08-25",
    time: "02:10 PM",
    items: [
      { name: "Irani Koyla Shawarma", quantity: 4, price: 80 },
    ],
    totalAmount: 320,
    channel: "Walk-in Counter",
    paymentMethod: "Cash",
    status: "Completed",
    customerName: "College Group #04",
    outletId: "bandra-west",
  },

  // ── PREVIOUS DAYS (2026-08-24 & Earlier) ─────────────────────────────────
  {
    id: "ord-301",
    orderNumber: "IK-7610",
    date: "2026-08-24",
    time: "10:15 PM",
    items: [
      { name: "Irani Shawarma Platter", quantity: 3, price: 249 },
      { name: "Irani Koyla BBQ Shawarma", quantity: 2, price: 100 },
    ],
    totalAmount: 947,
    channel: "Walk-in Counter",
    paymentMethod: "GPay / UPI",
    status: "Completed",
    customerName: "Salman Khan Fans Club",
    outletId: "bandra-west",
  },
  {
    id: "ord-302",
    orderNumber: "IK-7611",
    date: "2026-08-24",
    time: "07:50 PM",
    items: [
      { name: "Irani Rumali Peri Peri Shawarma", quantity: 2, price: 120 },
      { name: "Irani Open Tandoori Salad", quantity: 1, price: 170 },
    ],
    totalAmount: 410,
    channel: "Zomato",
    paymentMethod: "Card / POS",
    status: "Completed",
    customerName: "Sameer N.",
    outletId: "bandra-west",
  },
  {
    id: "ord-303",
    orderNumber: "IK-7612",
    date: "2026-08-23",
    time: "08:45 PM",
    items: [
      { name: "Irani Koyla Shawarma", quantity: 5, price: 80 },
      { name: "Signature Garlic Toum Dip", quantity: 2, price: 30 },
    ],
    totalAmount: 460,
    channel: "Walk-in Counter",
    paymentMethod: "Cash",
    status: "Completed",
    customerName: "Anand R.",
    outletId: "bandra-west",
  },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: "st-01",
    name: "Farhan Qureshi",
    role: "Master Carver",
    status: "Present",
    checkInTime: "10:45 AM",
    phone: "+91 98201 11201",
    avatar: "FQ",
  },
  {
    id: "st-02",
    name: "Sameer Khan",
    role: "Shawarma Assembler",
    status: "Present",
    checkInTime: "10:50 AM",
    phone: "+91 98201 11202",
    avatar: "SK",
  },
  {
    id: "st-03",
    name: "Imran Shaikh",
    role: "Cashier & Counter",
    status: "Present",
    checkInTime: "10:55 AM",
    phone: "+91 98201 11203",
    avatar: "IS",
  },
  {
    id: "st-04",
    name: "Rashid Ali",
    role: "Grill & Coal Master",
    status: "Present",
    checkInTime: "11:00 AM",
    phone: "+91 98201 11204",
    avatar: "RA",
  },
];

export const INITIAL_SHIPMENTS: CentralShipment[] = [
  {
    id: "shp-101",
    shipmentNumber: "IK-DISP-260822-01",
    outletId: "mohak-city",
    outletName: "Mohak City Branch",
    dispatchedAt: "08:30 AM, Today",
    deliveredAt: "09:45 AM, Today",
    status: "delivered",
    chickenConesCount: 3,
    muttonConesCount: 2,
    totalMeatWeightKg: 126.0,
    spiceMixBagsCount: 5,
    toumJarsCount: 10,
    vanVehicleNumber: "MH 02 EE 4092 (Reefer)",
    driverName: "Sultan Sheikh",
    driverPhone: "+91 98205 11984",
    temperatureCelsius: 2.8,
    securitySealNumber: "SEAL-K-90218",
  },
];

