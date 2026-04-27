-- Merchant Schema for Slasham
-- Contains merchant-facing tables, relations, and Supabase RLS policies.

-- Enable pgcrypto for UUID generation when using Supabase/PostgreSQL.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Users Table (Extended Auth Profile)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'MERCHANT', 'ADMIN')),
  otp_code TEXT,
  otp_expires TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Users can view their own data'
      AND n.nspname = 'public'
      AND c.relname = 'users'
  ) THEN
    CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
  END IF;
END $$;

-- 2. Merchants Table
CREATE TABLE IF NOT EXISTS public.merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  business_name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  is_verified BOOLEAN DEFAULT false,
  logo_url TEXT,
  banner_url TEXT,
  phone TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Anyone can view verified merchants'
      AND n.nspname = 'public'
      AND c.relname = 'merchants'
  ) THEN
    CREATE POLICY "Anyone can view verified merchants" ON public.merchants FOR SELECT USING (is_verified = true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Merchants can view and edit their own profiles'
      AND n.nspname = 'public'
      AND c.relname = 'merchants'
  ) THEN
    CREATE POLICY "Merchants can view and edit their own profiles" ON public.merchants FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- 3. Deals Table
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  deal_explanation TEXT,
  category TEXT NOT NULL,
  original_price NUMERIC NOT NULL,
  discount_price NUMERIC NOT NULL,
  total_quantity INTEGER NOT NULL,
  sold_quantity INTEGER DEFAULT 0,
  validity_days INTEGER NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_hot BOOLEAN DEFAULT false,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Anyone can view active deals'
      AND n.nspname = 'public'
      AND c.relname = 'deals'
  ) THEN
    CREATE POLICY "Anyone can view active deals" ON public.deals FOR SELECT USING (is_active = true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Merchants can manage their own deals'
      AND n.nspname = 'public'
      AND c.relname = 'deals'
  ) THEN
    CREATE POLICY "Merchants can manage their own deals" ON public.deals FOR ALL USING (
      EXISTS (
        SELECT 1 FROM public.merchants m WHERE m.id = deals.merchant_id AND m.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- 4. Vouchers Table
CREATE TABLE IF NOT EXISTS public.vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  voucher_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REDEEMED', 'EXPIRED')),
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Users can view their own vouchers'
      AND n.nspname = 'public'
      AND c.relname = 'vouchers'
  ) THEN
    CREATE POLICY "Users can view their own vouchers" ON public.vouchers FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Merchants can view vouchers for their deals'
      AND n.nspname = 'public'
      AND c.relname = 'vouchers'
  ) THEN
    CREATE POLICY "Merchants can view vouchers for their deals" ON public.vouchers FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.deals d
        JOIN public.merchants m ON d.merchant_id = m.id
        WHERE vouchers.deal_id = d.id AND m.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- 5. Campaign Requests Table
CREATE TABLE IF NOT EXISTS public.campaign_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  description TEXT,
  original_price NUMERIC NOT NULL,
  expected_discount TEXT,
  coupon_type TEXT,
  total_quantity INTEGER,
  expiry_date TIMESTAMP WITH TIME ZONE,
  product_image TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.campaign_requests ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Merchants can view their own requests'
      AND n.nspname = 'public'
      AND c.relname = 'campaign_requests'
  ) THEN
    CREATE POLICY "Merchants can view their own requests" ON public.campaign_requests FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.merchants m WHERE m.id = campaign_requests.merchant_id AND m.user_id = auth.uid()
      )
    );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Merchants can insert requests for themselves'
      AND n.nspname = 'public'
      AND c.relname = 'campaign_requests'
  ) THEN
    CREATE POLICY "Merchants can insert requests for themselves" ON public.campaign_requests FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.merchants m WHERE m.id = campaign_requests.merchant_id AND m.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- 6. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE NOT NULL,
  merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Anyone can view reviews'
      AND n.nspname = 'public'
      AND c.relname = 'reviews'
  ) THEN
    CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Users can create their own reviews'
      AND n.nspname = 'public'
      AND c.relname = 'reviews'
  ) THEN
    CREATE POLICY "Users can create their own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Users can edit their own reviews'
      AND n.nspname = 'public'
      AND c.relname = 'reviews'
  ) THEN
    CREATE POLICY "Users can edit their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE p.polname = 'Merchants can reply to reviews for their business'
      AND n.nspname = 'public'
      AND c.relname = 'reviews'
  ) THEN
    CREATE POLICY "Merchants can reply to reviews for their business" ON public.reviews FOR UPDATE USING (
      EXISTS (
        SELECT 1 FROM public.merchants m WHERE m.id = reviews.merchant_id AND m.user_id = auth.uid()
      )
    );
  END IF;
END $$;

-- Optional indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_merchant_id ON public.deals(merchant_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_deal_id ON public.vouchers(deal_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_user_id ON public.vouchers(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_requests_merchant_id ON public.campaign_requests(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_merchant_id ON public.reviews(merchant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_deal_id ON public.reviews(deal_id);

-- Helpful views for merchant dashboard metrics
CREATE OR REPLACE VIEW public.merchant_dashboard_stats AS
SELECT
  m.id AS merchant_id,
  COUNT(DISTINCT d.id) FILTER (WHERE d.is_active = true) AS active_deals,
  COUNT(v.*) FILTER (WHERE v.status = 'REDEEMED') AS total_redeemed,
  COUNT(DISTINCT v.user_id) AS unique_customers,
  COALESCE(SUM(d.discount_price) FILTER (WHERE v.status = 'REDEEMED'), 0) AS total_revenue
FROM public.merchants m
LEFT JOIN public.deals d ON d.merchant_id = m.id
LEFT JOIN public.vouchers v ON v.deal_id = d.id
GROUP BY m.id;
