import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../lib/formatters';
import { Bell, Minus, Plus, X, Smartphone, Mail, MessageSquare, Check } from 'lucide-react';

export const SetPriceAlertModal: React.FC = () => {
  const { selectedProductForAlert, setSelectedProductForAlert, addPriceAlert, user } = useApp();

  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(false);

  useEffect(() => {
    if (selectedProductForAlert) {
      // Default to 10% below current price
      const suggested = Math.round(selectedProductForAlert.price * 0.9);
      setTargetPrice(suggested);
    }
  }, [selectedProductForAlert]);

  if (!selectedProductForAlert) return null;

  const product = selectedProductForAlert;
  const currentPrice = product.price;

  const step = currentPrice > 10000 ? 500 : currentPrice > 1000 ? 50 : 10;

  const handleQuickPercent = (percent: number) => {
    const calculated = Math.round(currentPrice * (1 - percent / 100));
    setTargetPrice(calculated);
  };

  const handleSaveAlert = async () => {
    if (targetPrice >= currentPrice) {
      // Allow it or adjust
    }
    await addPriceAlert({
      user_id: user?.id,
      product_name: product.name,
      target_price: targetPrice,
      current_price: currentPrice,
      platform: product.platform,
      product_url: product.url,
      notify_push: notifyPush,
      notify_email: notifyEmail,
      notify_whatsapp: notifyWhatsapp,
      is_active: true,
    });
    setSelectedProductForAlert(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#1E2130] w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-left relative">
        <button
          onClick={() => setSelectedProductForAlert(null)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-[#FF5A1F] flex items-center justify-center font-black">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Set Price Drop Alert
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Get notified the moment price drops
            </p>
          </div>
        </div>

        {/* Product summary */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 mb-5">
          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
            {product.name}
          </p>
          <div className="flex items-center justify-between mt-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Current Lowest:</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
              {formatINR(currentPrice)}
            </span>
          </div>
        </div>

        {/* Target price input with +/- buttons */}
        <div className="mb-4">
          <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300 mb-2">
            Target Price (₹)
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTargetPrice((prev) => Math.max(1, prev - step))}
              className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-black hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex-1 relative">
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                className="w-full h-11 px-3 text-center text-lg font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]"
              />
            </div>

            <button
              onClick={() => setTargetPrice((prev) => prev + step)}
              className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center font-black hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion buttons: 5%, 10%, 15% below current */}
        <div className="mb-5">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Quick Discounts:
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[5, 10, 15].map((pct) => {
              const val = Math.round(currentPrice * (1 - pct / 100));
              const isSelected = targetPrice === val;
              return (
                <button
                  key={pct}
                  onClick={() => handleQuickPercent(pct)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#FF5A1F] text-white shadow-md shadow-orange-500/20 font-black'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  -{pct}% ({formatINR(val)})
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification preference toggles */}
        <div className="mb-6 space-y-2">
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Notification Channels:
          </span>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 cursor-pointer">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Smartphone className="w-4 h-4 text-blue-500" />
              <span>Push Notification</span>
            </div>
            <input
              type="checkbox"
              checked={notifyPush}
              onChange={(e) => setNotifyPush(e.target.checked)}
              className="w-4 h-4 rounded text-[#FF5A1F] accent-[#FF5A1F]"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 cursor-pointer">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Mail className="w-4 h-4 text-orange-500" />
              <span>Email Notification</span>
            </div>
            <input
              type="checkbox"
              checked={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.checked)}
              className="w-4 h-4 rounded text-[#FF5A1F] accent-[#FF5A1F]"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700 cursor-pointer">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>WhatsApp Alerts</span>
            </div>
            <input
              type="checkbox"
              checked={notifyWhatsapp}
              onChange={(e) => setNotifyWhatsapp(e.target.checked)}
              className="w-4 h-4 rounded text-[#FF5A1F] accent-[#FF5A1F]"
            />
          </label>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveAlert}
          className="w-full py-3.5 rounded-2xl bg-[#FF5A1F] text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 hover:bg-[#e04e18] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Set Price Alert
        </button>
      </div>
    </div>
  );
};
