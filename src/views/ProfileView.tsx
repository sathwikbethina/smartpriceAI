import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../lib/formatters';
import {
  User,
  Smartphone,
  Moon,
  Sun,
  MapPin,
  HelpCircle,
  LogOut,
  LogIn,
  ShieldCheck,
  Heart,
  Search,
  ChevronRight,
  Sparkles,
  Edit2,
  Check,
  Zap,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isGuest,
    logoutUser,
    setShowAuthModal,
    setShowPermissionsWizard,
    setShowApiConfigModal,
    darkMode,
    toggleDarkMode,
    watchlist,
    searches,
    installedApps,
    updateUserProfile,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user?.full_name || '');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '');

  const handleSaveProfile = async () => {
    await updateUserProfile({
      full_name: nameInput,
      phone: phoneInput,
    });
    setIsEditing(false);
  };

  const installedCount = installedApps.filter((a) => a.is_installed).length;

  return (
    <div className="space-y-6 pb-16 text-left animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white dark:bg-[#1E2130] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Account &amp; Store Preferences 👤
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your profile, sync preferences, and direct 1-tap store deep linking
        </p>
      </div>

      {/* Two-Column Dashboard Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Profile Card & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E2130] border border-slate-200/80 dark:border-slate-800 shadow-sm text-left">
            <div className="flex flex-col items-center text-center">
              <img
                src={
                  user?.avatar_url ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                }
                alt="Profile"
                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-md mb-3"
              />

              {isEditing ? (
                <div className="w-full space-y-2 mt-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full text-xs font-bold px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700"
                    placeholder="Full Name"
                  />
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full text-xs font-medium px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700"
                    placeholder="Phone number (+91)"
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="w-full py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1"
                  >
                    <Check className="w-4 h-4" /> Save Profile
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {user?.full_name || 'Guest Shopper'}
                    </h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-slate-400 hover:text-[#1A56DB] transition-colors"
                      title="Edit details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {user?.email || 'sathwikbethina@gmail.com'}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-medium">
                    <span>{user?.phone || '+91 98765 43210'}</span>
                    <span>•</span>
                    <span>📍 {user?.city || 'Chennai'}</span>
                  </div>
                </>
              )}
            </div>

            {/* Savings & Activity Highlight */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Searches
                </span>
                <span className="text-sm font-black text-slate-900 dark:text-white mt-1 block">
                  {searches.length}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Watchlist
                </span>
                <span className="text-sm font-black text-[#1A56DB] dark:text-blue-400 mt-1 block">
                  {watchlist.length}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  Saved ₹
                </span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {formatINR(user?.total_savings || 4280)}
                </span>
              </div>
            </div>
          </div>

          {/* Auth Action */}
          <div>
            {isAuthenticated && !isGuest ? (
              <button
                onClick={logoutUser}
                className="w-full py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-black text-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#1A56DB] to-[#FF5A1F] text-white font-black text-xs shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Sync Across Devices
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Settings & App Management Cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Installed Apps Management */}
          <div
            onClick={() => setShowPermissionsWizard(true)}
            className="p-5 rounded-3xl bg-white dark:bg-[#1E2130] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#FF5A1F] flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Installed Store Apps &amp; Deep Linking
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {installedCount} apps configured for instant 1-tap app launch (Blinkit, Zepto, Amazon, Flipkart...)
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Dark Mode Switch */}
          <div
            onClick={toggleDarkMode}
            className="p-5 rounded-3xl bg-white dark:bg-[#1E2130] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center shrink-0">
                {darkMode ? (
                  <Sun className="w-6 h-6 text-amber-400" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Theme Appearance
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {darkMode
                    ? 'Dark theme active (#0B0D13 background)'
                    : 'Light theme active'}
                </p>
              </div>
            </div>
            {/* Toggle switch pill */}
            <div
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                darkMode ? 'bg-[#1A56DB]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* API & Backend Diagnostics */}
          <div
            onClick={() => setShowApiConfigModal(true)}
            className="p-5 rounded-3xl bg-white dark:bg-[#1E2130] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  API Diagnostics &amp; Cloud Integrations
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage SerpAPI, QuickCommerce darkstore scrapers &amp; Supabase credentials
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Quick Commerce Delivery Information Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#FF5A1F]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                How Direct Checkout Works
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              When you click <strong>Buy Now</strong>, SmartPrice AI automatically launches the merchant's exact product page or app without taking any synthetic referral fees. If you have the Blinkit, Zepto, Amazon or Flipkart app installed, it deep links directly into your cart!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
