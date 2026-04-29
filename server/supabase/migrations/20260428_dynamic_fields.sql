-- Migration: Add dynamic fields for business requirements
-- Tables: campaign_requests, deals

-- Update campaign_requests
ALTER TABLE public.campaign_requests 
ADD COLUMN IF NOT EXISTS min_spend NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS inclusions TEXT,
ADD COLUMN IF NOT EXISTS terms TEXT,
ADD COLUMN IF NOT EXISTS additional_info TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS deal_explanation TEXT;

-- Update deals
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS min_spend NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS inclusions TEXT,
ADD COLUMN IF NOT EXISTS terms TEXT,
ADD COLUMN IF NOT EXISTS additional_info TEXT;
