-- Add coupon_price to campaign_requests table
ALTER TABLE campaign_requests ADD COLUMN IF NOT EXISTS coupon_price NUMERIC;

-- Add coupon_price to deals table
ALTER TABLE deals ADD COLUMN IF NOT EXISTS coupon_price NUMERIC;

-- Update existing deals to have a default coupon_price equal to their discount_price 
-- (This ensures older deals continue to work without breaking Paystack until they are updated)
UPDATE deals SET coupon_price = discount_price WHERE coupon_price IS NULL;
