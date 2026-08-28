export interface Product {
  id?: string;
  name: string;
  price: number;
  mrp: number;
  discountPercentage?: number;
  platform: string;
  url: string; // CRITICAL: Exact product page URL or search fallback URL
  url_type?: 'direct' | 'search_fallback';
  image: string;
  rating?: number;
  reviews?: string;
  delivery: string;
  in_stock: boolean;
  source: 'live' | 'catalog';
  category?: string;
}

export interface AIAlternative {
  name: string;
  brand: string;
  why: string;
  ingredients: string[];
  uses: string[];
  match_score: number;
  category: string;
  estimatedPrice?: number;
  sampleStores?: {
    platform: string;
    price: number;
    delivery: string;
  }[];
}

export interface PriceHistoryTimelinePoint {
  date: string;
  amazon: number;
  blinkit: number;
  flipkart: number;
}

export interface PriceHistoryData {
  query: string;
  currentPrice: number;
  lowestEver: number;
  highestEver: number;
  averagePrice: number;
  isGoodTimeToBuy: boolean;
  recommendation: string;
  timeline: PriceHistoryTimelinePoint[];
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  city: string;
  lat: number;
  lon: number;
  dark_mode: boolean;
  total_savings: number;
  created_at?: string;
}

export interface InstalledAppItem {
  id?: number | string;
  app_name: string;
  is_installed: boolean;
  is_enabled: boolean;
  icon?: string;
  play_store_url?: string;
  app_store_url?: string;
  scheme?: string;
}

export interface WatchlistItem {
  id: number | string;
  user_id?: string;
  product_name: string;
  product_image: string;
  platform: string;
  current_price: number;
  target_price: number;
  product_url: string;
  category: string;
  is_notified: boolean;
  added_at: string;
}

export interface PriceAlertItem {
  id: number | string;
  user_id?: string;
  product_name: string;
  target_price: number;
  current_price: number;
  platform: string;
  product_url: string;
  notify_push: boolean;
  notify_email: boolean;
  notify_whatsapp: boolean;
  is_active: boolean;
  created_at: string;
}

export interface SearchRecord {
  id: number | string;
  user_id?: string;
  query: string;
  city: string;
  result_count: number;
  searched_at: string;
}

export interface AppNotification {
  id: string;
  type: 'price_drop' | 'stock' | 'ai_recommendation';
  title: string;
  description: string;
  timeAgo: string;
  timestamp: number;
  isUnread: boolean;
  productQuery: string;
  iconName?: string;
}

export interface CouponItem {
  id: string;
  code: string;
  platform: string;
  discount: string;
  description: string;
  bgColor: string;
  textColor: string;
}
