import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { OnboardingModal } from './components/OnboardingModal';
import { LocationAppsPermissionModal } from './components/LocationAppsPermissionModal';
import { AppRedirectSheet } from './components/AppRedirectSheet';
import { SetPriceAlertModal } from './components/SetPriceAlertModal';
import { PriceHistoryModal } from './components/PriceHistoryModal';
import { ApiConfigModal } from './components/ApiConfigModal';
import { AuthModal } from './views/AuthModal';
import { SplashScreen } from './components/SplashScreen';
import { LocationPincodeModal } from './components/LocationPincodeModal';

import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { WatchlistView } from './views/WatchlistView';
import { HistoryView } from './views/HistoryView';
import { NotificationsView } from './views/NotificationsView';
import { ProfileView } from './views/ProfileView';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0B0D13] text-slate-900 dark:text-slate-100 font-sans antialiased flex flex-col justify-between selection:bg-[#FF5A1F] selection:text-white transition-colors duration-200">
      {/* 5-Second Startup Splash Screen */}
      <SplashScreen />

      {/* Full-width Responsive Header */}
      <Navbar />

      {/* Main Responsive Web & Mobile Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'search' && <SearchView />}
        {activeTab === 'watchlist' && <WatchlistView />}
        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'notifications' && <NotificationsView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Desktop & Web Responsive Footer */}
      <Footer />

      {/* Mobile-Only Bottom Navigation */}
      <BottomNav />

      {/* Global Modals & Sheets */}
      <ToastContainer />
      <VoiceSearchModal />
      <OnboardingModal />
      <LocationAppsPermissionModal />
      <LocationPincodeModal />
      <AppRedirectSheet />
      <SetPriceAlertModal />
      <PriceHistoryModal />
      <ApiConfigModal />
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
