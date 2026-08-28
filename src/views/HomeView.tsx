import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../lib/formatters';
import {
  Search,
  Mic,
  TrendingUp,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Heart,
  Bell,
  Clock,
  CheckCircle2,
  Tag,
} from 'lucide-react';
const CATEGORIES = [
  { id: 'all', name: 'All Deals', icon: '🛒' },
  { id: 'grocery', name: 'Groceries', icon: '🥦' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'medicine', name: 'Medicines', icon: '💊' },
  { id: 'skincare', name: 'Beauty & Skin', icon: '✨' },
  { id: 'fashion', name: 'Fashion', icon: '👟' },
  { id: 'food', name: 'Snacks & Food', icon: '🍜' },
  { id: 'baby', name: 'Baby Care', icon: '🍼' },
  { id: 'pets', name: 'Pet Supplies', icon: '🐾' },
  { id: 'books', name: 'Books & Edu', icon: '📚' },
  { id: 'sports', name: 'Fitness & Sports', icon: '⚽' },
  { id: 'furniture', name: 'Home & Kitchen', icon: '🛋️' },
];

const TRENDING_TAGS = [
  'iPhone 15 128GB',
  'Amul Butter 500g',
  'Maggi Masala 12-Pack',
  'Niacinamide 10% Serum',
  'Dettol Liquid 1L',
  'Samsung 1.5 Ton AC',
  'Nike Air Max Shoes',
  'Fortune Sunlite Oil 5L',
  'Aashirvaad Atta 10kg',
  'Cadbury Dairy Milk Silk',
];

const POPULAR_PLATFORMS = [
  {
    name: 'Blinkit',
    eta: '8-12 min',
    color: '#F7C948',
    textColor: 'text-black',
    tag: 'Instant 10-Min Groceries',
    icon: '⚡',
    badge: '10 Min Darkstore',
  },
  {
    name: 'Zepto',
    eta: '10-15 min',
    color: '#7C3AED',
    textColor: 'text-white',
    tag: 'Quick Delivery & Café',
    icon: '🚀',
    badge: 'Zepto Pass Deals',
  },
  {
    name: 'BigBasket',
    eta: '2-4 hrs / BB Daily',
    color: '#84C225',
    textColor: 'text-white',
    tag: 'Super Saver Bulk Grocery',
    icon: '🧺',
    badge: 'BB Star Discount',
  },
  {
    name: 'Amazon India',
    eta: 'Same-Day / Next-Day Prime',
    color: '#111827',
    textColor: 'text-amber-400',
    tag: 'Electronics, Mobiles & Pantry',
    icon: '📦',
    badge: 'Amazon Prime Verified',
  },
  {
    name: 'Flipkart',
    eta: '1-2 days / Flipkart Minutes',
    color: '#2874F0',
    textColor: 'text-amber-300',
    tag: 'Big Billion Deals & Appliances',
    icon: '🛍️',
    badge: 'Flipkart Plus Verified',
  },
  {
    name: 'Tata 1mg',
    eta: 'Same-Day / 24 hrs',
    color: '#FF6F61',
    textColor: 'text-white',
    tag: 'Prescription Drugs & Health Supplements',
    icon: '💊',
    badge: 'Verified Chemists',
  },
  {
    name: 'PharmEasy',
    eta: '24-48 hrs',
    color: '#10847E',
    textColor: 'text-white',
    tag: 'Medicines & Personal Care Essentials',
    icon: '🧪',
    badge: 'PharmEasy Plus Deals',
  },
];

const FEATURED_COMPARISONS = [
  {
    title: 'Apple iPhone 15 (128 GB) - Black',
    query: 'iPhone 15',
    lowestPrice: 65499,
    highestPrice: 79900,
    lowestStore: 'Amazon India',
    savings: 14401,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80',
    storesCount: 6,
  },
  {
    title: 'Amul Pasteurised Butter 500g',
    query: 'Amul butter 500g',
    lowestPrice: 275,
    highestPrice: 295,
    lowestStore: 'Blinkit',
    savings: 20,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&auto=format&fit=crop&q=80',
    storesCount: 5,
  },
  {
    title: 'Minimalist 10% Niacinamide Serum with Zinc',
    query: 'Niacinamide serum',
    lowestPrice: 569,
    highestPrice: 649,
    lowestStore: 'Nykaa',
    savings: 80,
    image: 'https://images.unsplash.com/photo-1608248597359-bb474f83f2a8?w=300&auto=format&fit=crop&q=80',
    storesCount: 7,
  },
  {
    title: 'Maggi 2-Minute Masala Noodles (Pack of 12)',
    query: 'Maggi masala',
    lowestPrice: 154,
    highestPrice: 180,
    lowestStore: 'Zepto',
    savings: 26,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&auto=format&fit=crop&q=80',
    storesCount: 4,
  },
];

