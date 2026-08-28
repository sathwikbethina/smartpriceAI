import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR, formatRelativeTime } from '../lib/formatters';
import {
  Heart,
  Bell,
  Trash2,
  ArrowUpRight,
  CheckCircle2,
  TrendingDown,
  ExternalLink,
  Sparkles,
  Search,
} from 'lucide-react';

export const WatchlistView: React.FC = () => {
  const {
    watchlist,
    removeFromWatchlist,
    priceAlerts,
    togglePriceAlert,
    deletePriceAlert,
    setSelectedProductForRedirect,
    setSelectedProductForHistory,
    triggerSearch,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'watching' | 'alerts'>('watching');

  return (
    <div className="space-y-6 pb-16 text-left animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1E2130] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Watchlist &amp; Price Alerts 🎯
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated price drop monitoring across major Indian stores
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setActiveTab('watching')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'watching'
                ? 'bg-white dark:bg-[#1E2130] text-[#1A56DB] dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Watching ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'alerts'
                ? 'bg-white dark:bg-[#1E2130] text-[#FF5A1F] shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Price Alerts ({priceAlerts.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Watching (Responsive Grid) */}
      {activeTab === 'watching' && (
        <div>
          {watchlist.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#1E2130] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-black text-slate-800 dark:text-slate-200">
                Your watchlist is currently empty
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Tap the heart icon on any product in Search or Home to track daily price drops and receive instant alerts.
              </p>
              <button
                onClick={() => triggerSearch('iPhone 15')}
                className="mt-2 px-4 py-2 rounded-xl bg-[#1A56DB] text-white font-extrabold text-xs inline-flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                Explore Trending Deals
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlist.map((item) => {
                const current = item.current_price;
                const target = item.target_price || Math.round(current * 0.9);
                const progressPct = Math.min(
                  100,
                  Math.max(0, Math.round((target / current) * 100))
                );

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#1E2130] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all text-left flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-4">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-20 h-20 rounded-2xl object-cover bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[#1A56DB] dark:text-blue-400">
                              {item.platform}
                            </span>
                            <button
                              onClick={() => removeFromWatchlist(item.id)}
                              className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-2 mt-1.5 leading-snug">
                            {item.product_name}
                          </h4>

                          <div className="flex items-baseline gap-3 mt-2">
                            <div>
                              <span className="text-[10px] text-slate-400 block font-medium">
                                Current
                              </span>
                              <span className="text-sm font-black text-slate-900 dark:text-white">
                                {formatINR(item.current_price)}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block font-medium">
                                Target
                              </span>
                              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                                {formatINR(item.target_price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Target Price Distance Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-1">
                          <span>Target Distance</span>
                          <span
                            className={
                              item.current_price <= item.target_price
                                ? 'text-emerald-500 font-extrabold'
                                : 'text-slate-500'
                            }
                          >
                            {item.current_price <= item.target_price
                              ? '🎯 TARGET HIT!'
                              : `${formatINR(item.current_price - item.target_price)} to drop`}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.current_price <= item.target_price
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-[#1A56DB] to-[#FF5A1F]'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => triggerSearch(item.product_name)}
                        className="text-xs font-extrabold text-[#1A56DB] dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        Compare All Stores <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          setSelectedProductForRedirect({
                            name: item.product_name,
                            price: item.current_price,
                            mrp: item.current_price * 1.15,
                            platform: item.platform,
                            url: item.product_url,
                            image: item.product_image,
                            delivery: 'Standard Delivery',
                            in_stock: true,
                            source: 'live',
                          })
                        }
                        className="py-2 px-4 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 active:scale-95 transition-all shadow-xs"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Price Alerts (Responsive Grid) */}
      {activeTab === 'alerts' && (
        <div>
          {priceAlerts.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#1E2130] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-base font-black text-slate-800 dark:text-slate-200">
                No active price alerts
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Set a target price on any product to receive real-time push notifications, emails, or WhatsApp alerts when the seller drops the price.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {priceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-5 rounded-3xl bg-white dark:bg-[#1E2130] border border-slate-200/80 dark:border-slate-800 shadow-sm text-left flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FF5A1F]">
                            {alert.platform}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatRelativeTime(alert.created_at)}
                          </span>
                        </div>

                        <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-2 leading-snug">
                          {alert.product_name}
                        </h4>
                      </div>

                      {/* Active switch */}
                      <button
                        onClick={() => togglePriceAlert(alert.id, !alert.is_active)}
                        className={`w-10 h-5 rounded-full transition-colors relative p-0.5 shrink-0 ${
                          alert.is_active ? 'bg-[#FF5A1F]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            alert.is_active ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Current Price
                        </span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                          {formatINR(alert.current_price)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          Target Alert Price
                        </span>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                          {formatINR(alert.target_price)}
                        </span>
                      </div>
                      <button
                        onClick={() => deletePriceAlert(alert.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Channels Badge */}
                  <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                    <span>Channels:</span>
                    {alert.notify_push && (
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold">
                        Push
                      </span>
                    )}
                    {alert.notify_email && (
                      <span className="px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 font-bold">
                        Email
                      </span>
                    )}
                    {alert.notify_whatsapp && (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 font-bold">
                        WhatsApp
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
