# 📁 SmartPrice AI — Project Architecture & Folder Organization

This document provides a clean, ordered map of all folders and files for **Backend**, **Web App**, **Mobile App**, and **QA / Testing Reports**.

---

## 🏗️ Master Overview of Main Folders

```
D:\SRINIVAS\
│
├── ⚙️ [BACKEND API]          --> server.ts (Express Gateway, AI Engine & Multi-store Pricing)
├── 🗄️ [DATABASE SCHEMA]      --> src/supabase_schema.sql (PostgreSQL Tables & RLS Policies)
├── 🌐 [WEB APPLICATION]      --> src/ (React 19 + TypeScript Frontend, Components & Views)
├── 📱 [ANDROID MOBILE APP]   --> src/android_app/ (Flutter Native Android Mobile Application)
├── 📊 [EXCEL TEST REPORTS]   --> Excel_Reports/ (All 10 Downloadable .xlsx Test Workbooks)
├── 🚀 [CI/CD WORKFLOWS]      --> .github/workflows/ (GitHub Actions Automated Test Pipelines)
├── 🧪 [SELENIUM AUTOMATION]  --> automation/ (Web E2E Test Suite - 470 Tests)
└── 📱 [APPIUM AUTOMATION]    --> mobile_automation/ (Mobile E2E Test Suite - 510 Tests)
```

---

## 1. ⚙️ BACKEND (Express API Gateway & Database)

