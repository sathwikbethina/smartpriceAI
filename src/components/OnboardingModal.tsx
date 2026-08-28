import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, ShoppingBag } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, setShowOnboarding, setShowAuthModal, setShowPermissionsWizard } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!showOnboarding) return null;

  const steps = [
    {
      title: 'Compare Prices Everywhere',
      subtitle: 'Search once. See prices from major Indian platforms instantly.',
      badge: 'Multi-Store Scanner',
      illustration: (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="relative grid grid-cols-2 gap-3 p-4 bg-white/80 dark:bg-slate-800/80 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1.5 px-2.5 py-2 bg-amber-400/20 text-amber-900 dark:text-amber-300 rounded-xl text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Blinkit
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-2 bg-purple-500/20 text-purple-900 dark:text-purple-300 rounded-xl text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Zepto
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-2 bg-blue-600/20 text-blue-900 dark:text-blue-300 rounded-xl text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Amazon
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-2 bg-yellow-500/20 text-yellow-900 dark:text-yellow-300 rounded-xl text-xs font-black">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              Flipkart
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'AI Finds Best Alternatives',
      subtitle: 'Out of stock? Our AI suggests same-ingredient products from other brands.',
      badge: 'Gemini 3.7 AI Engine',
      illustration: (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="relative p-5 bg-gradient-to-tr from-[#1E2130] to-slate-900 rounded-3xl shadow-2xl border border-orange-500/30 text-left w-full max-w-[200px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                96% Match
              </span>
              <Sparkles className="w-4 h-4 text-[#FF5A1F] animate-spin" />
            </div>
            <div className="h-2 w-24 bg-slate-700 rounded-full mb-1.5" />
            <div className="h-2 w-16 bg-slate-800 rounded-full mb-3" />
            <div className="flex gap-1">
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 font-mono">Zinc PCA</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">10% Niacinamide</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Price Drop Alerts',
      subtitle: 'Set your target price. Get notified instantly when price drops across stores.',
      badge: 'Real-time Tracker',
      illustration: (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="relative p-5 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-emerald-500/40 text-center w-full max-w-[200px]">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-2 font-black text-2xl shadow-inner">
              🔔
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Target: ₹62,000</p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-0.5">Price dropped by ₹3,999!</p>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_shown', 'true');
    setShowOnboarding(false);
    setShowPermissionsWizard(true);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0F1117] w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative flex flex-col justify-between min-h-[520px]">
        {/* Top skip & progress */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'w-6 bg-[#FF5A1F]'
                    : i < currentStep
                    ? 'w-2 bg-[#1A56DB]'
                    : 'w-2 bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleSkip}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Center illustration & copy */}
        <div className="my-auto py-4">
          <div className="mb-4">{step.illustration}</div>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-[#1A56DB] dark:text-blue-300 mb-2">
            {step.badge}
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
            {step.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-[260px] mx-auto leading-relaxed">
            {step.subtitle}
          </p>
        </div>

        {/* Bottom CTA button */}
        <div className="pt-2">
          <button
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#1A56DB] to-[#FF5A1F] text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Get Started 🚀' : 'Next'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
