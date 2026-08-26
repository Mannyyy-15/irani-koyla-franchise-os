-- ==============================================================================
-- IRANI KOYLA SHAWARMA FRANCHISE OS - PRODUCTION DATABASE SCHEMA & SEED
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB / Hostinger phpMyAdmin
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. FRANCHISE OUTLETS TABLE
DROP TABLE IF EXISTS `franchise_outlets`;
CREATE TABLE `franchise_outlets` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(500) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `status` ENUM('active', 'training', 'suspended', 'pending_setup') NOT NULL DEFAULT 'active',
  `tier` VARCHAR(50) NOT NULL DEFAULT 'Tier-1 High Footfall',
  `dailyTargetSales` INT NOT NULL DEFAULT 85000,
  `ownerName` VARCHAR(255) NOT NULL,
  `ownerEmail` VARCHAR(255) NOT NULL UNIQUE,
  `ownerPhone` VARCHAR(50) NOT NULL,
  `passwordHash` VARCHAR(255),
  `magicLoginToken` VARCHAR(255),
  `franchiseFeeAmount` INT NOT NULL DEFAULT 1500000,
  `franchiseFeeStatus` ENUM('paid', 'partial', 'pending') NOT NULL DEFAULT 'paid',
  `securityDepositAmount` INT NOT NULL DEFAULT 500000,
  `royaltyRatePercent` DOUBLE NOT NULL DEFAULT 6.5,
  `marketingFeePercent` DOUBLE NOT NULL DEFAULT 2.0,
  `territoryRadiusKm` DOUBLE NOT NULL DEFAULT 3.0,
  `managerName` VARCHAR(255),
  `managerPhone` VARCHAR(50),
  `fssaiNumber` VARCHAR(100),
  `gstin` VARCHAR(100),
  `openedAt` VARCHAR(50) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. LIVE POS ORDERS TABLE