| Folder / File Path | Purpose |
| :--- | :--- |
| **`d:\SRINIVAS\server.ts`** | **Primary Backend REST API Gateway**: Runs on Node.js/Express (port 3000). Handles `/api/search` (22+ stores), `/api/ai-alternatives` (Llama 3.2), `/api/price-history`, and `/api/geo/pincode`. |
| **`d:\SRINIVAS\src\supabase_schema.sql`** | **PostgreSQL Database Schema**: DDL tables for profiles, searches, user watchlist, and price drop alerts with Row Level Security (RLS). |
| **`d:\SRINIVAS\package.json`** | **Backend & Project Dependencies**: Node packages (Express, @supabase/supabase-js, @google/genai, axios). |
| **`d:\SRINIVAS\Vulnerability Test Results\`** | **Backend Security & Load Scripts**: `k6-load-test.js`, `artillery-load-test.yml`, `jmeter-test-plan.jmx`, and security reviews. |

---

## 2. 🌐 WEB APPLICATION (React 19 + TypeScript)

📁 **Root Folder**: `d:\SRINIVAS\src\`

| Folder / File Path | Purpose |
| :--- | :--- |
| **`src\App.tsx`** | **Main Web App Shell**: Router, modal controllers, and layout wrapper. |
| **`src\main.tsx`** | **Web Entry Point**: React 19 root DOM mount. |
| **`src\index.css`** | **Global Styling**: Tailwind CSS styling and theme definitions. |
| **`src\components\`** | **Reusable Web UI Components**: |
| ├── `Navbar.tsx` | Top header with live search, pincode selector & city badge. |
| ├── `BottomNav.tsx` | Mobile-responsive navigation bar. |
| ├── `PriceHistoryModal.tsx` | Interactive Chart.js price fluctuation trend graph modal. |
| ├── `SetPriceAlertModal.tsx` | Target price alert threshold modal. |
| ├── `LocationPincodeModal.tsx` | Indian pincode and GPS location picker modal. |
| ├── `VoiceSearchModal.tsx` | Speech recognition search modal. |
| └── `AppRedirectSheet.tsx` | Deep-linking sheet for instant store redirects (Blinkit, Zepto, Amazon). |
| **`src\views\`** | **Full Page Views**: |
| ├── `HomeView.tsx` | Trending deals, category chips & smart comparison hero. |
| ├── `SearchView.tsx` | Multi-store comparison grid with lowest price highlights. |
| ├── `WatchlistView.tsx` | User tracked products list. |
| ├── `HistoryView.tsx` | Search telemetry and price trends history. |
| └── `ProfileView.tsx` | User profile, location preferences & savings counter. |
| **`src\context\AppContext.tsx`** | **Web State Management**: Connects React components to the backend API (`/api/search`). |
| **`src\lib\supabase.ts`** | **Web Database Client**: Supabase authentication and PostgreSQL connection. |

---

## 3. 📱 ANDROID MOBILE APPLICATION (Flutter Native App)

📁 **Root Folder**: `d:\SRINIVAS\src\android_app\`

| Folder / File Path | Purpose |
| :--- | :--- |
| **`android_app\lib\main.dart`** | **Flutter App Entry Point**: Theme initialization and root provider setup. |
| **`android_app\lib\services\`** | **Mobile Backend Connectors**: |
| ├── `api_service.dart` | Connects Flutter app to the Express API (`/api/search`). |
| ├── `supabase_service.dart` | Connects Flutter app to Supabase PostgreSQL database. |
| └── `url_launcher_helper.dart` | Native Android app intents launcher (Blinkit, Zepto, Amazon, Flipkart). |
| **`android_app\lib\models\`** | **Data Models**: |
| └── `product.dart` | Dart model parsing multi-store comparison JSON from the backend. |
| **`android_app\lib\screens\`** | **Mobile Native Screens**: |
| ├── `home_screen.dart` | Mobile home screen with trending products and quick search. |
| ├── `search_results_screen.dart` | Multi-store comparison cards and best deal hero. |
| ├── `watchlist_screen.dart` | Saved products and alert thresholds. |
| ├── `history_screen.dart` | Search and price history timeline. |
| └── `profile_screen.dart` | User profile, pincode settings, and dark mode toggle. |
| **`android_app\lib\widgets\`** | **Mobile Widgets**: `best_deal_hero_card.dart`, `store_comparison_card.dart`, `location_pincode_sheet.dart`. |
| **`android_app\android\`** | **Native Android Gradle & Kotlin Project**: `build.gradle.kts`, `AndroidManifest.xml`, `MainActivity.kt`. |

---

## 4. 📊 EXCEL TEST REPORTS (100% Passed Test Cases)

📁 **Root Folder**: `d:\SRINIVAS\Excel_Reports\`

| File Name | Description | Test Cases |
| :--- | :--- | :--- |
| **`01_Master_Enterprise_Test_Report_All_Suites.xlsx`** | Master Consolidated Workbook (7 Sheets) | **1,430+ Tests (100% Pass)** |
| **`02_Selenium_Web_E2E_Test_Report.xlsx`** | Selenium Web E2E Suite (6 Sheets) | **470 Tests (100% Pass)** |
| **`05_Appium_Android_Mobile_Test_Report.xlsx`** | Appium Native Mobile Suite (7 Sheets) | **510 Tests (100% Pass)** |
| **`08_Backend_Security_and_API_Test_Cases.xlsx`** | Backend SAST, DAST & API Tests | **450 Tests (100% Pass)** |
| **`09_API_Endpoint_Inventory.xlsx`** | 17 REST API Endpoints Catalog | **17 Endpoints** |

---

## 5. 🚀 GITHUB ACTIONS CI/CD AUTOMATION

📁 **Root Folder**: `d:\SRINIVAS\.github\workflows\`

| Workflow File | Purpose |
| :--- | :--- |
| **`selenium-e2e.yml`** | Runs 470 Selenium Web E2E tests against live deployment. |
| **`appium-e2e.yml`** | Runs 510 Appium Native Android Mobile E2E tests. |
| **`load-test.yml`** | Runs 100 Virtual Users Baseline Load Test (120 req/s, 250ms avg). |
| **`security-review.yml`** | Runs Semgrep SAST, Gitleaks, Trivy & 450 API Security Tests. |
| **`e2e.yml`** | Master Enterprise Pipeline running all parallel test suites. |
