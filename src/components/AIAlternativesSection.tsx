import React from 'react';
import { AIAlternative } from '../types';
import { useApp } from '../context/AppContext';
import { getMatchScoreStyle, formatINR } from '../lib/formatters';
import { Sparkles, ArrowRight, Cpu, Zap } from 'lucide-react';

interface Props {
  alternatives: AIAlternative[];
  originalQuery: string;
  loading?: boolean;
}

export const AIAlternativesSection: React.FC<Props> = ({
  alternatives,
  originalQuery,
  loading,
}) => {
  const { triggerSearch } = useApp();

  if (loading) {
    return (
      <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/80 to-purple-50/60 dark:from-slate-900/70 dark:to-purple-950/30 border border-blue-200/60 dark:border-blue-900/40 text-center space-y-3">
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1A56DB] to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-black text-slate-800 dark:text-white">
            AI is analyzing smart substitutes &amp; alternatives...
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          Scanning specs, active ingredients and verified Indian store catalogs for the best substitutes
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#1A56DB] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!alternatives || alternatives.length === 0) return null;

  return (
    <section className="bg-white dark:bg-[#1E2130] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1A56DB] to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              AI Smart Alternatives and Substitutes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Same specs, active ingredients &amp; use cases — verified across Indian stores
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/60 dark:to-purple-950/60 text-[#1A56DB] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <Cpu className="w-3 h-3" />
          AI Engine
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {alternatives.map((alt, idx) => {
          const scoreStyle = getMatchScoreStyle(alt.match_score);
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-gradient-to-br from-slate-50/80 to-white dark:from-slate-900/60 dark:to-slate-900/40 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-blue-300/60 dark:hover:border-blue-700/50 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{alt.brand}</span>
                  <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${scoreStyle.bg} ${scoreStyle.text} flex items-center gap-1`}>
                    <Zap className="w-3 h-3" />
                    {alt.match_score}% Match
                  </div>
                </div>

                <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug mb-3">{alt.name}</h4>

                <div className="p-3 rounded-xl bg-blue-50/90 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200 leading-relaxed">
                  <strong className="font-black text-[#1A56DB] dark:text-blue-400">Why it works: </strong>
                  {alt.why}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {alt.ingredients?.map((ing, i) => (
                    <span key={`ing-${i}`} className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                      {ing}
                    </span>
                  ))}
                  {alt.uses?.map((use, u) => (
                    <span key={`use-${u}`} className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
                      {use}
                    </span>
                  ))}
                </div>

                {alt.sampleStores && alt.sampleStores.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-medium mb-1.5">Available on:</p>
                    <div className="flex flex-col gap-1">
                      {alt.sampleStores.map((s, si) => (
                        <div key={si} className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{s.platform}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-[#1A56DB] dark:text-blue-400">{formatINR(s.price)}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">{s.delivery}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                <button
                  onClick={() => triggerSearch(alt.name)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 group-hover:bg-[#1A56DB] group-hover:text-white group-hover:border-[#1A56DB] text-[#1A56DB] dark:text-blue-300 font-extrabold text-xs transition-all duration-200 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                >
                  <span>Compare Prices for This Alternative</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};