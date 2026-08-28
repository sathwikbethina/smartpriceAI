import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Check, Sparkles, Zap, Package, ArrowRight, Trash2 } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    triggerSearch,
  } = useApp();

  return (
    <div className="space-y-6 pb-16 text-left animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1E2130] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Notifications &amp; Price Drops 🔔
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time price drop alerts, flash restocks &amp; smart coupon discounts
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#1A56DB] dark:text-blue-400 hover:bg-blue-100 text-xs font-black transition-colors self-start sm:self-auto"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notifications.map((n) => {
          return (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.productQuery) {
                  triggerSearch(n.productQuery);
                }
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer select-none text-left relative flex items-start gap-4 ${
                n.isUnread
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/80 shadow-xs hover:border-blue-300'
                  : 'bg-white dark:bg-[#1E2130] border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {n.isUnread && (
                <span className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-[#FF5A1F] ring-4 ring-orange-500/20" />
              )}

              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700 flex items-center justify-center shrink-0">
                {n.type === 'price_drop' ? (
                  <Zap className="w-6 h-6 text-[#FF5A1F]" />
                ) : n.type === 'stock' ? (
                  <Package className="w-6 h-6 text-emerald-500" />
                ) : (
                  <Sparkles className="w-6 h-6 text-purple-500" />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {n.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {n.description}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {n.timeAgo}
                  </span>
                  {n.productQuery && (
                    <span className="text-[11px] font-black text-[#1A56DB] dark:text-blue-400 flex items-center gap-1 hover:underline">
                      Compare Prices <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
