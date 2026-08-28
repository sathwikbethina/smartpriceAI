import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Check, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';
import { InstalledAppItem } from '../types';
import { getStoreMeta } from '../lib/formatters';

export const LocationAppsPermissionModal: React.FC = () => {
  const {
    showPermissionsWizard,
    setShowPermissionsWizard,
    currentCity,
    setCity,
    installedApps,
    updateInstalledApps,
    showToast,
  } = useApp();

  const [locationAllowed, setLocationAllowed] = useState(false);
  const [localApps, setLocalApps] = useState<InstalledAppItem[]>(() => installedApps);

  if (!showPermissionsWizard) return null;

  const handleToggleApp = (appName: string) => {
    setLocalApps((prev) =>
      prev.map((app) => (app.app_name === appName ? { ...app, is_installed: !app.is_installed } : app))
    );
  };

  const handleAllowLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationAllowed(true);
          showToast('Location Auto-Detected! 📍', `Calibrated for 10-minute QuickCommerce in ${currentCity}`, 'success');
        },
        (err) => {
          setLocationAllowed(true);
          showToast(`Using Default City: ${currentCity}`, 'You can switch cities anytime in the top bar.', 'info');
        }
      );
    } else {
      setLocationAllowed(true);
    }
  };

  const handleSaveAndContinue = async () => {
    await updateInstalledApps(localApps);
    localStorage.setItem('permissions_shown', 'true');
    setShowPermissionsWizard(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-[#0F1117] w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-left my-8">
        {/* Step Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-[#1A56DB] dark:text-blue-400 flex items-center justify-center font-black text-sm">
            ⚙️
          </span>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Setup Your Preferences
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Customize real-time delivery and one-tap app opening
            </p>
          </div>
        </div>

        {/* Top: Location Permission Card */}
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-[#1E2130] border border-blue-100 dark:border-slate-700 mb-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#1A56DB] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Allow SmartPrice AI to detect your location
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                Blinkit, Zepto, and Swiggy Instamart require your locality coordinates to show live 10-minute inventory.
              </p>
              <button
                onClick={handleAllowLocation}
                disabled={locationAllowed}
                className={`mt-2.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  locationAllowed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#1A56DB] text-white hover:bg-blue-700 active:scale-95'
                }`}
              >
                {locationAllowed ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Location Enabled ({currentCity})
                  </>
                ) : (
                  'Allow Location Access'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: Installed Apps on Phone */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#FF5A1F]" />
              <h4 className="text-xs font-black text-slate-900 dark:text-white">
                Which apps do you have installed?
              </h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              {localApps.filter((a) => a.is_installed).length} Selected
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-snug">
            Installed apps will open directly in their app on tap. Others will open securely in Chrome browser.
          </p>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {localApps.map((app) => {
              const meta = getStoreMeta(app.app_name);
              return (
                <div
                  key={app.app_name}
                  onClick={() => handleToggleApp(app.app_name)}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer select-none ${
                    app.is_installed
                      ? 'bg-blue-50/50 dark:bg-slate-800/80 border-blue-300 dark:border-blue-500/40'
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                      style={{ backgroundColor: meta.accentHex, color: '#fff' }}
                    >
                      {app.app_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {app.app_name}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {app.is_installed ? 'Installed on phone' : 'Opens in browser'}
                      </span>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <div
                    className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                      app.is_installed ? 'bg-[#1A56DB]' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        app.is_installed ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/70 text-[10px] text-slate-500 dark:text-slate-400">
            ℹ️ <span className="font-semibold">Note:</span> Apps you have not installed will open in Chrome browser with full instant checkout.
          </div>
        </div>

        {/* Continue CTA */}
        <button
          onClick={handleSaveAndContinue}
          className="w-full mt-5 py-3 rounded-2xl bg-gradient-to-r from-[#1A56DB] to-[#FF5A1F] text-white font-extrabold text-xs shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Save & Start Shopping <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
