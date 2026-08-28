-- ==============================================================================
-- SmartPrice AI — Complete Supabase Database Schema & RLS Policies
-- Copy and paste this script into your Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    city TEXT DEFAULT 'Chennai',
    lat DOUBLE PRECISION DEFAULT 13.0827,
    lon DOUBLE PRECISION DEFAULT 80.2707,
    dark_mode BOOLEAN DEFAULT FALSE,
    total_savings NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Search History Table (Strictly isolated per account)
CREATE TABLE IF NOT EXISTS public.searches (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    city TEXT DEFAULT 'Chennai',
    result_count INT DEFAULT 0,
    searched_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Watchlist Table (Strictly isolated per account)
CREATE TABLE IF NOT EXISTS public.watchlist (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_image TEXT,
    platform TEXT,
    current_price NUMERIC,
    target_price NUMERIC,
    product_url TEXT,
    category TEXT,
    is_notified BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Price Alerts Table (Strictly isolated per account)
CREATE TABLE IF NOT EXISTS public.price_alerts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    target_price NUMERIC NOT NULL,
    current_price NUMERIC,
    platform TEXT,
    product_url TEXT,
    notify_push BOOLEAN DEFAULT TRUE,
    notify_email BOOLEAN DEFAULT TRUE,
    notify_whatsapp BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create User Installed Apps Preferences Table
CREATE TABLE IF NOT EXISTS public.user_installed_apps (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    app_name TEXT NOT NULL,
    is_installed BOOLEAN DEFAULT TRUE,
    is_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, app_name)
);

-- ==============================================================================
-- 6. Enable Row Level Security (RLS) on all tables for strict data isolation
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_installed_apps ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 7. RLS Policies (Each user can ONLY view, insert, and delete their own data)
-- ==============================================================================

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Searches Policies
DROP POLICY IF EXISTS "Users can view own searches" ON public.searches;
CREATE POLICY "Users can view own searches" ON public.searches FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own searches" ON public.searches;
CREATE POLICY "Users can insert own searches" ON public.searches FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own searches" ON public.searches;
CREATE POLICY "Users can delete own searches" ON public.searches FOR DELETE USING (auth.uid() = user_id);

-- Watchlist Policies
DROP POLICY IF EXISTS "Users can view own watchlist" ON public.watchlist;
CREATE POLICY "Users can view own watchlist" ON public.watchlist FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert into own watchlist" ON public.watchlist;
CREATE POLICY "Users can insert into own watchlist" ON public.watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from own watchlist" ON public.watchlist;
CREATE POLICY "Users can delete from own watchlist" ON public.watchlist FOR DELETE USING (auth.uid() = user_id);

-- Price Alerts Policies
DROP POLICY IF EXISTS "Users can view own price alerts" ON public.price_alerts;
CREATE POLICY "Users can view own price alerts" ON public.price_alerts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own price alerts" ON public.price_alerts;
CREATE POLICY "Users can insert own price alerts" ON public.price_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own price alerts" ON public.price_alerts;
CREATE POLICY "Users can update own price alerts" ON public.price_alerts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own price alerts" ON public.price_alerts;
CREATE POLICY "Users can delete own price alerts" ON public.price_alerts FOR DELETE USING (auth.uid() = user_id);

-- User Installed Apps Policies
DROP POLICY IF EXISTS "Users can view own installed apps" ON public.user_installed_apps;
CREATE POLICY "Users can view own installed apps" ON public.user_installed_apps FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own installed apps" ON public.user_installed_apps;
CREATE POLICY "Users can manage own installed apps" ON public.user_installed_apps FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- 8. Automatic Profile Creation Trigger on Signup
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Shopper'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
