import { Router } from "express";
import { createHmac } from "crypto";
import axios from "axios";
import { getSupabaseAdmin } from "../supabase";
import { requireAuth } from "../middleware/auth";
import { getEnv } from "../env";
import { sendCouponPurchased, sendMerchantPurchaseAlert } from "../utils/email";
import { randomBytes } from "crypto";

const router = Router();
const PAYSTACK_BASE_URL = "https://api.paystack.co";

// Generate random voucher code (e.g. SLSH-X8J-9M2)
const generateVoucherCode = () => {
  const code = randomBytes(4).toString('hex').toUpperCase();
  return `SLSH-${code.slice(0, 4)}-${code.slice(4)}`;
};

// ────────────────────────────────────────────────────────────────────────────
// POST /api/payments/initiate
// Initialize a Paystack transaction for deal purchase
// ────────────────────────────────────────────────────────────────────────────
router.post("/initiate", requireAuth, async (req, res) => {
  try {
    const { deal_id } = req.body;
    const env = getEnv();

    if (!deal_id) {
      return res.status(400).json({ error: "Deal ID is required" });
    }

    if (!env.paystackSecretKey) {
      return res.status(500).json({ error: "Paystack not configured" });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("Database not configured");

    // 1. Fetch and validate deal
    const { data: deal, error: dealError } = await supabase
      .from("deals")
      .select("*, merchants(id, business_name, users(email))")
      .eq("id", deal_id)
      .single();

    if (dealError || !deal) {
      return res.status(404).json({ error: "Deal not found" });
    }

    if (!deal.is_active || new Date(deal.expiry_date) < new Date()) {
      return res.status(400).json({ error: "Deal is expired or inactive" });
    }

    if (deal.sold_quantity >= deal.total_quantity) {
      return res.status(400).json({ error: "Deal is sold out" });
    }

    // 2. Fetch user details for payment
    const { data: user } = await supabase
      .from("users")
      .select("email, name")
      .eq("id", req.user.id)
      .single();

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // 3. Create pending payment record
    const amountInKobo = Math.round(deal.discount_price * 100); // Paystack uses kobo (smallest unit)

    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: req.user.id,
        deal_id: deal_id,
        merchant_id: deal.merchants.id,
        amount: deal.discount_price,
        currency: "NGN",
        status: "pending",
        paystack_status: "pending",
      })
      .select()
      .single();

    if (paymentError) {
      console.error("Payment record creation error:", paymentError);
      return res.status(500).json({ error: "Failed to create payment record" });
    }

    // 4. Initialize Paystack transaction
    try {
      const paystackResponse = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email: user.email,
          amount: amountInKobo,
          metadata: {
            deal_id: deal_id,
            user_id: req.user.id,
            payment_id: payment.id,
            merchant_id: deal.merchants.id,
          },
          cancel_action: `${env.clientUrl}/deals/${deal_id}`,
        },
        {
          headers: {
            Authorization: `Bearer ${env.paystackSecretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { authorization_url, access_code, reference } = paystackResponse.data.data;

      // 5. Store Paystack reference in payment record
      await supabase
        .from("payments")
        .update({ paystack_reference: reference })
        .eq("id", payment.id);

      res.json({
        success: true,
        authorization_url,
        access_code,
        reference,
        payment_id: payment.id,
      });
    } catch (paystackError: any) {
      console.error("Paystack initialization error:", paystackError.response?.data || paystackError.message);

      // Mark payment as failed
      await supabase
        .from("payments")
        .update({ status: "failed", paystack_status: "error" })
        .eq("id", payment.id);

      return res.status(500).json({
        error: "Failed to initialize payment",
        details: paystackError.response?.data?.message || paystackError.message,
      });
    }
  } catch (error: any) {
    console.error("Payment initiation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// Helper: Verify and Fulfill Order
// ────────────────────────────────────────────────────────────────────────────
const verifyAndCreateVoucher = async (reference: string, supabase: any) => {
  const env = getEnv();
  
  // 1. Fetch local payment record
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .select("*")
    .eq("paystack_reference", reference)
    .single();

  if (paymentError || !payment) throw new Error("Payment record not found");
  
  // If already processed, just return success
  if (payment.status === "success") return payment;

  // 2. Verify with Paystack API
  const verifyResponse = await axios.get(
    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${env.paystackSecretKey}`,
      },
    }
  );

  const verifiedData = verifyResponse.data.data;

  if (verifiedData.status !== "success") {
    // Mark as failed in our DB if Paystack says so
    await supabase
      .from("payments")
      .update({ status: "failed", paystack_status: verifiedData.status })
      .eq("id", payment.id);
    throw new Error(`Payment status: ${verifiedData.status}`);
  }

  // 3. Mark payment as success in our DB
  await supabase
    .from("payments")
    .update({
      status: "success",
      paystack_status: "success",
      paystack_customer_id: verifiedData.customer?.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payment.id);

  // 4. Order Fulfillment: Create Voucher
  const voucherCode = generateVoucherCode();
  
  // A. Increment sold quantity
  const { data: currentDeal } = await supabase
    .from("deals")
    .select("sold_quantity")
    .eq("id", payment.deal_id)
    .single();

  await supabase
    .from("deals")
    .update({ sold_quantity: (currentDeal?.sold_quantity || 0) + 1 })
    .eq("id", payment.deal_id);

  // B. Create the voucher
  const { error: voucherError } = await supabase
    .from("vouchers")
    .insert({
      user_id: payment.user_id,
      deal_id: payment.deal_id,
      voucher_code: voucherCode,
      payment_id: payment.id,
      status: "ACTIVE",
    });

  if (voucherError) throw voucherError;

  // 5. Send Notifications (Non-blocking)
  try {
    const [{ data: user }, { data: deal }] = await Promise.all([
      supabase.from("users").select("email, name").eq("id", payment.user_id).single(),
      supabase.from("deals").select("*, merchants(business_name, users(email))").eq("id", payment.deal_id).single()
    ]);

    if (user && deal) {
      // To Customer
      sendCouponPurchased(
        user.email,
        user.name,
        deal.title,
        voucherCode,
        deal.discount_price.toString()
      ).catch(e => console.error("Email Error:", e));

      // To Merchant
      // @ts-ignore
      const merchantEmail = deal.merchants?.users?.email;
      if (merchantEmail) {
        sendMerchantPurchaseAlert(
          merchantEmail,
          deal.merchants.business_name,
          deal.title,
          user.name
        ).catch(e => console.error("Merchant Email Error:", e));
      }
    }
  } catch (err) {
    console.error("Post-verification notification error:", err);
  }

  return { ...payment, status: "success", voucher_code: voucherCode };
};

// ────────────────────────────────────────────────────────────────────────────
// POST /api/payments/webhook
// Paystack webhook for payment confirmation
// ────────────────────────────────────────────────────────────────────────────
router.post("/webhook", async (req, res) => {
  try {
    const env = getEnv();

    if (!env.paystackWebhookSecret) {
      console.warn("Webhook secret not configured");
      return res.status(500).json({ error: "Webhook not configured" });
    }

    // 1. Verify webhook signature using the RAW Buffer from req.body
    const hash = createHmac("sha512", env.paystackWebhookSecret)
      .update(req.body)
      .digest("hex");

    const signature = req.headers["x-paystack-signature"];
    if (hash !== signature) {
      console.warn("Invalid webhook signature");
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 2. Parse the raw Buffer into an object
    const event = JSON.parse(req.body.toString());

    // 3. Handle only charge.success events
    if (event.event !== "charge.success") {
      return res.json({ success: true, message: "Event ignored" });
    }

    const { reference } = event.data;
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("Database not configured");

    console.log(`Processing webhook for reference: ${reference}`);
    await verifyAndCreateVoucher(reference, supabase);

    res.json({ success: true, message: "Webhook processed" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    // Always return 200 to Paystack to stop retries if it's a processing error
    res.status(200).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// GET /api/payments/verify-callback
// Redirect handler from Paystack checkout
// ────────────────────────────────────────────────────────────────────────────
router.get("/verify-callback", async (req, res) => {
  const { reference } = req.query;
  const env = getEnv();
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    if (!reference) throw new Error("No reference provided");

    await verifyAndCreateVoucher(reference as string, supabase);
    res.redirect(`${env.clientUrl}/user/coupons?payment=success`);
  } catch (error) {
    console.error("Callback verification failed:", error);
    res.redirect(`${env.clientUrl}/user/coupons?payment=failed`);
  }
});

// ────────────────────────────────────────────────────────────────────────────
// POST /api/payments/verify/:reference
// Verify payment status (client-side fallback after redirect)
// ────────────────────────────────────────────────────────────────────────────
router.post("/verify/:reference", requireAuth, async (req, res) => {
  try {
    const { reference } = req.params;
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("Database not configured");

    const result = await verifyAndCreateVoucher(reference as string, supabase);
    
    res.json({
      success: true,
      status: "success",
      message: "Payment confirmed",
      payment: result,
    });
  } catch (error: any) {
    console.error("Verification error:", error.message);
    res.status(400).json({
      error: "Failed to verify payment",
      details: error.message,
    });
  }
});

export default router;
