import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  WatchlistItem,
  PriceAlertItem,
  SearchRecord,
  InstalledAppItem,
  AppNotification,
  Product,
} from '../types';
import { dbService, DEFAULT_GUEST_PROFILE, supabase, isSupabaseConfigured } from '../lib/supabase';
import { lookupPincode, PincodeInfo, POPULAR_PINCODES } from '../lib/pincodes';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning';
}

const CITIES_COORDS: Record<string, [number, number]> = {
  Chennai: [13.0827, 80.2707],
  Mumbai: [19.0760, 72.8777],
  Bangalore: [12.9716, 77.5946],
  Delhi: [28.6139, 77.2090],
  Hyderabad: [17.3850, 78.4867],
  Pune: [18.5204, 73.8567],
  Kolkata: [22.5726, 88.3639],
  Ahmedabad: [23.0225, 72.5714],
  Surat: [21.1702, 72.8311],
  Jaipur: [26.9124, 75.7873],
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    type: 'price_drop',
    title: 'Price Drop Alert! 💥',
    description: 'Apple iPhone 15 dropped to ₹65,999 — down from ₹68,499 on Amazon India.',
    timeAgo: '15 min ago',
    timestamp: Date.now() - 1000 * 60 * 15,
    isUnread: true,
    productQuery: 'iPhone 15',
  },
  {
    id: 'n2',
    type: 'stock',
    title: 'Back in Stock ⚡',
    description: 'Amul Butter 500g is back in stock on Blinkit for ₹275 (10 mins delivery).',
    timeAgo: '1 hr ago',
    timestamp: Date.now() - 1000 * 60 * 60,
    isUnread: true,
    productQuery: 'Amul Butter',
  },
  {
    id: 'n3',
    type: 'ai_recommendation',
    title: 'AI Smart Substitute Found 🤖',
    description: 'Better deal found for Minimalist Serum — Plum 10% Niacinamide at 95% ingredient match for ₹499.',
    timeAgo: '3 hrs ago',
    timestamp: Date.now() - 1000 * 60 * 180,
    isUnread: false,
    productQuery: 'Niacinamide Serum',
  },
];

