import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, AlertCircle, Key, Server, Database, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export const ApiConfigModal: React.FC = () => {
  const { showApiConfigModal, setShowApiConfigModal, showToast } = useApp();
  const [configStatus, setConfigStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/config-status');
      if (res.ok) {
        const data = await res.json();
        setConfigStatus(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showApiConfigModal) {
      checkStatus();
    }
  }, [showApiConfigModal]);

  if (!showApiConfigModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white dark:bg-[#1E2130] w-full max-w-md rounded-[32px] p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-left relative my-6">
        <button
          onClick={() => setShowApiConfigModal(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-[#1A56DB] flex items-center justify-center font-black">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              System &amp; API Key Status
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live e-commerce APIs &amp; Supabase database integration
            </p>
          </div>
        </div>

        {/* Diagnostic Status Cards */}
        <div className="space-y-2.5 mb-5">
          {/* SerpAPI */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Key className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  SerpAPI (Google Shopping India)
                </p>
                <span className="text-[10px] text-slate-400">
                  {configStatus?.hasSerpApi ? 'Connected for live store crawling' : 'Using High-Fidelity Indian Catalog'}
                </span>
              </div>
            </div>
            {configStatus?.hasSerpApi ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                LIVE
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                READY
              </span>
            )}
          </div>

          {/* Groq Cloud AI */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Groq High-Speed Cloud LLM
                </p>
                <span className="text-[10px] text-slate-400">
                  {configStatus?.hasGroq ? 'Active (Ultra-fast GPT-OSS & Qwen AI Alternatives)' : 'Ready for AI generation'}
                </span>
              </div>
            </div>
            {configStatus?.hasGroq ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                ACTIVE
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                READY
              </span>
            )}
          </div>

          {/* Supabase Database & Auth */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 text-teal-500" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Supabase PostgreSQL &amp; Auth
                </p>
                <span className="text-[10px] text-slate-400">
                  {isSupabaseConfigured ? 'Connected to Remote Cloud' : 'Active Local Database & RLS Bridge'}
                </span>
              </div>
            </div>
            {isSupabaseConfigured ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                CLOUD
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-600 dark:text-blue-400">
                LOCAL PERSIST
              </span>
            )}
          </div>
        </div>

        {/* Info Note */}
        <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 mb-5">
          <p className="font-bold text-[#1A56DB] dark:text-blue-400 mb-1">
            💡 Zero-Setup Guarantee
          </p>
          <p className="text-[11px] leading-relaxed">
            SmartPrice AI works seamlessly right out of the box with live store comparison, price alerts, voice search, and AI substitutes. When you add your SerpAPI or Supabase keys in <code className="px-1 py-0.5 bg-black/10 rounded font-mono text-[10px]">.env</code>, it switches to 100% remote cloud synchronization automatically.
          </p>
        </div>

        <button
          onClick={() => setShowApiConfigModal(false)}
          className="w-full py-3 rounded-2xl bg-[#1A56DB] text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
};
