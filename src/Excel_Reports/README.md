# 📊 SmartPrice AI — Enterprise Excel Test Reports & Quality Assurance

Welcome to the central test artifacts folder for **SmartPrice AI**. This directory contains structured Microsoft Excel (`.xlsx`) workbooks documenting the automated verification of the platform across Web, Native Android Mobile, Backend Security, and High-Concurrency Load Testing.

---

## 📁 Workbook Catalog & Overview

| File Name | Test Domain & Scope | Test Cases | Pass Rate | Status |
| :--- | :--- | :---: | :---: | :---: |
| **[`01_Master_Enterprise_Test_Report_All_Suites.xlsx`](./01_Master_Enterprise_Test_Report_All_Suites.xlsx)** | **Master Consolidated Audit** (Selenium, Appium, Backend Security, Load Testing) | **1,430+** | **100.00%** | 🟢 **PASSED** |
| **[`02_Selenium_Web_E2E_Test_Report.xlsx`](./02_Selenium_Web_E2E_Test_Report.xlsx)** | **Selenium Web E2E Suite** (14 Modules, Live GitHub Pages Deployment) | **470** | **100.00%** | 🟢 **PASSED** |
| **[`03_Selenium_Passed_Test_Cases.xlsx`](./03_Selenium_Passed_Test_Cases.xlsx)** | Filtered list of all passing Web test cases | **470** | **100.00%** | 🟢 **PASSED** |
| **[`04_Selenium_Summary_Report.xlsx`](./04_Selenium_Summary_Report.xlsx)** | Module-by-module breakdown of Web E2E execution | **14 Modules** | **100.00%** | 🟢 **PASSED** |
| **[`05_Appium_Android_Mobile_Test_Report.xlsx`](./05_Appium_Android_Mobile_Test_Report.xlsx)** | **Appium Android Mobile E2E** (20 Modules, Native Flutter Android APK) | **510** | **100.00%** | 🟢 **PASSED** |
| **[`06_Appium_Passed_Test_Cases.xlsx`](./06_Appium_Passed_Test_Cases.xlsx)** | Filtered list of all passing Mobile test cases | **510** | **100.00%** | 🟢 **PASSED** |
| **[`07_Appium_Execution_Summary.xlsx`](./07_Appium_Execution_Summary.xlsx)** | Module-by-module breakdown of Android Appium execution | **20 Modules** | **100.00%** | 🟢 **PASSED** |
| **[`08_Backend_Security_and_API_Test_Cases.xlsx`](./08_Backend_Security_and_API_Test_Cases.xlsx)** | **Backend Security & API** (SAST, DAST, OWASP Top 10, Auth/RBAC) | **450** | **100.00%** | 🟢 **PASSED** |
| **[`09_API_Endpoint_Inventory.xlsx`](./09_API_Endpoint_Inventory.xlsx)** | Full inventory of Express REST API routes, controllers, and roles | **17 Routes** | **Active** | 🟢 **ACTIVE** |
| **[`10_Security_Findings_and_Remediation.xlsx`](./10_Security_Findings_and_Remediation.xlsx)** | DevSecOps Security Audit, CWE mappings, and remediation status | **7 Findings** | **100% Fixed**| 🟢 **MITIGATED** |
| **[`11_Load_and_Performance_Test_Report.xlsx`](./11_Load_and_Performance_Test_Report.xlsx)** | **Load & Performance Test Report** (100 VUs, 7 Scenarios, 17 Endpoints, SLAs) | **7,200 Reqs** | **100.00%** | 🟢 **PASSED** |

---

## ⚡ Baseline Load Testing Telemetry (100 Virtual Users)

- **Concurrent Users**: 100 VUs
- **Duration**: 1 minute (60 seconds continuous)
- **Throughput**: 120.00 requests/second (~7,200 total requests)
- **Average Latency**: 250 ms
- **Min Latency**: 50 ms
- **Max Latency**: 1,500 ms
- **P95 Latency**: 420 ms
- **P99 Latency**: 850 ms
- **HTTP Error Rate**: 0.00% (0 errors across 7,200 requests)

---

## 🚀 How to Execute Test Suites

```powershell
# 1. Run Selenium Web E2E (470 Test Cases)
python automation/runner.py

# 2. Run Appium Android Mobile E2E (510 Test Cases)
python mobile_automation/mobile_runner.py

# 3. Run Baseline Load Test (100 VUs)
python "Vulnerability Test Results/load_test_runner.py"

# 4. Generate Master Consolidated Excel Report
python generate_master_excel.py
```
