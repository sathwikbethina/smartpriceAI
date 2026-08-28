/**
 * User-isolated dbService implementation for localStorage and Supabase.
 * Each authenticated user ID gets its own isolated storage keys:
 * smartprice_watchlist_{userId}
 * smartprice_alerts_{userId}
 * smartprice_searches_{userId}
 *
 * When Supabase is configured and a user is signed in, data writes
 * directly to the Supabase PostgreSQL database tables with RLS isolation.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, WatchlistItem, PriceAlertItem, SearchRecord, InstalledAppItem } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const DEFAULT_INDIAN_APPS: InstalledAppItem[] = [
  { app_name: 'Blinkit', is_installed: true, is_enabled: true, scheme: 'blinkit://' },
  { app_name: 'Zepto', is_installed: true, is_enabled: true, scheme: 'zepto://' },
  { app_name: 'BigBasket', is_installed: false, is_enabled: true, scheme: 'bigbasket://' },
  { app_name: 'Amazon', is_installed: true, is_enabled: true, scheme: 'amazon://' },
  { app_name: 'Flipkart', is_installed: true, is_enabled: true, scheme: 'flipkart://' },
  { app_name: 'Tata 1mg', is_installed: false, is_enabled: true, scheme: 'tata1mg://' },
  { app_name: 'PharmEasy', is_installed: false, is_enabled: true, scheme: 'pharmeasy://' },
];

export const DEFAULT_GUEST_PROFILE: UserProfile = {
  id: 'guest-user-001',
  full_name: 'Guest Shopper',
  email: 'guest@smartprice.ai',
  phone: '+91 98765 43210',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  city: 'Chennai',
  lat: 13.0827,
  lon: 80.2707,
  dark_mode: false,
  total_savings: 0,
  created_at: new Date().toISOString(),
};

function getUserKey(prefix: string, userId?: string): string {
  const uid = userId || 'guest-user-001';
  return `${prefix}_${uid.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

async function resolveUserId(explicitUserId?: string): Promise<string | undefined> {
  if (explicitUserId && !explicitUserId.startsWith('guest-')) {
    return explicitUserId;
  }
  if (supabase) {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        return data.user.id;
      }
    } catch {}
  }
  return explicitUserId;
}

export const dbService = {
  // Profiles
  async getProfile(userId: string): Promise<UserProfile> {
    const activeUid = await resolveUserId(userId);
    if (supabase && activeUid && !activeUid.startsWith('guest-')) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', activeUid).single();
        if (!error && data) return data as UserProfile;
      } catch (err) {
        console.warn('Supabase getProfile fallback:', err);
      }
    }
    const key = getUserKey('smartprice_profile', userId);
    const saved = localStorage.getItem(key) || localStorage.getItem('smartprice_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return { ...DEFAULT_GUEST_PROFILE, id: userId || DEFAULT_GUEST_PROFILE.id };
  },

  async saveProfile(profile: UserProfile): Promise<UserProfile> {
    const key = getUserKey('smartprice_profile', profile.id);
    localStorage.setItem(key, JSON.stringify(profile));
    localStorage.setItem('smartprice_profile', JSON.stringify(profile));

    const activeUid = await resolveUserId(profile.id);
    if (supabase && activeUid && !activeUid.startsWith('guest-')) {
      try {
        await supabase.from('profiles').upsert({
          ...profile,
          id: activeUid,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase saveProfile note:', err);
      }
    }
    return profile;
  },

  // Watchlist (Isolated per user ID)
  async getWatchlist(userId?: string): Promise<WatchlistItem[]> {
    const activeUid = await resolveUserId(userId);
    if (supabase && activeUid && !activeUid.startsWith('guest-')) {
      try {
        const { data, error } = await supabase
          .from('watchlist')
          .select('*')
          .eq('user_id', activeUid)
          .order('added_at', { ascending: false });
        if (!error && data) return data as WatchlistItem[];
      } catch (err) {
        console.warn('Supabase getWatchlist note:', err);
      }
    }
    const key = getUserKey('smartprice_watchlist', userId);
    const local = localStorage.getItem(key);
    if (local !== null) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    return [];
  },

  async addToWatchlist(item: Omit<WatchlistItem, 'id' | 'added_at'>): Promise<WatchlistItem> {
    const activeUid = await resolveUserId(item.user_id);
    const newItem: WatchlistItem = {
      ...item,
      user_id: activeUid,
      id: Date.now(),
      added_at: new Date().toISOString(),
    };

    const list = await this.getWatchlist(activeUid);
    const updated = [newItem, ...list.filter((w) => w.product_name !== item.product_name)];
    const key = getUserKey('smartprice_watchlist', activeUid);
    localStorage.setItem(key, JSON.stringify(updated));

    if (supabase && activeUid && !activeUid.startsWith('guest-')) {
      try {
        const { data, error } = await supabase.from('watchlist').insert({
          user_id: activeUid,
          product_name: item.product_name,
          product_image: item.product_image,
          platform: item.platform,
          current_price: item.current_price,
          target_price: item.target_price,
          product_url: item.product_url,
          category: item.category || 'General',
          is_notified: false,
        }).select();

        if (error) {
          console.warn('Supabase insert error for watchlist:', error.message);
        } else {
          console.log('✅ Successfully stored watchlist item in Supabase table:', data);
        }
      } catch (err) {
        console.warn('Supabase addToWatchlist note:', err);
      }
    }
    return newItem;
  },

  async removeFromWatchlist(id: number | string, userId?: string): Promise<void> {
    const activeUid = await resolveUserId(userId);
    const list = await this.getWatchlist(activeUid);
    const filtered = list.filter((item) => item.id !== id);
    const key = getUserKey('smartprice_watchlist', activeUid);
    localStorage.setItem(key, JSON.stringify(filtered));

    if (supabase && activeUid && !activeUid.startsWith('guest-')) {
      try {
        await supabase.from('watchlist').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase removeFromWatchlist note:', err);
      }
    }
  },

  // Price Alerts (Isolated per user ID)
  async getPriceAlerts(userId?: string): Promise<PriceAlertItem[]> {
    const activeUid = await resolveUserId(userId);
    if (supabase && activeUid && !activeUid.startsWith('guest-')) {
      try {
        const { data, error } = await supabase
          .from('price_alerts')
          .select('*')
          .eq('user_id', activeUid)
          .order('created_at', { ascending: false });
        if (!error && data) return data as PriceAlertItem[];
      } catch (err) {
        console.warn('Supabase getPriceAlerts note:', err);
      }
    }
    const key = getUserKey('smartprice_alerts', userId);
    const local = localStorage.getItem(key);
    if (local !== null) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    return [];
  },

  async addPriceAlert(alert: Omit<PriceAlertItem, 'id' | 'created_at'>): Promise<PriceAlertItem> {
    const activeUid = await resolveUserId(alert.user_id);
    const newAlert: PriceAlertItem = {
      ...alert,
      user_id: activeUid,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };

    const list = await this.getPriceAlerts(activeUid);
    const updated = [newAlert, ...list.filter((a) => a.product_name !== alert.product_name)];
    const key = getUserKey('smartprice_alerts', activeUid);
    localStorage.setItem(key, JSON.stringify(updated));

    if (supabase && activeUid && !activeUid.startsWith('guest-')) {
      try {
        const { data, error } = await supabase.from('price_alerts').insert({
          user_id: activeUid,
          product_name: alert.product_name,
          target_price: alert.target_price,
          current_price: alert.current_price,
          platform: alert.platform,
          product_url: alert.product_url,
          notify_push: alert.notify_push,
          notify_email: alert.notify_email,
          notify_whatsapp: alert.notify_whatsapp,
          is_active: alert.is_active,
        }).select();

        if (error) {
          console.warn('Supabase insert error for price_alerts:', error.message);
        } else {
          console.log('✅ Successfully stored price alert in Supabase table:', data);
        }
      } catch (err) {
        console.warn('Supabase addPriceAlert note:', err);
      }
    }
    return newAlert;
  },

  async togglePriceAlert(id: number | string, is_active: boolean, userId?: string): Promise<void> {
    const activeUid = await resolveUserId(userId);
    const list = await this.getPriceAlerts(activeUid);
    const updated = list.map((a) => (a.id === id ? { ...a, is_active } : a));
    const key = getUserKey('smartprice_alerts', activeUid);
    localStorage.setItem(key, JSON.stringify(updated));
    if (supabase) {
      try {
        await supabase.from('price_alerts').update({ is_active }).eq('id', id);
      } catch {}
    }
  },

  async deletePriceAlert(id: number | string, userId?: string): Promise<void> {
    const activeUid = await resolveUserId(userId);
    const list = await this.getPriceAlerts(activeUid);
    const updated = list.filter((a) => a.id !== id);
    const key = getUserKey('smartprice_alerts', activeUid);
    localStorage.setItem(key, JSON.stringify(updated));
    if (supabase) {
      try {
        await supabase.from('price_alerts').delete().eq('id', id);
      } catch {}
    }
  },

  // Searches (Isolated per user ID)
  async getSearches(userId?: string): Promise<SearchRecord[]> {
    const activeUid = await resolveUserId(userId);
    if (supabase && activeUid && !activeUid.startsWith('guest-')) {
      try {
        const { data, error } = await supabase
          .from('searches')
          .select('*')
          .eq('user_id', activeUid)
          .order('searched_at', { ascending: false })
          .limit(30);
        if (!error && data) return data as SearchRecord[];
      } catch (err) {
        console.warn('Supabase getSearches note:', err);
      }
    }
    const key = getUserKey('smartprice_searches', userId);
    const local = localStorage.getItem(key);
    if (local !== null) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    return [];
  },

  async recordSearch(query: string, city: string, result_count: number, userId?: string): Promise<void> {
    const activeUid = await resolveUserId(userId);
    const newRecord: SearchRecord = {
      id: Date.now(),
      user_id: activeUid,
      query,
      city,
      result_count,
      searched_at: new Date().toISOString(),
    };
    const list = await this.getSearches(activeUid);
    const updated = [newRecord, ...list.filter((s) => s.query.toLowerCase() !== query.toLowerCase())];
    const key = getUserKey('smartprice_searches', activeUid);
    localStorage.setItem(key, JSON.stringify(updated));

    if (supabase && activeUid && !activeUid.startsWith('guest-')) {
      try {
        const { data, error } = await supabase.from('searches').insert({
          user_id: activeUid,
          query,
          city,
          result_count,
        }).select();

        if (error) {
          console.warn('Supabase insert error for searches:', error.message);
        } else {
          console.log('✅ Successfully stored search in Supabase table:', data);
        }
      } catch (err) {
        console.warn('Supabase recordSearch note:', err);
      }
    }
  },

  async clearSearches(userId?: string): Promise<void> {
    const activeUid = await resolveUserId(userId);
    const key = getUserKey('smartprice_searches', activeUid);
    localStorage.removeItem(key);
    if (supabase && activeUid && !activeUid.startsWith('guest-')) {
      try {
        await supabase.from('searches').delete().eq('user_id', activeUid);
      } catch {}
    }
  },

  async deleteSearchItem(id: number | string, userId?: string): Promise<void> {
    const activeUid = await resolveUserId(userId);
    const list = await this.getSearches(activeUid);
    const updated = list.filter((s) => s.id !== id);
    const key = getUserKey('smartprice_searches', activeUid);
    localStorage.setItem(key, JSON.stringify(updated));
    if (supabase && activeUid && !activeUid.startsWith('guest-')) {
      try {
        await supabase.from('searches').delete().eq('id', id);
      } catch {}
    }
  },

  // Installed Apps
  async getInstalledApps(userId?: string): Promise<InstalledAppItem[]> {
    const activeUid = await resolveUserId(userId);
    if (supabase && activeUid && !activeUid.startsWith('guest-')) {
      try {
        const { data, error } = await supabase.from('user_installed_apps').select('*').eq('user_id', activeUid);
        if (!error && data && data.length > 0) return data as InstalledAppItem[];
      } catch (err) {
        console.warn('Supabase getInstalledApps note:', err);
      }
    }
    const key = getUserKey('smartprice_installed_apps', userId);
    const local = localStorage.getItem(key);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    return DEFAULT_INDIAN_APPS;
  },

  async saveInstalledApps(apps: InstalledAppItem[], userId?: string): Promise<void> {
    const activeUid = await resolveUserId(userId);
    const key = getUserKey('smartprice_installed_apps', activeUid);
    localStorage.setItem(key, JSON.stringify(apps));
    if (supabase && activeUid && !activeUid.startsWith('guest-')) {
      try {
        for (const app of apps) {
          await supabase.from('user_installed_apps').upsert({
            user_id: activeUid,
            app_name: app.app_name,
            is_installed: app.is_installed,
            is_enabled: app.is_enabled,
          });
        }
      } catch (err) {
        console.warn('Supabase saveInstalledApps note:', err);
      }
    }
  },
};
