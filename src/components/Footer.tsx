import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Zap, Sparkles, Heart, ExternalLink, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentCity, setActiveTab, setShowApiConfigModal } = useApp();

  return (
    <footer className="mt-12 bg-white dark:bg-[#0B0D13] border-t border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1A56DB] to-[#FF5A1F] flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/20">
                ⚡
              </div>
              <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                SmartPrice<span className="text-[#FF5A1F]">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              India's real-time price comparison and quick-commerce intelligence platform. Compare major Indian stores including Blinkit, Zepto, BigBasket, Amazon, and Flipkart.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live in {currentCity}
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2.5 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-[#1A56DB] dark:hover:text-blue-400 transition-colors"
                >
                  Home &amp; Trending Deals
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('search')}
                  className="hover:text-[#1A56DB] dark:hover:text-blue-400 transition-colors"
                >
                  Price Comparison Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('watchlist')}
                  className="hover:text-[#1A56DB] dark:hover:text-blue-400 transition-colors"
                >
                  Price Watchlist &amp; Alerts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('history')}
                  className="hover:text-[#1A56DB] dark:hover:text-blue-400 transition-colors"
                >
                  Search History
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Indian Platforms */}
          <div className="space-y-2.5 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Connected Stores
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Blinkit (10m)',
                'Zepto (10m)',
                'Swiggy Instamart (15m)',
                'BigBasket (2h)',
                'Amazon India',
                'Flipkart',
                'Nykaa',
                'Myntra',
                'Tata 1mg',
                'PharmEasy',
                'Meesho',
                'JioMart',
              ].map((store) => (
                <span
                  key={store}
                  className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-100 dark:bg-[#1E2130] text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800"
                >
                  {store}
                </span>
              ))}
            </div>
          </div>

          {/* Technology & Diagnostics */}
          <div className="space-y-2.5 text-left">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Intelligence &amp; APIs
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Powered by Ollama (Llama 3.2) AI for chemical ingredient formula matching and SerpAPI/QuickCommerce scrapers.
            </p>
            <div>
              <button
                onClick={() => setShowApiConfigModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#1A56DB] dark:hover:text-blue-400 text-xs font-bold transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                API Keys &amp; Diagnostics
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} SmartPrice AI. All product prices and logos belong to respective Indian merchants.</p>
          <div className="flex items-center gap-4">
            <span>Direct seller checkout guaranteed</span>
            <span>•</span>
            <span>Made with ⚡ for Indian Shoppers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
