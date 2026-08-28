import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    // 5-second countdown with smooth progress bar
    const duration = 5000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return next;
      });
    }, interval);

    const countdownTimer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const autoHideTimer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearInterval(countdownTimer);
      clearTimeout(autoHideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#0F172A] via-[#0B0F19] to-[#030712] text-white animate-in fade-in duration-300">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top badges */}
      <div className="w-full max-w-md flex items-center justify-between pt-4">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-blue-300 border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Hyperlocal India AI Engine
        </span>
        <button
          onClick={() => setVisible(false)}
          className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1"
        >
          Skip ({secondsLeft}s) <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Branding & Logo */}
      <div className="flex flex-col items-center text-center my-auto space-y-6">
        {/* Animated Brand Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1A56DB] to-[#FF5A1F] rounded-3xl blur-xl opacity-60 animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#1A56DB] via-[#2563EB] to-[#FF5A1F] p-0.5 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0F19]/90 backdrop-blur-xl rounded-[22px] flex items-center justify-center">
              <Zap className="w-12 h-12 sm:w-14 sm:h-14 text-orange-400 fill-orange-400 animate-bounce" />
            </div>
          </div>
        </div>

        {/* App Title & Tagline */}
        <div className="space-y-2 max-w-sm">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
            SmartPrice <span className="text-[#FF5A1F]">AI</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-400 leading-relaxed">
            Real-Time Multi-Store Price Comparison &amp; Hyperlocal Pincode Deals
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-slate-300">
          <span className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
            ⚡ 10-Min Darkstores
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
            🛍️ Amazon &amp; Flipkart
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
            🤖 Ollama Substitutes
          </span>
        </div>
      </div>

      {/* Bottom Progress & Countdown */}
      <div className="w-full max-w-xs space-y-3 pb-6 text-center">
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-[#1A56DB] to-[#FF5A1F] transition-all ease-linear duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Checking local darkstore inventory ({secondsLeft}s)...
        </p>
      </div>
    </div>
  );
};
