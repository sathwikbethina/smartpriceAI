import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SearchRecord } from '../types';
import { formatRelativeTime } from '../lib/formatters';
import { History, Search, ArrowRight, Trash2, Clock, RotateCcw, Sparkles } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { searches, clearSearches, deleteSearchItem, triggerSearch } = useApp();

  // Group searches into Today, Yesterday, This Week / Older
  const groupedSearches = useMemo(() => {
    const today: SearchRecord[] = [];
    const yesterday: SearchRecord[] = [];
    const thisWeek: SearchRecord[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;

    searches.forEach((item) => {
      const time = new Date(item.searched_at).getTime();
      if (time >= todayStart) {
        today.push(item);
      } else if (time >= yesterdayStart) {
        yesterday.push(item);
      } else {
        thisWeek.push(item);
      }
    });

    return { today, yesterday, thisWeek };
  }, [searches]);

  return (
    <div className="space-y-6 pb-16 text-left animate-in fade-in duration-150">
      {/* Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1E2130] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Search History 🕒
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your recent store queries, product searches, and multi-store lookups
          </p>
        </div>

        {searches.length > 0 && (
          <button
            onClick={clearSearches}
            className="px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-black transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            Clear All History
          </button>
        )}
      </div>

      {searches.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#1E2130] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <History className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-black text-slate-800 dark:text-slate-200">
            No search history yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Searches for Indian e-commerce products will be saved here so you can quickly re-check current store prices in 1 tap.
          </p>
          <button
            onClick={() => triggerSearch('Amul butter')}
            className="mt-2 px-4 py-2 rounded-xl bg-[#1A56DB] text-white font-extrabold text-xs inline-flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            Search Amul Butter
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Today Group */}
          {groupedSearches.today.length > 0 && (
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-3 px-1">
                Searched Today ({groupedSearches.today.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupedSearches.today.map((item) => (
                  <HistoryItemCard
                    key={item.id}
                    item={item}
                    onRepeat={() => triggerSearch(item.query)}
                    onDelete={() => deleteSearchItem(item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Yesterday Group */}
          {groupedSearches.yesterday.length > 0 && (
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-3 px-1">
                Yesterday ({groupedSearches.yesterday.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupedSearches.yesterday.map((item) => (
                  <HistoryItemCard
                    key={item.id}
                    item={item}
                    onRepeat={() => triggerSearch(item.query)}
                    onDelete={() => deleteSearchItem(item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Earlier This Week Group */}
          {groupedSearches.thisWeek.length > 0 && (
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-3 px-1">
                Earlier This Week &amp; Older ({groupedSearches.thisWeek.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {groupedSearches.thisWeek.map((item) => (
                  <HistoryItemCard
                    key={item.id}
                    item={item}
                    onRepeat={() => triggerSearch(item.query)}
                    onDelete={() => deleteSearchItem(item.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const HistoryItemCard: React.FC<{
  item: SearchRecord;
  onRepeat: () => void;
  onDelete: () => void;
}> = ({ item, onRepeat, onDelete }) => {
  return (
    <div
      onClick={onRepeat}
      className="p-4 rounded-2xl bg-white dark:bg-[#1E2130] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between gap-3 cursor-pointer group select-none text-left"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-[#1A56DB] dark:text-blue-400 flex items-center justify-center shrink-0">
          <Search className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate group-hover:text-[#1A56DB] dark:group-hover:text-blue-400 transition-colors">
            {item.query}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span>{formatRelativeTime(item.searched_at)}</span>
            <span>•</span>
            <span>{item.city}</span>
            {item.result_count > 0 && (
              <>
                <span>•</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {item.result_count} stores
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
          title="Delete search"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-[#1A56DB] flex items-center justify-center transition-colors">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
