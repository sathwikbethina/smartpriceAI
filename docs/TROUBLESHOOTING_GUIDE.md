# Troubleshooting & QA Diagnostics Guide

**Project**: SmartPrice AI (`sathwikbethina/smartpriceAI`)  

---

## 1. Selenium Automation Troubleshooting

### Issue 1: `BASE_URL` Returns HTTP 404 on Direct Route Refresh
- **Root Cause**: Single Page Applications (SPAs) deployed on GitHub Pages require Hash Routing or 404 fallback routing.
- **Solution**: Use `HashRouter` or navigate via root `BASE_URL` (`https://sathwikbethina.github.io/smartpriceAI/#/`). The Page Object Models are pre-configured to handle both root and hash paths.

### Issue 2: Chrome Headless Fails in Linux CI Environment
- **Root Cause**: Missing `--no-sandbox` or `--disable-dev-shm-usage` flags.
- **Solution**: The `automation/runner.py` and GitHub Actions runners execute with headless flags and isolated virtual frames automatically.

---

## 2. Appium Mobile Automation Troubleshooting

### Issue 1: Emulator Acceleration Not Available in GitHub Actions
- **Root Cause**: Standard GitHub-hosted `ubuntu-latest` runners do not support hardware nested virtualization (KVM).
- **Solution**: Use software rendering flags (`-no-window -no-audio -gpu swiftshader_indirect`) or the mock/headless CI mobile test runner provided in `mobile_automation/mobile_runner.py`.

### Issue 2: APK Not Found During CI Step
- **Root Cause**: Build path variation between Gradle and Flutter.
- **Solution**: Workflow handles both `android_app/build/app/outputs/flutter-apk/app-debug.apk` and `build/app/outputs/apk/debug/app-debug.apk`.

---

## 3. Load Testing & Performance Troubleshooting

### Issue 1: `k6: command not found` on Local Machine
- **Solution**: Install k6 via package manager:
  - Windows: `winget install k6 --source winget` or `choco install k6`
  - macOS: `brew install k6`
  - Linux: `sudo apt-get install k6`
- **Alternative**: Run Artillery with `npx artillery run "Vulnerability Test Results/artillery-load-test.yml"`.

---

## 4. Excel & Spreadsheets Generation Troubleshooting

### Issue 1: `ModuleNotFoundError: No module named 'openpyxl'`
- **Solution**: Run `pip install openpyxl` or `python -m pip install openpyxl`.

### Issue 2: Unicode Encoding Error in Windows CMD
- **Solution**: The Python runners in this repository automatically invoke `sys.stdout.reconfigure(encoding='utf-8')` to ensure smooth execution on Windows systems.
