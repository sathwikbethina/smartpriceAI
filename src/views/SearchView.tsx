import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, AIAlternative } from '../types';
import {
  formatINR,
  calculateDiscount,
  calculateHigherPercentage,
  getStoreMeta,
} from '../lib/formatters';
import {
  Search,
  Mic,
  Filter,
  ArrowRight,
  Bell,
  Heart,
  LineChart,
  Sparkles,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Clock,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { AIAlternativesSection } from '../components/AIAlternativesSection';


export const SearchView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeSearchTrigger,
    currentCity,
    currentPincode,
    currentArea,
    setShowLocationModal,
    coordinates,
    recordSearch,
    setSelectedProductForRedirect,
    setSelectedProductForAlert,
    setSelectedProductForHistory,
    addToWatchlist,
    setShowVoiceModal,
    showToast,
  } = useApp();

  const [inputVal, setInputVal] = useState(searchQuery || 'iPhone 15');
  const [products, setProducts] = useState<Product[]>([]);
  const [alternatives, setAlternatives] = useState<AIAlternative[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [hasLiveKeys, setHasLiveKeys] = useState(false);

  // Filter & sort states
  const [activeFilter, setActiveFilter] = useState<'all' | 'fastest' | 'lowest' | 'instock'>('all');
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('price_asc');
  const [minDiscount, setMinDiscount] = useState<number>(0);

  const executeSearch = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;
    setLoading(true);
    setLoadingAi(true);
    setProducts([]);
    setAlternatives([]);

    try {
      // 1. Search products across Indian stores
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSearch,
          city: currentCity,
          lat: coordinates[0],
          lon: coordinates[1],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setHasLiveKeys(Boolean(data.hasLiveKeys));
        recordSearch(data.query || queryToSearch, data.count || 0);

        // 2. Fetch Ollama AI Alternatives in parallel
        fetch('/api/ai-alternatives', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: data.query || queryToSearch,
            category: data.products?.[0]?.category || 'general',
          }),
        })
          .then((aiRes) => aiRes.json())
          .then((aiData) => {
            setAlternatives(aiData.alternatives || []);
          })
          .catch((err) => console.warn('AI alternatives note:', err))
          .finally(() => setLoadingAi(false));
      }
    } catch (err) {
      console.error('Search error:', err);
      showToast('Search connection issue', 'Please retry in a moment.', 'warning');
    } finally {
      setLoading(false);
    }
  };

  // Perform search on mount or when activeSearchTrigger updates
  useEffect(() => {
    const q = activeSearchTrigger || searchQuery || 'iPhone 15';
    setInputVal(q);
    executeSearch(q);
  }, [activeSearchTrigger, currentCity, currentPincode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setSearchQuery(inputVal.trim());
      executeSearch(inputVal.trim());
    }
  };

  // Available unique store names in current search
  const availableStores = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.platform));
    return Array.from(set);
  }, [products]);

  // Filtered & Sorted Products
  const processedProducts = useMemo(() => {
    let list = [...products];

    // Store multi-selection filter
    if (selectedStores.length > 0) {
      list = list.filter((p) => selectedStores.includes(p.platform));
    }

    // Quick filters
    if (activeFilter === 'fastest') {
      list.sort((a, b) => {
        const aFast = a.delivery.toLowerCase().includes('min')
          ? 1
          : a.delivery.toLowerCase().includes('same')
          ? 2
          : 3;
        const bFast = b.delivery.toLowerCase().includes('min')
          ? 1
          : b.delivery.toLowerCase().includes('same')
          ? 2
          : 3;
        return aFast - bFast;
      });
    } else if (activeFilter === 'instock') {
      list = list.filter((p) => p.in_stock);
    }

    // Min Discount filter
    if (minDiscount > 0) {
      list = list.filter((p) => {
        const disc = calculateDiscount(p.price, p.mrp);
        return disc >= minDiscount;
      });
    }

    // Sorting
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [products, activeFilter, selectedStores, minDiscount, sortBy]);

  // Segment into Local Pincode Darkstores vs Pan-India Online Stores
  const { localPincodeStores, panIndiaStores } = useMemo(() => {
    const localList: Product[] = [];
    const nationalList: Product[] = [];

    const localKeywords = ['blinkit', 'zepto', 'bigbasket', '1mg', 'pharmeasy'];

    processedProducts.forEach((item) => {
      const platLower = item.platform.toLowerCase();
      const delLower = item.delivery.toLowerCase();
      const isLocal = localKeywords.some((k) => platLower.includes(k)) || delLower.includes('min') || delLower.includes('hour');

      if (isLocal) {
        localList.push(item);
      } else {
        nationalList.push(item);
      }
    });

    return { localPincodeStores: localList, panIndiaStores: nationalList };
  }, [processedProducts]);

  const bestDeal = processedProducts.length > 0 ? processedProducts[0] : null;

  const handleToggleStoreFilter = (storeName: string) => {
    if (selectedStores.includes(storeName)) {
      setSelectedStores(selectedStores.filter((s) => s !== storeName));
    } else {
      setSelectedStores([...selectedStores, storeName]);
    }
  };

  const handleResetFilters = () => {
    setActiveFilter('all');
    setSelectedStores([]);
    setMinDiscount(0);
    setSortBy('price_asc');
  };

  return (
    <div className="space-y-6 pb-16 text-left animate-in fade-in duration-150">
      {/* Top Search & Header Bar */}
      <div className="bg-white dark:bg-[#1E2130] p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 focus-within:ring-2 focus-within:ring-[#1A56DB] transition-all">
            <div className="pl-4 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Search product (e.g. iPhone 15, Amul Butter) or paste store product URL..."
              className="w-full py-3.5 pl-3 pr-24 text-sm text-slate-900 dark:text-white bg-transparent rounded-2xl focus:outline-none placeholder:text-slate-400 font-medium"
            />
            <div className="absolute right-2 flex items-center gap-1.5">
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
                className="px-4 py-2 rounded-xl bg-[#1A56DB] hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Search Metadata & Pincode Status Pill */}
        {!loading && products.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white">
                Results for "{inputVal}":
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-black text-[11px]">
                {processedProducts.length} stores compared
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <button
                onClick={() => setShowLocationModal(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#1A56DB] dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 transition-colors"
              >
                <span>📍 PIN {currentPincode} ({currentArea})</span>
                <span className="underline text-[10px]">Change</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout: Filters Sidebar + Results Area */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT SIDEBAR: FILTERS & REFINEMENTS (Desktop Sticky / Mobile Collapsible) */}
        <aside className="w-full lg:w-72 shrink-0 bg-white dark:bg-[#1E2130] p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 lg:sticky lg:top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#1A56DB] dark:text-blue-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Filter &amp; Refine
              </h3>
            </div>
            {(activeFilter !== 'all' || selectedStores.length > 0 || minDiscount > 0) && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Delivery Speed &amp; Stock
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                  activeFilter === 'all'
                    ? 'bg-[#1A56DB] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                All Stores
              </button>

              <button
                onClick={() => setActiveFilter('fastest')}
                className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all flex items-center gap-1 ${
                  activeFilter === 'fastest'
                    ? 'bg-[#FF5A1F] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>⚡ 10-15 Min</span>
              </button>

              <button
                onClick={() => {
                  setActiveFilter('lowest');
                  setSortBy('price_asc');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                  activeFilter === 'lowest'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Lowest Price
              </button>

              <button
                onClick={() => setActiveFilter(activeFilter === 'instock' ? 'all' : 'instock')}
                className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                  activeFilter === 'instock'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                In Stock Only
              </button>
            </div>
          </div>

          {/* Sort By Selector */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Sort Results By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 focus:outline-none"
            >
              <option value="price_asc">Price: Low to High (Cheapest first)</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Store Rating / Popularity</option>
            </select>
          </div>

          {/* Minimum Discount Filter */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Minimum Discount %
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[0, 10, 20, 30, 50].map((disc) => (
                <button
                  key={disc}
                  onClick={() => setMinDiscount(disc)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    minDiscount === disc
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {disc === 0 ? 'Any' : `${disc}%+ Off`}
                </button>
              ))}
            </div>
          </div>

          {/* Store Selection Checkboxes */}
          {availableStores.length > 0 && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Filter by Store ({availableStores.length})
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {availableStores.map((store) => {
                  const isChecked = selectedStores.length === 0 || selectedStores.includes(store);
                  return (
                    <label
                      key={store}
                      className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStores.includes(store)}
                        onChange={() => handleToggleStoreFilter(store)}
                        className="rounded text-[#1A56DB] focus:ring-0 w-3.5 h-3.5"
                      />
                      <span>{store}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT MAIN CONTENT: BEST DEAL CARD + STORE COMPARISON + AI SUBSTITUTES */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Loading Spinner */}
          {loading && (
            <div className="p-12 text-center bg-white dark:bg-[#1E2130] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 border-4 border-[#1A56DB] border-t-transparent rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Scanning major Indian platforms for "{inputVal}"
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Checking real-time prices &amp; stocks across Blinkit, Zepto, BigBasket, Amazon, Flipkart, Tata 1mg, PharmEasy...
                </p>
              </div>
            </div>
          )}

          {/* Out of stock warning banner */}
          {!loading && products.length === 0 && (
            <div className="p-8 text-center bg-white dark:bg-[#1E2130] rounded-3xl border border-rose-200 dark:border-rose-900 shadow-sm space-y-3">
              <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                No direct seller listings found for "{inputVal}"
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                The product might be out of stock in your selected city ({currentCity}) or requires a different search keyword. Check out Gemini AI's active ingredient substitutes below!
              </p>
            </div>
          )}

          {/* BEST DEAL HERO CARD (Wide Banner Format) */}
          {!loading && bestDeal && (
            <div className="rounded-3xl bg-white dark:bg-[#1E2130] border-2 border-emerald-500 shadow-xl overflow-hidden text-left transition-all">
              {/* Best deal ribbon header */}
              <div className="bg-emerald-600 text-white px-5 py-2.5 text-xs font-black tracking-wider uppercase flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-white" />
                  <span>⚡ LOWEST PRICE IN INDIA FOUND</span>
                </span>
                <span className="text-[11px] font-bold opacity-90">
                  Direct Verified Seller • {bestDeal.platform}
                </span>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Large Product Image */}
                  <img
                    src={bestDeal.image}
                    alt={bestDeal.name}
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shrink-0 shadow-sm"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      if (!t.dataset.fallback) {
                        t.dataset.fallback = '1';
                        t.src = `https://placehold.co/200x200/f1f5f9/64748b?text=${encodeURIComponent(bestDeal.platform)}`;
                      }
                    }}
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[#1A56DB] dark:text-blue-300 font-extrabold text-xs">
                        {bestDeal.platform}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {bestDeal.delivery}
                      </span>
                      {bestDeal.in_stock && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> In Stock
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {bestDeal.name}
                    </h2>

                    {/* Price & Savings Row */}
                    <div className="flex flex-wrap items-baseline gap-3 mt-3">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                        {formatINR(bestDeal.price)}
                      </span>
                      {bestDeal.mrp > bestDeal.price && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatINR(bestDeal.mrp)}
                        </span>
                      )}
                      {bestDeal.mrp > bestDeal.price && (
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black">
                          Save {calculateDiscount(bestDeal.price, bestDeal.mrp)}% ({formatINR(bestDeal.mrp - bestDeal.price)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons Row */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedProductForHistory(bestDeal)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#1A56DB] hover:bg-blue-50 dark:hover:bg-blue-900/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="View 90-Day Price History Chart"
                    >
                      <LineChart className="w-4 h-4 text-blue-500" />
                      <span>90-Day Price Trend</span>
                    </button>

                    <button
                      onClick={() => setSelectedProductForAlert(bestDeal)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#FF5A1F] hover:bg-orange-50 dark:hover:bg-orange-950/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Set Price Drop Alert"
                    >
                      <Bell className="w-4 h-4 text-[#FF5A1F]" />
                      <span>Price Drop Alert</span>
                    </button>

                    <button
                      onClick={() =>
                        addToWatchlist({
                          product_name: bestDeal.name,
                          product_image: bestDeal.image,
                          platform: bestDeal.platform,
                          current_price: bestDeal.price,
                          target_price: Math.round(bestDeal.price * 0.9),
                          product_url: bestDeal.url,
                          category: bestDeal.category || 'General',
                          is_notified: false,
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-500 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Add to Watchlist"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Watchlist</span>
                    </button>
                  </div>

                  {/* CRITICAL RULE: Buy Now Button uses exact product.url with url_type awareness */}
                  <button
                    onClick={() => setSelectedProductForRedirect(bestDeal)}
                    className="py-3 px-6 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>{bestDeal.url_type === 'direct' ? `Buy Now on ${bestDeal.platform}` : `Search on ${bestDeal.platform}`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* UNIFIED STORE PRICE COMPARISON LIST */}
          {!loading && processedProducts.length > 0 && (
            <section className="bg-white dark:bg-[#1E2130] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Compare {processedProducts.length} Available Prices</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Live prices across approved platforms • Deliverable to {currentCity} ({currentPincode})
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  Sorted by Lowest Price
                </span>
              </div>

              <div className="space-y-3">
                {processedProducts.map((item, idx) => {
                  const meta = getStoreMeta(item.platform);
                  const isCheapest = idx === 0;
                  const higherPct = bestDeal && !isCheapest
                    ? calculateHigherPercentage(item.price, bestDeal.price)
                    : 0;

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedProductForRedirect(item)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isCheapest
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700'
                          : 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                      }`}
                    >
                      {/* Left: Store info */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-xs"
                          style={{ backgroundColor: meta.accentHex }}
                        >
                          {item.platform.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              {item.platform}
                            </span>
                            {isCheapest ? (
                              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                                ⚡ Lowest Price
                              </span>
                            ) : higherPct > 0 ? (
                              <span className="text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full">
                                +{higherPct}% higher than {bestDeal?.platform}
                              </span>
                            ) : null}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{item.delivery || meta.eta}</span>
                            <span>•</span>
                            <span className={item.in_stock ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-500'}>
                              {item.in_stock ? 'In Stock' : 'Limited Stock'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Buy Action */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800">
                        <div className="text-left sm:text-right">
                          <div className="text-base font-black text-slate-900 dark:text-white">
                            {formatINR(item.price)}
                          </div>
                          {item.mrp > item.price && (
                            <div className="flex items-center sm:justify-end gap-1.5 text-[11px]">
                              <span className="text-slate-400 line-through">
                                {formatINR(item.mrp)}
                              </span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {calculateDiscount(item.price, item.mrp)}% off
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProductForAlert(item);
                            }}
                            className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-400 hover:text-[#FF5A1F] border border-slate-200 dark:border-slate-700 transition-colors"
                            title="Set Alert on this store"
                          >
                            <Bell className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProductForRedirect(item);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#FF5A1F] hover:bg-orange-600 text-white font-extrabold text-xs transition-colors flex items-center gap-1"
                          >
                            <span>{item.url_type === 'direct' ? 'Buy Now' : `Search ${item.platform}`}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* GEMINI 3.7 AI ALTERNATIVES SECTION */}
          <AIAlternativesSection
            alternatives={alternatives}
            originalQuery={inputVal}
            loading={loadingAi}
          />
        </div>
      </div>
    </div>
  );
};
