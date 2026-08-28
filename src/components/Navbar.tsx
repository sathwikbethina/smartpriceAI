import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  ChevronDown,
  Bell,
  ShieldCheck,
  Sparkles,
  Moon,
  Sun,
  Search,
  Mic,
  Heart,
  History,
  Home,
  User,
  SlidersHorizontal,
} from 'lucide-react';

const CITIES_LIST = [
  'Chennai',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Surat',
  'Jaipur',
];

export const Navbar: React.FC = () => {
  const {
    currentCity,
    currentPincode,
    currentArea,
    setShowLocationModal,
    user,
    unreadNotificationCount,
    activeTab,
    setActiveTab,
    setShowApiConfigModal,
    darkMode,
    toggleDarkMode,
    watchlist,
    triggerSearch,
    setShowVoiceModal,
    setShowAuthModal,
    isAuthenticated,
  } = useApp();

  const [navSearchInput, setNavSearchInput] = useState('');

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchInput.trim()) {
      triggerSearch(navSearchInput.trim());
      setNavSearchInput('');
    }
  };

  const navLinks = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'search' as const, label: 'Compare Stores', icon: Search },
    {
      id: 'watchlist' as const,
      label: 'Watchlist',
      icon: Heart,
      badge: watchlist.length > 0 ? watchlist.length : undefined,
    },
    { id: 'history' as const, label: 'History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0F1117]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <div
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1A56DB] to-[#FF5A1F] flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-black text-sm group-hover:scale-105 transition-transform">
                ⚡
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                  SmartPrice<span className="text-[#FF5A1F]">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline leading-none">
                  India Price Engine
                </span>
              </div>
            </div>

            {/* Pincode & City selector button */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-xs font-bold border border-slate-200/60 dark:border-slate-700/60"
              title="Click to enter PIN Code or change delivery city"
            >
              <MapPin className="w-3.5 h-3.5 text-[#1A56DB] dark:text-blue-400 shrink-0" />
              <span className="truncate max-w-[110px] sm:max-w-[160px]">
                {currentCity} ({currentPincode})
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md font-extrabold hidden md:inline">
                10-min ⚡
              </span>
            </button>
          </div>

          {/* Desktop Global Search Bar (Center) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-2">
            <form onSubmit={handleNavSearch} className="w-full relative">
              <div className="relative flex items-center bg-slate-100/90 dark:bg-[#1E2130] rounded-full border border-slate-200/80 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-[#1A56DB] focus-within:bg-white dark:focus-within:bg-[#1E2130] transition-all">
                <div className="pl-3.5 text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={navSearchInput}
                  onChange={(e) => setNavSearchInput(e.target.value)}
                  placeholder="Search iPhone 15, Amul Butter, Niacinamide or paste URL..."
                  className="w-full py-2 pl-2.5 pr-10 text-xs text-slate-900 dark:text-white bg-transparent rounded-full focus:outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowVoiceModal(true)}
                  className="absolute right-2 p-1.5 rounded-full text-slate-500 hover:text-[#FF5A1F] hover:bg-orange-50 dark:hover:bg-orange-950/40 transition-colors"
                  title="Voice Search (en-IN)"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all relative ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-[#1A56DB] dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="bg-[#FF5A1F] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center leading-tight">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & User Account */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>


            {/* Notifications bell */}
            <button
              onClick={() => setActiveTab('notifications')}
              className={`p-2 rounded-xl transition-colors relative ${
                activeTab === 'notifications'
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-[#1A56DB] dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5A1F] ring-2 ring-white dark:ring-[#0F1117] animate-pulse" />
              )}
            </button>

            {/* User profile avatar / button */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setShowAuthModal(true);
                } else {
                  setActiveTab('profile');
                }
              }}
              className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-2xl border transition-all ${
                activeTab === 'profile'
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-[#1A56DB] dark:text-blue-400'
                  : 'border-slate-200/80 dark:border-slate-700 bg-white dark:bg-[#1E2130] text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <img
                src={
                  user?.avatar_url ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={user?.full_name || 'User'}
                className="w-7 h-7 rounded-xl object-cover bg-slate-200 dark:bg-slate-700"
              />
              <span className="text-xs font-bold max-w-[90px] truncate hidden md:inline">
                {user?.full_name ? user.full_name.split(' ')[0] : 'Sign In'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
