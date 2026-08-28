// Indian Rupee currency formatting using en-IN standard
export function formatINR(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number without currency symbol
export function formatIndianNumber(val: number): string {
  if (isNaN(val)) return '0';
  return new Intl.NumberFormat('en-IN').format(val);
}

// Calculate discount percentage
export function calculateDiscount(price: number, mrp: number): number {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

// Calculate percentage difference relative to cheapest
export function calculateHigherPercentage(price: number, cheapestPrice: number): number {
  if (!cheapestPrice || price <= cheapestPrice) return 0;
  return Math.round(((price - cheapestPrice) / cheapestPrice) * 100);
}

// Format relative time (e.g., '2 min ago', '1 hr ago', 'Yesterday 8pm')
export function formatRelativeTime(dateInput: string | Date | number): string {
  const date = new Date(dateInput);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) {
    const timeStr = date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `Yesterday ${timeStr}`;
  }
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

// Match score styling for AI alternatives
export function getMatchScoreStyle(score: number): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (score >= 90) {
    return {
      bg: 'bg-emerald-600 dark:bg-emerald-500',
      text: 'text-white',
      border: 'border-emerald-700',
      label: 'Excellent Match',
    };
  }
  if (score >= 80) {
    return {
      bg: 'bg-green-500 dark:bg-green-600',
      text: 'text-white',
      border: 'border-green-600',
      label: 'Great Alternative',
    };
  }
  if (score >= 70) {
    return {
      bg: 'bg-amber-500 dark:bg-amber-600',
      text: 'text-white',
      border: 'border-amber-600',
      label: 'Good Substitute',
    };
  }
  return {
    bg: 'bg-slate-400 dark:bg-slate-600',
    text: 'text-white',
    border: 'border-slate-500',
    label: 'Partial Match',
  };
}

// Store brand colors, logos, and deep link configurations
export interface StoreMeta {
  name: string;
  shortName: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  eta: string;
  scheme: string;
  playStoreUrl: string;
  appStoreUrl: string;
  accentHex: string;
}

export const STORE_METAS: Record<string, StoreMeta> = {
  'Blinkit': {
    name: 'Blinkit',
    shortName: 'Blinkit',
    badgeBg: 'bg-amber-400 text-black',
    badgeText: 'text-black font-extrabold',
    borderColor: 'border-amber-400',
    eta: '8-12 mins',
    scheme: 'blinkit://',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.grofers.customerapp',
    appStoreUrl: 'https://apps.apple.com/in/app/blinkit-groceries-in-minutes/id960335206',
    accentHex: '#F7C948',
  },
  'Zepto': {
    name: 'Zepto',
    shortName: 'Zepto',
    badgeBg: 'bg-purple-700 text-white',
    badgeText: 'text-white font-bold',
    borderColor: 'border-purple-600',
    eta: '10-15 mins',
    scheme: 'zepto://',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.zeptoconsumerapp',
    appStoreUrl: 'https://apps.apple.com/in/app/zepto-10-min-grocery-delivery/id1575323645',
    accentHex: '#7C3AED',
  },
  'Amazon India': {
    name: 'Amazon India',
    shortName: 'Amazon',
    badgeBg: 'bg-slate-900 text-amber-400',
    badgeText: 'text-amber-400 font-bold',
    borderColor: 'border-slate-800',
    eta: 'Same-Day / Next-Day',
    scheme: 'amazon://',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=in.amazon.mShop.android.shopping',
    appStoreUrl: 'https://apps.apple.com/in/app/amazon-india-shop-online/id1478350915',
    accentHex: '#FF9900',
  },
  'Amazon': {
    name: 'Amazon India',
    shortName: 'Amazon',
    badgeBg: 'bg-slate-900 text-amber-400',
    badgeText: 'text-amber-400 font-bold',
    borderColor: 'border-slate-800',
    eta: 'Same-Day / Next-Day',
    scheme: 'amazon://',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=in.amazon.mShop.android.shopping',
    appStoreUrl: 'https://apps.apple.com/in/app/amazon-india-shop-online/id1478350915',
    accentHex: '#FF9900',
  },
  'Flipkart': {
    name: 'Flipkart',
    shortName: 'Flipkart',
    badgeBg: 'bg-blue-600 text-amber-300',
    badgeText: 'text-amber-300 font-bold',
    borderColor: 'border-blue-600',
    eta: '1-2 Days',
    scheme: 'flipkart://',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.flipkart.android',
    appStoreUrl: 'https://apps.apple.com/in/app/flipkart-online-shopping-app/id742044692',
    accentHex: '#2874F0',
  },
  'BigBasket': {
    name: 'BigBasket',
    shortName: 'BigBasket',
    badgeBg: 'bg-red-600 text-white',
    badgeText: 'text-white font-bold',
    borderColor: 'border-red-600',
    eta: '2-4 Hours',
    scheme: 'bigbasket://',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.bigbasket.mobileapp',
    appStoreUrl: 'https://apps.apple.com/in/app/bigbasket-online-grocery/id660647252',
    accentHex: '#84C225',
  },
  'Tata 1mg': {
    name: 'Tata 1mg',
    shortName: '1mg',
    badgeBg: 'bg-rose-600 text-white',
    badgeText: 'text-white font-bold',
    borderColor: 'border-rose-600',
    eta: '2-5 Hours',
    scheme: 'tata1mg://',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.aranoah.healthkart.plus',
    appStoreUrl: 'https://apps.apple.com/in/app/tata-1mg-healthcare-app/id985746762',
    accentHex: '#FF6F61',
  },
  '1mg': {
    name: 'Tata 1mg',
    shortName: '1mg',
    badgeBg: 'bg-rose-600 text-white',
    badgeText: 'text-white font-bold',
    borderColor: 'border-rose-600',
    eta: '2-5 Hours',
    scheme: 'tata1mg://',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.aranoah.healthkart.plus',
    appStoreUrl: 'https://apps.apple.com/in/app/tata-1mg-healthcare-app/id985746762',
    accentHex: '#FF6F61',
  },
  'PharmEasy': {
    name: 'PharmEasy',
    shortName: 'PharmEasy',
    badgeBg: 'bg-teal-600 text-white',
    badgeText: 'text-white font-bold',
    borderColor: 'border-teal-600',
    eta: '3-6 Hours',
    scheme: 'pharmeasy://',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.phoneapp.pharmacy',
    appStoreUrl: 'https://apps.apple.com/in/app/pharmeasy-healthcare-app/id1112937748',
    accentHex: '#10847E',
  },
};

export function getStoreMeta(platformName: string): StoreMeta {
  const norm = platformName.trim();
  for (const [key, meta] of Object.entries(STORE_METAS)) {
    if (norm.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(norm.toLowerCase())) {
      return meta;
    }
  }

  // Generic store fallback
  return {
    name: norm,
    shortName: norm,
    badgeBg: 'bg-blue-600 text-white',
    badgeText: 'text-white font-bold',
    borderColor: 'border-blue-500',
    eta: 'Standard 2-3 Days',
    scheme: `${norm.toLowerCase().replace(/\s+/g, '')}://`,
    playStoreUrl: `https://play.google.com/store/search?q=${encodeURIComponent(norm)}`,
    appStoreUrl: `https://www.apple.com/search/${encodeURIComponent(norm)}`,
    accentHex: '#1A56DB',
  };
}
