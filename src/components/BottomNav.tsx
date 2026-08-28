import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Search, Heart, History, User, LucideIcon } from 'lucide-react';

interface NavItem {
  id: 'home' | 'search' | 'watchlist' | 'history' | 'profile';
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, watchlist } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    {
      id: 'watchlist',
      label: 'Watchlist',
      icon: Heart,
      badge: watchlist.length > 0 ? watchlist.length : undefined,
    },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0F1117]/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-lg">
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-[#FF5A1F] font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[2.5px]' : 'stroke-2'
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 bg-[#FF5A1F] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center leading-tight shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-0.5 tracking-tight ${
                  isActive ? 'text-[#FF5A1F] font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
