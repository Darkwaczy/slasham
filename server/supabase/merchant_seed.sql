-- Merchant Seed Data for Testing
-- Run this after merchant_schema.sql to populate test data

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Ensure merchants table has all required columns (in case schema was run without them)
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.merchants ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Ensure deals table has all required columns
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS is_hot BOOLEAN DEFAULT false;
ALTER TABLE public.deals ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- Insert test auth users first (required for foreign key constraints)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  aud,
  role
) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'merchant@test.com',
    crypt('testpassword', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'customer1@test.com',
    crypt('testpassword', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'customer2@test.com',
    crypt('testpassword', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    'customer3@test.com',
    crypt('testpassword', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated'
  );

-- Insert test user (merchant)
INSERT INTO public.users (id, email, name, role, is_verified)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'merchant@test.com', 'Test Merchant', 'MERCHANT', true);

-- Insert merchant profile
INSERT INTO public.merchants (user_id, business_name, description, address, city, is_verified, logo_url, banner_url, phone, website_url)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Slasham Test Restaurant',
  'A premium dining experience with authentic local cuisine',
  '123 Test Street, Victoria Island',
  'Lagos',
  true,
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
  '+2348012345678',
  'https://testrestaurant.com'
);

-- Insert test deal
INSERT INTO public.deals (merchant_id, title, description, deal_explanation, category, original_price, discount_price, total_quantity, sold_quantity, validity_days, expiry_date, is_active, is_hot, images)
VALUES (
  (SELECT id FROM public.merchants WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'),
  'Premium Lunch Special',
  'Delicious lunch combo with appetizer, main course, and dessert',
  'Get 40% off our signature lunch menu - perfect for business meetings',
  'Food & Dining',
  5000,
  3000,
  50,
  12,
  30,
  '2026-05-27 23:59:59+00',
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400']
);

-- Insert test users (customers)
INSERT INTO public.users (id, email, name, role, is_verified)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'customer1@test.com', 'John Doe', 'USER', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'customer2@test.com', 'Jane Smith', 'USER', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'customer3@test.com', 'Bob Johnson', 'USER', true);

-- Insert test vouchers (some redeemed, some active)
INSERT INTO public.vouchers (user_id, deal_id, voucher_code, status, redeemed_at)
VALUES
  (
    '550e8400-e29b-41d4-a716-446655440001',
    (SELECT id FROM public.deals WHERE title = 'Premium Lunch Special'),
    'SLAM-TEST-001',
    'REDEEMED',
    '2026-04-25 14:30:00+00'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    (SELECT id FROM public.deals WHERE title = 'Premium Lunch Special'),
    'SLAM-TEST-002',
    'REDEEMED',
    '2026-04-26 12:15:00+00'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440003',
    (SELECT id FROM public.deals WHERE title = 'Premium Lunch Special'),
    'SLAM-TEST-003',
    'ACTIVE',
    NULL
  );

-- Insert test reviews
INSERT INTO public.reviews (user_id, deal_id, merchant_id, rating, comment, reply, created_at, updated_at)
VALUES
  (
    '550e8400-e29b-41d4-a716-446655440001',
    (SELECT id FROM public.deals WHERE title = 'Premium Lunch Special'),
    (SELECT id FROM public.merchants WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'),
    5,
    'Amazing food and great service! The lunch special was worth every penny.',
    'Thank you for the wonderful review! We''re glad you enjoyed your meal.',
    '2026-04-25 15:00:00+00',
    '2026-04-25 16:00:00+00'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    (SELECT id FROM public.deals WHERE title = 'Premium Lunch Special'),
    (SELECT id FROM public.merchants WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'),
    4,
    'Good food but service was a bit slow during peak hours.',
    NULL,
    '2026-04-26 13:00:00+00',
    '2026-04-26 13:00:00+00'
  );

-- Insert test campaign request
INSERT INTO public.campaign_requests (merchant_id, product_name, description, original_price, expected_discount, coupon_type, total_quantity, expiry_date, product_image, status)
VALUES (
  (SELECT id FROM public.merchants WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'),
  'Weekend Dinner Special',
  'Romantic dinner for two with wine pairing',
  15000,
  '30%',
  'FIXED',
  20,
  '2026-05-31 23:59:59+00',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
  'PENDING'
);