interface AppContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  currentCity: string;
  currentPincode: string;
  currentArea: string;
  coordinates: [number, number];
  darkMode: boolean;
  toggleDarkMode: () => void;
  setCity: (city: string) => void;
  setPincode: (pincodeOrCity: string) => void;

  watchlist: WatchlistItem[];
  addToWatchlist: (item: Omit<WatchlistItem, 'id' | 'added_at'>) => Promise<void>;
  removeFromWatchlist: (id: number | string) => Promise<void>;

  priceAlerts: PriceAlertItem[];
  addPriceAlert: (alert: Omit<PriceAlertItem, 'id' | 'created_at'>) => Promise<void>;
  togglePriceAlert: (id: number | string, active: boolean) => Promise<void>;
  deletePriceAlert: (id: number | string) => Promise<void>;

  searches: SearchRecord[];
  recordSearch: (query: string, count: number) => Promise<void>;
  clearSearches: () => Promise<void>;
  deleteSearchItem: (id: number | string) => Promise<void>;

  installedApps: InstalledAppItem[];
  updateInstalledApps: (apps: InstalledAppItem[]) => Promise<void>;

  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  activeTab: 'home' | 'search' | 'watchlist' | 'history' | 'profile' | 'notifications';
  setActiveTab: (tab: 'home' | 'search' | 'watchlist' | 'history' | 'profile' | 'notifications') => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeSearchTrigger: string;
  triggerSearch: (query: string) => void;

  selectedProductForRedirect: Product | null;
  setSelectedProductForRedirect: (p: Product | null) => void;

  selectedProductForAlert: Product | null;
  setSelectedProductForAlert: (p: Product | null) => void;

  selectedProductForHistory: Product | null;
  setSelectedProductForHistory: (p: Product | null) => void;

  showVoiceModal: boolean;
  setShowVoiceModal: (show: boolean) => void;

  showApiConfigModal: boolean;
  setShowApiConfigModal: (show: boolean) => void;

  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;

  showPermissionsWizard: boolean;
  setShowPermissionsWizard: (show: boolean) => void;

  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;

  showLocationModal: boolean;
  setShowLocationModal: (show: boolean) => void;

  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;

  loginUser: (email: string, fullName?: string, phone?: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  continueAsGuest: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Only restore profile if actually authenticated
    const hasToken = Boolean(localStorage.getItem('smartprice_auth_token'));
    if (hasToken) {
      const saved = localStorage.getItem('smartprice_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('smartprice_auth_token'));
  });
  const [isGuest, setIsGuest] = useState<boolean>(false);

  const [currentCity, setCurrentCityState] = useState<string>('Chennai');
  const [currentPincode, setCurrentPincode] = useState<string>('600028');
  const [currentArea, setCurrentArea] = useState<string>('R.A. Puram / Mandaveli');
  const [coordinates, setCoordinates] = useState<[number, number]>([13.0827, 80.2707]);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('smartprice_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlertItem[]>([]);
  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [installedApps, setInstalledApps] = useState<InstalledAppItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'watchlist' | 'history' | 'profile' | 'notifications'>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearchTrigger, setActiveSearchTrigger] = useState<string>('');

  const [selectedProductForRedirect, setSelectedProductForRedirect] = useState<Product | null>(null);
  const [selectedProductForAlert, setSelectedProductForAlert] = useState<Product | null>(null);
  const [selectedProductForHistory, setSelectedProductForHistory] = useState<Product | null>(null);

  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);
  const [showApiConfigModal, setShowApiConfigModal] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('onboarding_shown') !== 'true';
  });
  const [showPermissionsWizard, setShowPermissionsWizard] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Show Toast notification
  const showToast = useCallback((title: string, message?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Dark mode effect
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('smartprice_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('smartprice_theme', 'light');
    }
  }, [darkMode]);

  // Toggle Dark Mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      if (user) {
        dbService.saveProfile({ ...user, dark_mode: next });
      }
      return next;
    });
  }, [user]);

  // Set pincode / area / city
  const setPincode = useCallback((input: string) => {
    const info = lookupPincode(input);
    setCurrentPincode(info.pincode);
    setCurrentCityState(info.city);
    setCurrentArea(info.area);
    setCoordinates([info.lat, info.lon]);
    if (user) {
      const updated = { ...user, city: info.city, lat: info.lat, lon: info.lon };
      setUser(updated);
      dbService.saveProfile(updated);
    }
    showToast(`📍 Location: ${info.area}, ${info.city} (${info.pincode})`, '10-min Darkstore delivery calibrated.', 'success');
  }, [user, showToast]);

  // Set city & update coordinates
  const setCity = useCallback((city: string) => {
    setPincode(city);
  }, [setPincode]);

  // Auto-detect location on first load via https://ipinfo.io/json (Rule 3)
  useEffect(() => {
    const autoDetect = async () => {
      try {
        const res = await fetch('https://ipinfo.io/json');
        if (res.ok) {
          const data = await res.json();
          if (data.city && Object.keys(CITIES_COORDS).includes(data.city)) {
            setCurrentCityState(data.city);
            if (data.loc) {
              const [lat, lon] = data.loc.split(',').map(Number);
              if (!isNaN(lat) && !isNaN(lon)) {
                setCoordinates([lat, lon]);
              }
            }
          }
        }
      } catch (err) {
        console.log('Location auto-detection note: Using default Chennai, Tamil Nadu', err);
      }
    };
    autoDetect();
  }, []);

  // Listen to Supabase auth state changes (e.g. Google OAuth sign-in and redirect)
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;

    // Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = session.user.email || '';
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
        const avatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
        const profile: UserProfile = {
          id: session.user.id,
          full_name: name,
          email,
          phone: session.user.phone || session.user.user_metadata?.phone || '+91 98765 43210',
          avatar_url: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
          city: currentCity,
          lat: coordinates[0],
          lon: coordinates[1],
          dark_mode: darkMode,
          total_savings: 3450,
          created_at: session.user.created_at || new Date().toISOString(),
        };
        setUser(profile);
        setIsAuthenticated(true);
        setIsGuest(false);
        localStorage.setItem('smartprice_auth_token', 'true');
        localStorage.setItem('smartprice_profile', JSON.stringify(profile));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const email = session.user.email || '';
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
        const avatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture;
        const profile: UserProfile = {
          id: session.user.id,
          full_name: name,
          email,
          phone: session.user.phone || session.user.user_metadata?.phone || '+91 98765 43210',
          avatar_url: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
          city: currentCity,
          lat: coordinates[0],
          lon: coordinates[1],
          dark_mode: darkMode,
          total_savings: 3450,
          created_at: session.user.created_at || new Date().toISOString(),
        };
        setUser(profile);
        setIsAuthenticated(true);
        setIsGuest(false);
        localStorage.setItem('smartprice_auth_token', 'true');
        localStorage.setItem('smartprice_profile', JSON.stringify(profile));
        await dbService.saveProfile(profile);
        showToast(`Welcome, ${name}! 👋`, 'Signed in successfully.', 'success');
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('smartprice_auth_token');
        localStorage.removeItem('smartprice_profile');
        localStorage.removeItem('smartprice_session');
        setUser(null);
        setIsAuthenticated(false);
        setIsGuest(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentCity, coordinates, darkMode, showToast]);

  // Initial load of databases
  useEffect(() => {
    const loadInitialData = async () => {
      const [w, a, s, apps] = await Promise.all([
        dbService.getWatchlist(user?.id),
        dbService.getPriceAlerts(user?.id),
        dbService.getSearches(user?.id),
        dbService.getInstalledApps(user?.id),
      ]);
      setWatchlist(w);
      setPriceAlerts(a);
      setSearches(s);
      setInstalledApps(apps);
    };
    loadInitialData();
  }, [user?.id]);

  // Search trigger helper
  const triggerSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setActiveSearchTrigger(query);
    setActiveTab('search');
  }, []);

  // Watchlist methods
  const addToWatchlist = useCallback(async (item: Omit<WatchlistItem, 'id' | 'added_at'>) => {
    const itemWithUser = { ...item, user_id: item.user_id || user?.id };
    const added = await dbService.addToWatchlist(itemWithUser);
    setWatchlist((prev) => [added, ...prev.filter((w) => w.product_name !== item.product_name)]);
    showToast('Added to Watchlist 🏷️', `${item.product_name} is now tracked.`, 'success');
  }, [user?.id, showToast]);

  const removeFromWatchlist = useCallback(async (id: number | string) => {
    await dbService.removeFromWatchlist(id, user?.id);
    setWatchlist((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed from Watchlist', '', 'info');
  }, [user?.id, showToast]);

  // Price Alert methods
  const addPriceAlert = useCallback(async (alert: Omit<PriceAlertItem, 'id' | 'created_at'>) => {
    const alertWithUser = { ...alert, user_id: alert.user_id || user?.id };
    const added = await dbService.addPriceAlert(alertWithUser);
    setPriceAlerts((prev) => [added, ...prev.filter((a) => a.product_name !== alert.product_name)]);

    // Also add to watchlist if not already there
    await dbService.addToWatchlist({
      user_id: alertWithUser.user_id,
      product_name: alert.product_name,
      product_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      platform: alert.platform,
      current_price: alert.current_price,
      target_price: alert.target_price,
      product_url: alert.product_url,
      category: 'General',
      is_notified: false,
    });
    const refreshedWatchlist = await dbService.getWatchlist(user?.id);
    setWatchlist(refreshedWatchlist);

    showToast('Price Drop Alert Created! 🔔', `We'll alert you when it hits ₹${alert.target_price.toLocaleString('en-IN')}`, 'success');
  }, [user?.id, showToast]);

  const togglePriceAlert = useCallback(async (id: number | string, active: boolean) => {
    await dbService.togglePriceAlert(id, active, user?.id);
    setPriceAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_active: active } : a)));
    showToast(active ? 'Alert Activated' : 'Alert Paused', '', 'info');
  }, [user?.id, showToast]);

  const deletePriceAlert = useCallback(async (id: number | string) => {
    await dbService.deletePriceAlert(id, user?.id);
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Alert Deleted', '', 'info');
  }, [user?.id, showToast]);

  // Search History methods
  const recordSearch = useCallback(async (query: string, count: number) => {
    await dbService.recordSearch(query, currentCity, count, user?.id);
    const updated = await dbService.getSearches(user?.id);
    setSearches(updated);
  }, [currentCity, user?.id]);

  const clearSearches = useCallback(async () => {
    await dbService.clearSearches(user?.id);
    setSearches([]);
    showToast('Search History Cleared', '', 'info');
  }, [user?.id, showToast]);

  const deleteSearchItem = useCallback(async (id: number | string) => {
    await dbService.deleteSearchItem(id, user?.id);
    setSearches((prev) => prev.filter((s) => s.id !== id));
  }, [user?.id]);

  // Installed Apps update
  const updateInstalledApps = useCallback(async (apps: InstalledAppItem[]) => {
    setInstalledApps(apps);
    await dbService.saveInstalledApps(apps, user?.id);
    showToast('App Preferences Saved ✅', 'Redirect buttons will now open your installed apps.', 'success');
  }, [user?.id, showToast]);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isUnread: false } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    showToast('All notifications marked as read', '', 'info');
  }, [showToast]);

  const unreadNotificationCount = notifications.filter((n) => n.isUnread).length;

  // Authentication flows
  const loginUser = useCallback(async (email: string, fullName?: string, phone?: string) => {
    const profile: UserProfile = {
      id: `user-${Date.now()}`,
      full_name: fullName || email.split('@')[0],
      email,
      phone: phone || '+91 98765 43210',
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      city: currentCity,
      lat: coordinates[0],
      lon: coordinates[1],
      dark_mode: darkMode,
      total_savings: 0,
      created_at: new Date().toISOString(),
    };
    setUser(profile);
    setIsAuthenticated(true);
    setIsGuest(false);
    localStorage.setItem('smartprice_auth_token', 'true');
    await dbService.saveProfile(profile);

    // Load isolated data for new user
    const [w, a, s] = await Promise.all([
      dbService.getWatchlist(profile.id),
      dbService.getPriceAlerts(profile.id),
      dbService.getSearches(profile.id),
    ]);
    setWatchlist(w);
    setPriceAlerts(a);
    setSearches(s);

    setShowAuthModal(false);
    showToast(`Welcome, ${profile.full_name}! 👋`, 'Your account is ready.', 'success');
  }, [currentCity, coordinates, darkMode, showToast]);

  const logoutUser = useCallback(async () => {
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    // Clear all stored user session tokens & React states for complete data isolation
    localStorage.removeItem('smartprice_auth_token');
    localStorage.removeItem('smartprice_profile');
    localStorage.removeItem('smartprice_session');
    setIsAuthenticated(false);
    setIsGuest(false);
    setUser(null);
    setWatchlist([]);
    setPriceAlerts([]);
    setSearches([]);
    showToast('Signed out successfully', 'See you again soon!', 'info');
  }, [showToast]);

  const continueAsGuest = useCallback(() => {
    setIsAuthenticated(true);
    setIsGuest(true);
    setUser({ ...DEFAULT_GUEST_PROFILE, full_name: 'Guest Shopper' });
    setShowAuthModal(false);
    showToast('Continuing as Guest', 'Full comparison and AI alternatives enabled.', 'info');
  }, [showToast]);

  const updateUserProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    await dbService.saveProfile(updated);
    showToast('Profile Updated Successfully', '', 'success');
  }, [user, showToast]);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        isGuest,
        currentCity,
        currentPincode,
        currentArea,
        coordinates,
        darkMode,
        toggleDarkMode,
        setCity,
        setPincode,
        showLocationModal,
        setShowLocationModal,
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        priceAlerts,
        addPriceAlert,
        togglePriceAlert,
        deletePriceAlert,
        searches,
        recordSearch,
        clearSearches,
        deleteSearchItem,
        installedApps,
        updateInstalledApps,
        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        activeSearchTrigger,
        triggerSearch,
        selectedProductForRedirect,
        setSelectedProductForRedirect,
        selectedProductForAlert,
        setSelectedProductForAlert,
        selectedProductForHistory,
        setSelectedProductForHistory,
        showVoiceModal,
        setShowVoiceModal,
        showApiConfigModal,
        setShowApiConfigModal,
        showOnboarding,
        setShowOnboarding,
        showPermissionsWizard,
        setShowPermissionsWizard,
        showAuthModal,
        setShowAuthModal,
        toasts,
        showToast,
        dismissToast,
        loginUser,
        logoutUser,
        continueAsGuest,
        updateUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
