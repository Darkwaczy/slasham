-- Slasham RLS Hardening & Fix Script
-- Run this in your Supabase SQL Editor to fix permission issues and secure the database.

-- 1. USERS Table Fixes
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Clear existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Allow insertion during registration" ON public.users;

-- Re-create polished policies
CREATE POLICY "Users can view their own data" ON public.users 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow insertion during registration" ON public.users 
    FOR INSERT WITH CHECK (true); -- Service role and registration logic will handle security

CREATE POLICY "Users can update their own profile" ON public.users 
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all users" ON public.users 
    FOR ALL USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN'
    );

-- 2. VOUCHERS Table Fixes
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own vouchers" ON public.vouchers;
DROP POLICY IF EXISTS "Merchants can view vouchers for their deals" ON public.vouchers;

CREATE POLICY "Users can view their own vouchers" ON public.vouchers 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Merchants can view/update vouchers for their deals" ON public.vouchers 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.deals d
            JOIN public.merchants m ON d.merchant_id = m.id
            WHERE vouchers.deal_id = d.id AND m.user_id = auth.uid()
        )
    );

-- 3. MERCHANT APPLICATIONS Fixes
ALTER TABLE public.merchant_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit an application" ON public.merchant_applications;
DROP POLICY IF EXISTS "Admins can manage applications" ON public.merchant_applications;

CREATE POLICY "Anyone can submit an application" ON public.merchant_applications 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage applications" ON public.merchant_applications 
    FOR ALL USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN'
    );

-- 4. REVIEWS Fixes
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can create reviews" ON public.reviews;

CREATE POLICY "Anyone can view reviews" ON public.reviews 
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Merchants can reply to their reviews" ON public.reviews 
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.merchants m WHERE m.id = reviews.merchant_id AND m.user_id = auth.uid()
        )
    );

-- 5. DEALS Fixes
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active deals" ON public.deals;
DROP POLICY IF EXISTS "Merchants can manage their deals" ON public.deals;

CREATE POLICY "Anyone can view active deals" ON public.deals 
    FOR SELECT USING (is_active = true);

CREATE POLICY "Merchants can manage their deals" ON public.deals 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.merchants m WHERE m.id = deals.merchant_id AND m.user_id = auth.uid()
        )
    );

-- 6. MISSING TABLE: system_settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    id INTEGER PRIMARY KEY,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins only" ON public.system_settings;
CREATE POLICY "Admins only" ON public.system_settings 
    FOR ALL USING (
        (SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN'
    );
