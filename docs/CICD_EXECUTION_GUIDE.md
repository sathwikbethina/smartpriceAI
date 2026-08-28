# GitHub Actions Enterprise CI/CD Pipeline Guide

**Repository**: `sathwikbethina/smartpriceAI`  
**CI/CD Engine**: GitHub Actions  

---

## 1. Pipeline Architecture Overview

The enterprise testing automation pipeline comprises 5 dedicated workflow configurations:

```
                                      [ Code Push to main / PR ]
                                                  |
        +-------------------------+---------------+-------------------------+
        |                         |                                         |
        v                         v                                         v
+------------------+     +-------------------+                    +---------------------+
| deploy-and-test  |     |   android-e2e     |                    |   security-review   |
| (13-Stage Web)   |     | (21-Stage Mobile) |                    |  (DevSecOps & SAST) |
+--------+---------+     +---------+---------+                    +----------+----------+
         |                         |                                         |
         +-------------------------+-----------------------------------------+
                                   |
                                   v
               +-----------------------------------------+
               |        Enterprise Master E2E            |
               |             (e2e.yml)                   |
               |                                         |
               | - 🌐 Selenium Web E2E (470 Tests)       |
               | - 📱 Appium Android (510 Tests)         |
               | - 🖊️ Unit Tests API (450 Tests)         |
               | - ✅ Validation Tests (300+ Tests)      |
               | - 🚀 Deployment Verification (300)      |
               | - 📊 Load Baseline 100 VUs (120 req/s)  |
               | - 📋 Compile Master Report & Summary    |
               +-------------------+---------------------+
                                   |
                                   v
             [ Deploy Live Reports to GitHub Pages ]
      https://sathwikbethina.github.io/smartpriceAI/reports/latest/
```

---

## 2. GitHub Actions Workflow Inventory

| Workflow File | Description | Triggers | Artifacts Generated |
| :--- | :--- | :--- | :--- |
| **`.github/workflows/deploy-and-test.yml`** | Builds React web app, deploys to GitHub Pages, verifies HTTP 200, and runs 470 Selenium E2E tests against live URL. | `push`, `pull_request`, `workflow_dispatch` | `Automation_Test_Report.xlsx`, `execution-report.html`, `summary.md` |
| **`.github/workflows/android-e2e.yml`** | Compiles Flutter APK, boots Android Emulator, starts Appium, and executes 510 mobile test cases. | `push`, `schedule` (Daily), `workflow_dispatch` | `Automation_Test_Report.xlsx`, `execution-report.html`, `trends.html` |
| **`.github/workflows/security-review.yml`** | DevSecOps pipeline running Semgrep SAST, Gitleaks secret detection, Trivy CVE scan, and API security tests. | `push`, `pull_request`, `workflow_dispatch` | `endpoint-inventory.xlsx`, `findings.xlsx`, `test-cases.xlsx`, `executive-summary.md` |
| **`.github/workflows/e2e.yml`** | Enterprise Master Unified Workflow orchestrating parallel test jobs, load testing (100 VUs), and master report publication. | `push`, `schedule`, `workflow_dispatch` | 6 Consolidated Artifact Bundles |
| **`.github/workflows/deploy-reports.yml`** | Deploys test reports to `gh-pages` branch at `/reports/latest/` and maintains `/reports/history/`. | `workflow_run` (on completion) | Live Web Reports on GitHub Pages |

---

## 3. GitHub Pages & Repository Settings Setup

1. Navigate to **GitHub Repository** -> **Settings** -> **Pages**.
2. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (or Deploy from branch `gh-pages` -> `/root`).
3. Under **Settings** -> **Actions** -> **General**:
   - **Workflow permissions**: Choose **Read and write permissions**.
   - Check **Allow GitHub Actions to create and approve pull requests**.
4. Live Application URL:
   `https://sathwikbethina.github.io/smartpriceAI/`
5. Live Test Reports URL:
   `https://sathwikbethina.github.io/smartpriceAI/reports/latest/execution-report.html`