DROP TABLE IF EXISTS `live_orders`;
CREATE TABLE `live_orders` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `orderNumber` VARCHAR(50) NOT NULL,
  `outletId` VARCHAR(100) NOT NULL,
  `customerName` VARCHAR(255),
  `channel` ENUM('Walk-in Counter', 'Zomato', 'Swiggy') NOT NULL DEFAULT 'Walk-in Counter',
  `paymentMethod` VARCHAR(100) NOT NULL DEFAULT 'Cash',
  `itemsJson` TEXT NOT NULL,
  `totalAmount` INT NOT NULL,
  `status` ENUM('Completed', 'Delivered') NOT NULL DEFAULT 'Completed',
  `time` VARCHAR(50) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_orders_outlet` (`outletId`),
  INDEX `idx_orders_created` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. MEAT CONE & SPIT ROASTING BATCHES
DROP TABLE IF EXISTS `meat_batches`;
CREATE TABLE `meat_batches` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `batchNumber` VARCHAR(100) NOT NULL,
  `outletId` VARCHAR(100) NOT NULL,
  `meatType` VARCHAR(100) NOT NULL DEFAULT 'Koyla Marinated Chicken',
  `spitId` VARCHAR(100) NOT NULL DEFAULT 'Spit-01 (Main Front)',
  `date` VARCHAR(50) NOT NULL,
  `timeLoaded` VARCHAR(50) NOT NULL,
  `rawMeatReceivedKg` DOUBLE NOT NULL DEFAULT 0,
  `marinationLossKg` DOUBLE NOT NULL DEFAULT 0,
  `skewerWeightKg` DOUBLE NOT NULL DEFAULT 0,
  `cookedWeightKg` DOUBLE NOT NULL DEFAULT 0,
  `wrapsProduced` INT NOT NULL DEFAULT 0,
  `jumboWrapsProduced` INT NOT NULL DEFAULT 0,
  `plattersProduced` INT NOT NULL DEFAULT 0,
  `wasteScrapsKg` DOUBLE NOT NULL DEFAULT 0,
  `targetYieldKg` DOUBLE NOT NULL DEFAULT 0,
  `actualYieldPercent` DOUBLE NOT NULL DEFAULT 0,
  `coreTempCelsius` DOUBLE NOT NULL DEFAULT 78.5,
  `status` ENUM('roasting', 'depleted', 'scrapped') NOT NULL DEFAULT 'roasting',
  `loggedBy` VARCHAR(255),
  `notes` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_batches_outlet` (`outletId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. SHIFT REGISTERS TABLE
DROP TABLE IF EXISTS `shift_registers`;
CREATE TABLE `shift_registers` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `outletId` VARCHAR(100) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `shiftType` VARCHAR(100) NOT NULL DEFAULT 'Full Day Register',
  `cashierName` VARCHAR(255) NOT NULL,
  `openingCash` INT NOT NULL DEFAULT 2000,
  `cashSalesExpected` INT NOT NULL DEFAULT 0,
  `cashInDrawerActual` INT NOT NULL DEFAULT 0,
  `cashDifference` INT NOT NULL DEFAULT 0,
  `upiSales` INT NOT NULL DEFAULT 0,
  `swiggySales` INT NOT NULL DEFAULT 0,
  `zomatoSales` INT NOT NULL DEFAULT 0,
  `posCardSales` INT NOT NULL DEFAULT 0,
  `pettyCashExpenses` INT NOT NULL DEFAULT 0,
  `totalOrders` INT NOT NULL DEFAULT 0,
  `totalGrossSales` INT NOT NULL DEFAULT 0,
  `discountsGiven` INT NOT NULL DEFAULT 0,
  `netRevenue` INT NOT NULL DEFAULT 0,
  `status` ENUM('reconciled', 'variance_flagged', 'pending_review') NOT NULL DEFAULT 'reconciled',
  `reconciledAt` VARCHAR(100),
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_shifts_outlet` (`outletId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ROYALTY STATEMENTS TABLE
DROP TABLE IF EXISTS `royalty_statements`;
CREATE TABLE `royalty_statements` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `invoiceNumber` VARCHAR(100) NOT NULL UNIQUE,
  `outletId` VARCHAR(100) NOT NULL,
  `month` VARCHAR(50) NOT NULL,
  `grossSales` INT NOT NULL DEFAULT 0,
  `royaltyRatePercent` DOUBLE NOT NULL DEFAULT 6.5,
  `royaltyAmount` INT NOT NULL DEFAULT 0,
  `marketingFeePercent` DOUBLE NOT NULL DEFAULT 2.0,
  `marketingFeeAmount` INT NOT NULL DEFAULT 0,
  `centralKitchenSupplyCost` INT NOT NULL DEFAULT 0,
  `deductionsAndAdjustments` INT NOT NULL DEFAULT 0,
  `gstAmount` INT NOT NULL DEFAULT 0,
  `totalPayable` INT NOT NULL DEFAULT 0,
  `dueDate` VARCHAR(50) NOT NULL,
  `status` ENUM('paid', 'pending', 'overdue', 'disputed') NOT NULL DEFAULT 'pending',
  `paidAt` VARCHAR(100),
  `disputeReason` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_royalty_outlet` (`outletId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. COMPLIANCE CHECKLISTS TABLE
DROP TABLE IF EXISTS `compliance_checklists`;
CREATE TABLE `compliance_checklists` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `outletId` VARCHAR(100) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `inspectedBy` VARCHAR(255) NOT NULL,
  `deepFreezerTemp` DOUBLE NOT NULL DEFAULT -18.0,
  `chillerTemp` DOUBLE NOT NULL DEFAULT 3.0,
  `spitCoreTemp` DOUBLE NOT NULL DEFAULT 78.5,
  `oilPolarCompoundPercent` DOUBLE NOT NULL DEFAULT 15.0,
  `fssaiDisplayVerified` INT NOT NULL DEFAULT 1,
  `staffHairnetsGloves` INT NOT NULL DEFAULT 1,
  `pestControlVerified` INT NOT NULL DEFAULT 1,
  `waterQualityTested` INT NOT NULL DEFAULT 1,
  `overallScore` INT NOT NULL DEFAULT 100,
  `status` ENUM('pass', 'flagged', 'failed') NOT NULL DEFAULT 'pass',
  `remarks` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_compliance_outlet` (`outletId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. PETTY CASH & SAFE DROPS
DROP TABLE IF EXISTS `petty_cash_expenses`;
CREATE TABLE `petty_cash_expenses` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `outletId` VARCHAR(100) NOT NULL,
  `amount` INT NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `reason` VARCHAR(255) NOT NULL,
  `authorizedBy` VARCHAR(255) NOT NULL,
  `receiptNumber` VARCHAR(100),
  `timestamp` VARCHAR(50) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `safe_drops`;
CREATE TABLE `safe_drops` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `outletId` VARCHAR(100) NOT NULL,
  `amount` INT NOT NULL,
  `authorizedBy` VARCHAR(255) NOT NULL,
  `safeNumber` VARCHAR(100) NOT NULL,
  `notes` TEXT,
  `timestamp` VARCHAR(50) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. RIDER PICKUP ORDERS TABLE
DROP TABLE IF EXISTS `rider_pickup_orders`;
CREATE TABLE `rider_pickup_orders` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `orderNumber` VARCHAR(100) NOT NULL,
  `outletId` VARCHAR(100) NOT NULL,
  `channel` ENUM('Zomato', 'Swiggy') NOT NULL,
  `bagToken` VARCHAR(50) NOT NULL,
  `riderName` VARCHAR(255) NOT NULL,
  `riderPhone` VARCHAR(50),
  `vehicleNumber` VARCHAR(50),
  `otp` VARCHAR(10) NOT NULL,
  `status` ENUM('Ready for Pickup', 'Rider Arrived', 'Handed Over') NOT NULL DEFAULT 'Ready for Pickup',
  `itemsSummary` VARCHAR(255) NOT NULL,
  `arrivedAt` VARCHAR(50),
  `handedOverAt` VARCHAR(50),
  `customerName` VARCHAR(255),
  `orderAmount` INT NOT NULL DEFAULT 0,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. MASTER MENU RECIPES & PRICING
DROP TABLE IF EXISTS `menu_item_recipes`;
CREATE TABLE `menu_item_recipes` (
  `id` VARCHAR(100) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `meatPortionGrams` INT NOT NULL,
  `sauceGrams` INT NOT NULL,
  `breadType` VARCHAR(100) NOT NULL,
  `sellingPrice` INT NOT NULL,
  `cogsCost` INT NOT NULL,
  `grossMarginPercent` DOUBLE NOT NULL,
  `isTopSeller` INT NOT NULL DEFAULT 0,
  `description` TEXT,
  `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Franchise Outlets
INSERT INTO `franchise_outlets` (`id`, `code`, `name`, `address`, `city`, `status`, `dailyTargetSales`, `ownerName`, `ownerEmail`, `ownerPhone`, `openedAt`) VALUES
('mohak-city', 'IK-MOH-01', 'Mohak City Branch', 'Shop 4, Mohak City Complex, Mira Road East', 'Mumbai', 'active', 75000, 'Mohak City Franchise Partner', 'partner.mohak@iranikoyla.com', '+91 98200 11223', '2025-02-15'),
('bandra-west', 'IK-MUM-01', 'Bandra West Flagship', 'Shop 12, Hill Road, Bandra West', 'Mumbai', 'active', 95000, 'Zaid Qureshi', 'partner.bandra@iranikoyla.com', '+91 98201 22334', '2024-11-01'),
('andheri-east', 'IK-AND-02', 'Andheri East Express', 'Unit 3, Metro Station Mall, Andheri East', 'Mumbai', 'active', 65000, 'Tariq Merchant', 'partner.andheri@iranikoyla.com', '+91 98334 55667', '2025-01-10');

-- Seed Master Menu Recipes
INSERT INTO `menu_item_recipes` (`id`, `name`, `category`, `meatPortionGrams`, `sauceGrams`, `breadType`, `sellingPrice`, `cogsCost`, `grossMarginPercent`, `isTopSeller`) VALUES
('pos-iks-01', 'Irani Koyla Chicken Shawarma', 'Shawarma Wraps', 120, 35, 'Khubz (Lebanese)', 160, 48, 70.0, 1),
('pos-iks-02', 'Special Cheese Koyla Shawarma', 'Shawarma Wraps', 130, 45, 'Khubz (Lebanese)', 200, 62, 69.0, 1),
('pos-iks-03', 'Double Meat Charcoal Feast', 'Shawarma Wraps', 220, 60, 'Khubz (Lebanese)', 270, 88, 67.4, 1),
('pos-irs-01', 'Irani Rumali Chicken Shawarma', 'Shawarma Wraps', 150, 45, 'Rumali Roti', 190, 58, 69.5, 1),
('pos-ios-01', 'Open Salad Koyla Shawarma Box', 'Open Salad', 160, 50, 'N/A (Keto Box)', 220, 65, 70.5, 1),
('pos-isp-01', 'Royal Irani Spit Roaster Platter', 'Platters & Dips', 250, 80, 'Khubz + Rumali', 340, 105, 69.1, 1),
('pos-chai-01', 'Signature Irani Dum Chai', 'Irani Chai & Drinks', 0, 0, 'N/A', 35, 8, 77.1, 1);

SET FOREIGN_KEY_CHECKS = 1;
