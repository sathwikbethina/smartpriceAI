# 📱 SmartPrice AI - Android Mobile App (Flutter)

A cross-platform Flutter mobile application for **SmartPrice AI** built in `d:\SRINIVAS\src\android_app`.

---

## 🌟 Key App Features

1. **Live Multi-Store Comparison**:
   - Compares prices across approved Indian platforms:
     - **Groceries & Daily**: Blinkit, Zepto, BigBasket, Amazon
     - **Medicines**: Tata 1mg, PharmEasy
     - **Electronics**: Amazon, Flipkart
     - **General Products**: Amazon, Flipkart
2. **Unified Store Comparison UI**:
   - Single list ordered from lowest to highest price.
   - Highlights **⚡ Lowest Price** deal.
   - Shows delivery speed, in-stock status, and MRP discounts.
3. **Direct Buy Now Redirect**:
   - Opens official product pages in browser/app via `url_launcher`.
4. **Watchlist & Price Alerts**:
   - Offline persistent storage using `shared_preferences`.
5. **Dark & Light Mode**:
   - Sleek Material 3 glassmorphism design with custom brand colors.

---

## 🚀 How to Run the App

### Step 1: Install Flutter SDK (If not installed)
1. Download Flutter SDK for Windows from [flutter.dev](https://docs.flutter.dev/get-started/install/windows).
2. Extract zip to `C:\src\flutter`.
3. Add `C:\src\flutter\bin` to your System **PATH** Environment Variables.

### Step 2: Open Project & Install Packages
Open command prompt or terminal in `d:\SRINIVAS\src\android_app`:
```bash
cd d:\SRINIVAS\src\android_app
flutter pub get
```

### Step 3: Backend IP Configuration (`api_service.dart`)
- **Android Emulator**: Uses `http://10.0.2.2:3000` (pre-configured).
- **Physical Android Phone**:
  1. Make sure phone and laptop are connected to the same Wi-Fi network.
  2. Find your laptop's local IP address (`ipconfig` in cmd, e.g. `192.168.1.5`).
  3. Open [`lib/services/api_service.dart`](file:///d:/SRINIVAS/src/android_app/lib/services/api_service.dart) and change `baseUrl`:
     ```dart
     static String baseUrl = 'http://192.168.1.5:3000';
     ```

### Step 4: Run on Android Device / Emulator
1. Start your Android Emulator via Android Studio or plug in your phone via USB with USB Debugging enabled.
2. Run:
```bash
flutter run
```

---

## 🛠️ Manual Implementation Checklist

- [x] **Backend Server Running**: Make sure the dev server daemon (`npm run dev`) is running on port `3000`.
- [x] **Internet Permission**: Configured in `AndroidManifest.xml` with `usesCleartextTraffic="true"`.
- [x] **URL Launcher**: Direct redirection to store URLs configured in `StoreComparisonCard`.
- [x] **Watchlist Persistence**: Saved items stored locally via `SharedPreferences`.