export const HomeView: React.FC = () => {
  const {
    user,
    triggerSearch,
    setShowVoiceModal,
    currentCity,
    watchlist,
    priceAlerts,
  } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [localInput, setLocalInput] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'Shopper';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localInput.trim()) {
      triggerSearch(localInput.trim());
    }
  };

  return (
    <div className="space-y-8 pb-16 text-left animate-in fade-in duration-150">
      {/* HERO SECTION (Wide responsive web banner) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A56DB] via-indigo-700 to-[#FF5A1F] text-white p-6 sm:p-10 shadow-2xl shadow-blue-500/20">
        {/* Background decorative ambient circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-black tracking-wide uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Store Scanner • {currentCity}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Compare Major Indian Stores. <br className="hidden sm:inline" />
            <span className="text-amber-300">Never Overpay Again.</span>
          </h1>

          <p className="mt-2.5 text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
            Real-time price comparisons across Quick Commerce (Blinkit, Zepto, BigBasket) and E-Commerce giants (Amazon, Flipkart, Tata 1mg, PharmEasy) with direct seller checkout.
          </p>

          {/* Large Hero Search Input */}
          <form onSubmit={handleSearchSubmit} className="mt-6">
            <div className="relative flex items-center bg-white dark:bg-[#1E2130] rounded-2xl shadow-2xl p-1.5 transition-all focus-within:ring-4 focus-within:ring-white/30">
              <div className="pl-4 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={localInput}
                onChange={(e) => setLocalInput(e.target.value)}
                placeholder="Search any product (e.g. iPhone 15, Amul Butter, Niacinamide) or paste store URL..."
                className="w-full py-3.5 pl-3 pr-24 text-xs sm:text-sm text-slate-900 dark:text-white bg-transparent rounded-2xl focus:outline-none placeholder:text-slate-400 font-medium"
              />

              <div className="absolute right-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowVoiceModal(true)}
                  className="p-2 rounded-xl text-slate-500 hover:text-[#FF5A1F] hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
                  title="Voice search (en-IN)"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1A56DB] to-[#FF5A1F] text-white font-black text-xs shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>Compare</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>

          {/* Simple tagline */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              7 Major Approved Platforms
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              Direct Official Store Prices
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-orange-400" />
              Instant Price Comparison
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID (Responsive 4-12 cols) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Browse by Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a category to compare real-time store prices
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                if (cat.id !== 'all') {
                  triggerSearch(cat.name);
                }
              }}
              className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                selectedCategory === cat.id
                  ? 'bg-[#1A56DB] text-white shadow-lg shadow-blue-500/20 scale-102'
                  : 'bg-white dark:bg-[#1E2130] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[11px] font-bold leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED PRICE DROPS (4-Column Card Grid) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>⚡ Popular Price Comparisons in {currentCity}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase">
                Live Prices
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tap any item to see full price comparison across major platforms
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURED_COMPARISONS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => triggerSearch(item.query)}
              className="p-4 rounded-3xl bg-white dark:bg-[#1E2130] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800 aspect-video mb-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase shadow-sm">
                    Lowest: {item.lowestStore}
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-[10px]">
                    {item.storesCount} stores
                  </div>
                </div>

                <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#1A56DB] dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Best Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      {formatINR(item.lowestPrice)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatINR(item.highestPrice)}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 block">
                    Save up to {formatINR(item.savings)}
                  </span>
                </div>

                <button className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#1A56DB] dark:text-blue-300 group-hover:bg-[#1A56DB] group-hover:text-white font-extrabold text-xs transition-colors flex items-center gap-1">
                  <span>Compare</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONNECTED STORES DIRECTORY (Responsive 4-Column Grid) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Connected Indian Retailers &amp; Darkstores
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live automated inventory and price synchronization
            </p>
          </div>
          <span className="text-xs font-black text-[#1A56DB] dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            All India Coverage
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {POPULAR_PLATFORMS.map((plat) => (
            <div
              key={plat.name}
              onClick={() => triggerSearch(plat.name)}
              className="p-4 rounded-3xl bg-white dark:bg-[#1E2130] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group select-none flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black shadow-xs"
                    style={{ backgroundColor: plat.color }}
                  >
                    <span className={plat.textColor}>{plat.name.charAt(0)}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {plat.eta}
                  </span>
                </div>

                <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#1A56DB] dark:group-hover:text-blue-400 transition-colors">
                  {plat.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {plat.tag}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  {plat.badge}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1A56DB] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
