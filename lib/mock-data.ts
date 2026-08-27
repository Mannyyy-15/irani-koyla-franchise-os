export interface Outlet {
  id: string;
  name: string;
  code: string;
  city: string;
  area: string;
  address: string;
  status: "active" | "onboarding" | "suspended" | "terminated";
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

export interface SupplyCatalogItem {
  id: string;
  name: string;
  category: "Spices & Marinades" | "Raw Marinated Meat Cones" | "Sauces & Dips" | "Breads & Khubz" | "Packaging & Disposables";
  unit: string; // e.g. "5 kg Bag", "30 kg Cone", "10 kg Jar", "Pack of 100", "Bundle of 500"
  unitPrice: number;
  moq: number; // Minimum order quantity
  sku: string;
  image: string;
  description: string;
  shelfLife: string;
  inStock: boolean;
}

export interface SupplyOrderItem {
  itemId: string;
  itemName: string;
  category: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface SupplyOrder {
  id: string;
  orderNumber: string;
  outletId: string;
  outletName: string;
  outletCode: string;
  createdAt: string; // YYYY-MM-DD HH:MM
  urgency: "Normal (24-48h)" | "Express Rush (12h)" | "Emergency Stockout (6h)";
  status: "pending" | "approved" | "dispatched" | "delivered" | "declined";
  items: SupplyOrderItem[];
  totalQuantity: number;
  totalAmount: number;
  requestedDeliveryDate: string;
  notes?: string;
  declineReason?: string;
  approvedAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  driverDetails?: string;
  deliveryOtp?: string;
}

export const SUPPLY_CATALOG: SupplyCatalogItem[] = [
  {
    id: "cat-meat-01",
    name: "Koyla Marinated Chicken Spit Cone (30kg)",
    category: "Raw Marinated Meat Cones",
    unit: "30 kg Spit Cone",
    unitPrice: 7200,
    moq: 1,
    sku: "IK-SKU-CHK30",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
    description: "Signature Irani spiced raw layered chicken spit ready for roasting. Vacuum tamper sealed.",
    shelfLife: "48 hours in chiller (2°C - 4°C)",
    inStock: true,
  },
  {
    id: "cat-meat-02",
    name: "Smoked Charcoal Mutton Spit Cone (18kg)",
    category: "Raw Marinated Meat Cones",
    unit: "18 kg Spit Cone",
    unitPrice: 9900,
    moq: 1,
    sku: "IK-SKU-MUT18",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
    description: "Premium tender mutton cone with slow charcoal smoke infusion. Strict temperature control.",
    shelfLife: "36 hours in chiller (2°C - 4°C)",
    inStock: true,
  },
  {
    id: "cat-spice-01",
    name: "Irani Secret Shawarma Spice Master Mix (5kg)",
    category: "Spices & Marinades",
    unit: "5 kg Foil Sealed Bag",
    unitPrice: 1850,
    moq: 1,
    sku: "IK-SKU-SPICE5",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    description: "Central secret proprietary blend of 14 roasted Persian & Middle Eastern spices.",
    shelfLife: "6 Months",
    inStock: true,
  },
  {
    id: "cat-spice-02",
    name: "Koyla Peri-Peri Seasoning Dust (2kg)",
    category: "Spices & Marinades",
    unit: "2 kg Air-tight Container",
    unitPrice: 850,
    moq: 1,
    sku: "IK-SKU-PERI2",
    image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80",
    description: "Zesty spicy dusting spice for Peri Peri Shawarma & cheese fries garnish.",
    shelfLife: "9 Months",
    inStock: true,
  },
  {
    id: "cat-spice-03",
    name: "Smokey Koyla Charcoal Marinade Base (10kg)",
    category: "Spices & Marinades",
    unit: "10 kg Food Grade Bucket",
    unitPrice: 2400,
    moq: 1,
    sku: "IK-SKU-MAR10",
    image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=400&q=80",
    description: "Liquid smoke and cold-pressed oil marinade base for in-store touch-up prep.",
    shelfLife: "3 Months",
    inStock: true,
  },
  {
    id: "cat-sauce-01",
    name: "Authentic Toum Garlic Dip Bucket (10kg)",
    category: "Sauces & Dips",
    unit: "10 kg Sealed Pail",
    unitPrice: 2100,
    moq: 1,
    sku: "IK-SKU-TOUM10",
    image: "https://images.unsplash.com/photo-1618449840665-9ed506d73a34?auto=format&fit=crop&w=400&q=80",
    description: "Fluffy emulsified garlic paste made with fresh peeled garlic, lemon & sunflower oil. 0% preservatives.",
    shelfLife: "14 days in chiller (2°C - 4°C)",
    inStock: true,
  },
  {
    id: "cat-sauce-02",
    name: "Spicy Schezwan Garlic Chutney (5kg)",
    category: "Sauces & Dips",
    unit: "5 kg Jar",
    unitPrice: 1150,
    moq: 1,
    sku: "IK-SKU-SCH5",
    image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=400&q=80",
    description: "Hot red chilli garlic fusion sauce for Schezwan wraps and open platters.",
    shelfLife: "30 days in chiller",
    inStock: true,
  },
  {
    id: "cat-bread-01",
    name: "Lebanese Khubz Pita Flatbread (Pack of 100)",
    category: "Breads & Khubz",
    unit: "100 Pcs Sealed Bag",
    unitPrice: 650,
    moq: 2,
    sku: "IK-SKU-KHUBZ100",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    description: "Double-pocket authentic Lebanese khubz bread, fresh baked daily.",
    shelfLife: "4 days (Room Temp) / 10 days (Chilled)",
    inStock: true,
  },
  {
    id: "cat-bread-02",
    name: "Traditional Rumali Roti Base (Pack of 100)",
    category: "Breads & Khubz",
    unit: "100 Pcs Sealed Pack",
    unitPrice: 750,
    moq: 2,
    sku: "IK-SKU-RUMALI100",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
    description: "Thin hand-stretched rumali roti base for roll wraps.",
    shelfLife: "3 days (Chilled)",
    inStock: true,
  },
  {
    id: "cat-pack-01",
    name: "Irani Koyla Branded Foil Wrap Rolls (500m)",
    category: "Packaging & Disposables",
    unit: "500m Heavy-Duty Roll",
    unitPrice: 950,
    moq: 1,
    sku: "IK-SKU-FOIL500",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80",
    description: "Food-grade heat retentive aluminium foil with brand watermarking.",
    shelfLife: "N/A",
    inStock: true,
  },
  {
    id: "cat-pack-02",
    name: "Kraft Paper Delivery Carry Bags (Pack of 500)",
    category: "Packaging & Disposables",
    unit: "500 Bags Bundle",
    unitPrice: 1650,
    moq: 1,
    sku: "IK-SKU-BAG500",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=400&q=80",
    description: "Eco-friendly branded grease-proof kraft takeout bags with handles.",
    shelfLife: "N/A",
    inStock: true,
  },
  {
    id: "cat-pack-03",
    name: "Signature 60ml Dip Cups with Lids (Pack of 1000)",
    category: "Packaging & Disposables",
    unit: "1000 Cups + Lids",
    unitPrice: 1200,
    moq: 1,
    sku: "IK-SKU-CUP1000",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80",
    description: "Tamper-proof leak-resistant portion cups for garlic toum & chutneys.",
    shelfLife: "N/A",
    inStock: true,
  },
];

export const INITIAL_SUPPLY_ORDERS: SupplyOrder[] = [];

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

  
