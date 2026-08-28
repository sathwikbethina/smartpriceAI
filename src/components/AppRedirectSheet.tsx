import React from 'react';
import { useApp } from '../context/AppContext';
import { getStoreMeta, formatINR } from '../lib/formatters';
import { X, ExternalLink, Smartphone, Globe, ArrowUpRight, CheckCircle2, Search } from 'lucide-react';

export const AppRedirectSheet: React.FC = () => {
  const { selectedProductForRedirect, setSelectedProductForRedirect, installedApps, showToast } = useApp();

  if (!selectedProductForRedirect) return null;

  const product = selectedProductForRedirect;
  const meta = getStoreMeta(product.platform);
  const isDirect = product.url_type === 'direct';

  // Check if app is installed & enabled in preferences
  const appPref = installedApps.find(
    (a) =>
      a.app_name.toLowerCase() === product.platform.toLowerCase() ||
      product.platform.toLowerCase().includes(a.app_name.toLowerCase()) ||
      a.app_name.toLowerCase().includes(product.platform.toLowerCase())
  );

  const isAppInstalled = appPref?.is_installed ?? true;

  const handleOpenDirectProductUrl = () => {
    if (product.url) {
      window.open(product.url, '_blank', 'noopener,noreferrer');
      showToast(
        isDirect ? `Opening ${product.platform}...` : `Searching on ${product.platform}...`,
        isDirect ? 'Direct product page loaded.' : 'Search query loaded.',
        'success'
      );
    } else {
      showToast('No product URL available', 'Try searching again.', 'warning');
    }
    setSelectedProductForRedirect(null);
  };

  const getProductDeepLink = (platform: string, url: string): string | null => {
    if (!url) return null;
    const lowerPlat = platform.toLowerCase();

    try {
      if (lowerPlat.includes('amazon')) {
        const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/i) || url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
        if (asinMatch && asinMatch[1]) {
          return `amazon://dp/${asinMatch[1]}`;
        }
        return 'amazon://';
      }
      if (lowerPlat.includes('flipkart')) {
        return url.replace(/^https?:\/\/(?:www\.)?flipkart\.com\//i, 'flipkart://dl/');
      }
      if (lowerPlat.includes('blinkit')) {
        return url.replace(/^https?:\/\/(?:www\.)?blinkit\.com\//i, 'blinkit://');
      }
      if (lowerPlat.includes('zepto')) {
        return url.replace(/^https?:\/\/(?:www\.)?(?:zeptonow\.com|zepto\.co|zepto\.com)\//i, 'zepto://');
      }
      if (lowerPlat.includes('swiggy') || lowerPlat.includes('instamart')) {
        return url.replace(/^https?:\/\/(?:www\.)?swiggy\.com\//i, 'swiggy://');
      }
      if (lowerPlat.includes('bigbasket')) {
        return url.replace(/^https?:\/\/(?:www\.)?bigbasket\.com\//i, 'bigbasket://');
      }
      if (lowerPlat.includes('jiomart')) {
        return url.replace(/^https?:\/\/(?:www\.)?jiomart\.com\//i, 'jiomart://');
      }
      if (lowerPlat.includes('1mg')) {
        return url.replace(/^https?:\/\/(?:www\.)?1mg\.com\//i, 'tata1mg://');
      }
      if (lowerPlat.includes('pharmeasy')) {
        return url.replace(/^https?:\/\/(?:www\.)?pharmeasy\.in\//i, 'pharmeasy://');
      }
      if (lowerPlat.includes('apollo')) {
        return url.replace(/^https?:\/\/(?:www\.)?apollopharmacy\.in\//i, 'apollo247://');
      }
    } catch (e) {
      console.error('Deep link generation error:', e);
    }
    return null;
  };

  const handleOpenAppDeepLink = () => {
    if (!product.url) {
      showToast('No product URL available', 'Try searching again.', 'warning');
      setSelectedProductForRedirect(null);
      return;
    }
    const deepLink = getProductDeepLink(product.platform, product.url) || meta.scheme;
    if (deepLink) {
      window.location.href = deepLink;
      setTimeout(() => {
        window.open(product.url, '_blank', 'noopener,noreferrer');
      }, 1500);
    } else {
      window.open(product.url, '_blank', 'noopener,noreferrer');
    }
    showToast(
      `Redirecting to ${product.platform} App...`,
      isDirect ? 'Opening direct product page.' : 'Opening search in app.',
      'info'
    );
    setSelectedProductForRedirect(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => setSelectedProductForRedirect(null)}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-[#1E2130] rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 z-10 animate-in slide-in-from-bottom-8 duration-200">
        {/* Drag handle for mobile */}
        <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto -mt-2 mb-4 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForRedirect(null)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Store Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md"
            style={{ backgroundColor: meta.accentHex }}
          >
            {product.platform.charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isDirect ? `Buy from ${product.platform}` : `Search on ${product.platform}`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ⚡ {product.delivery || meta.eta}
            </p>
          </div>
        </div>

        {/* Product Preview Card */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 mb-5">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-xl object-cover bg-white dark:bg-slate-800 shrink-0 border border-slate-200/50 dark:border-slate-700"
            onError={(e) => {
              const t = e.target as HTMLImageElement;
              if (!t.dataset.fallback) {
                t.dataset.fallback = '1';
                t.src = `https://placehold.co/80x80/f1f5f9/64748b?text=${encodeURIComponent(product.platform.charAt(0))}`;
              }
            }}
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
              {product.name}
            </h4>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-base font-black text-slate-900 dark:text-white">
                {formatINR(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(product.mrp)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons based on Installation status and url_type */}
        <div className="space-y-2.5">
          {isAppInstalled ? (
            <>
              <button
                onClick={handleOpenAppDeepLink}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#1A56DB] text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                {isDirect ? `Buy in ${product.platform} App` : `Search in ${product.platform} App`}
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleOpenDirectProductUrl}
                className="w-full py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4 text-blue-500" />
                {isDirect ? 'Open in Browser (Direct Link)' : 'Open Search in Browser'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleOpenDirectProductUrl}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {isDirect ? <Globe className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                {isDirect ? `Buy Now on ${product.platform} Website` : `Search on ${product.platform} Website`}
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {meta.playStoreUrl && (
                <a
                  href={meta.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  Install {product.platform} from Play Store ↗
                </a>
              )}
            </>
          )}
        </div>

        {/* Verification guarantee */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            {isDirect ? 'Direct verified product page.' : 'Direct marketplace search link.'}
          </span>
        </div>
      </div>
    </div>
  );
};
