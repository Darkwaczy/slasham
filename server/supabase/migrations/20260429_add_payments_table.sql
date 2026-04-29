-- Create payments table for Paystack transaction tracking
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  
  -- Payment status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  
  -- Paystack-specific fields
  paystack_reference TEXT UNIQUE,
  paystack_status TEXT,
  paystack_customer_id TEXT,
  
  -- Metadata
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_deal_id ON payments(deal_id);
CREATE INDEX idx_payments_merchant_id ON payments(merchant_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_paystack_reference ON payments(paystack_reference);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- Add payment_id column to vouchers table
ALTER TABLE vouchers ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id) ON DELETE CASCADE;

-- Create index on vouchers.payment_id
CREATE INDEX IF NOT EXISTS idx_vouchers_payment_id ON vouchers(payment_id);

-- Add trigger to update vouchers.updated_at
CREATE OR REPLACE FUNCTION update_vouchers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_vouchers_updated_at
BEFORE UPDATE ON vouchers
FOR EACH ROW
EXECUTE FUNCTION update_vouchers_updated_at();

-- Add trigger to update payments.updated_at
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_payments_updated_at();

-- Enable RLS for payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own payments
CREATE POLICY payments_select_own ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own payments (via API only, not direct)
CREATE POLICY payments_insert_own ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Merchants can view payments for their deals
CREATE POLICY payments_select_merchant ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM merchants m
      WHERE m.id = payments.merchant_id
      AND m.user_id = auth.uid()
    )
  );

-- RLS Policy: Admins can view all payments (via service role, not anon)
-- Handled via service role key in backend, no RLS needed for admins
