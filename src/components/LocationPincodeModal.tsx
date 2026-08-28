import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Search, CheckCircle2, Zap, X, Navigation } from 'lucide-react';
import { POPULAR_PINCODES, findClosestPincode } from '../lib/pincodes';

export const LocationPincodeModal: React.FC = () => {
  const { showLocationModal, setShowLocationModal, currentPincode, currentCity, currentArea, setPincode } = useApp();
  const [searchInput, setSearchInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [tracking, setTracking] = useState(false);

  if (!showLocationModal) return null;

  const handleApplyPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setErrorMsg('Please enter a 6-digit PIN code or area name.');
      return;
    }
    setPincode(searchInput.trim());
    setShowLocationModal(false);
    setSearchInput('');
    setErrorMsg('');
  };

  const handleSelectPredefined = (pincode: string) => {
    setPincode(pincode);
    setShowLocationModal(false);
  };

  const handleTrackLiveLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setTracking(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const closest = findClosestPincode(latitude, longitude);
          setPincode(closest.pincode);
          setShowLocationModal(false);
        } catch (err) {
          setErrorMsg('Error matching location. Please enter pincode.');
        } finally {
          setTracking(false);
        }
      },
      (error) => {
        setErrorMsg('Location permission denied or timed out.');
        setTracking(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white dark:bg-[#0F1117] w-full max-w-md rounded-[32px] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-left relative my-6">
        <button
          onClick={() => setShowLocationModal(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-[#FF5A1F] flex items-center justify-center font-black">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Delivery Location &amp; PIN Code
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calibrate 10-min Blinkit/Zepto &amp; local darkstore inventory
            </p>
          </div>
        </div>

        {/* Current Active Location Pill */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Navigation className="w-4 h-4 text-[#1A56DB]" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {currentArea}, {currentCity}
              </p>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                PIN Code: {currentPincode} • 10-min Darkstores Active ⚡
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            ACTIVE
          </span>
        </div>

        {/* Detect & Track Live Location Button */}
        <button
          type="button"
          onClick={handleTrackLiveLocation}
          disabled={tracking}
          className="w-full mb-5 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-[#1A56DB] hover:from-blue-700 hover:to-blue-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
        >
          <Navigation className={`w-4 h-4 ${tracking ? 'animate-spin' : 'animate-pulse'}`} />
          {tracking ? 'Detecting GPS Location...' : 'Detect & Track My Live Location'}
        </button>

        {/* PIN Code Search Form */}
        <form onSubmit={handleApplyPincode} className="space-y-3 mb-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Enter 6-Digit Indian PIN Code or Area
            </label>
            <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 focus-within:ring-2 focus-within:ring-[#1A56DB]">
              <Search className="w-4 h-4 text-slate-400 ml-3.5" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="e.g. 560001 or Koramangala or Hyderabad"
                className="w-full py-2.5 pl-2.5 pr-3 text-xs text-slate-900 dark:text-white bg-transparent focus:outline-none"
                autoFocus
              />
            </div>
            {errorMsg && (
              <p className="text-[11px] font-semibold text-rose-500 mt-1">{errorMsg}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-[#1A56DB] text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            Apply Location <CheckCircle2 className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Select Popular Delivery Hubs */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Popular Metro Delivery Hubs
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {Object.values(POPULAR_PINCODES).slice(0, 10).map((loc) => (
              <button
                key={loc.pincode}
                onClick={() => handleSelectPredefined(loc.pincode)}
                className={`p-2 rounded-xl text-left border transition-all ${
                  currentPincode === loc.pincode
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                  {loc.city} ({loc.pincode})
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {loc.area}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
