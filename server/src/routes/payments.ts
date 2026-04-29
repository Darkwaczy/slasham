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

    // 1. Verify webhook signature
    const hash = createHmac("sha512", env.paystackWebhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    const signature = req.headers["x-paystack-signature"];
    if (hash !== signature) {
      console.warn("Invalid webhook signature");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const event = req.body;

    // 2. Handle only charge.success events
    if (event.event !== "charge.success") {
      return res.json({ success: true, message: "Event received but not processed" });
    }

    const { data } = event;
    const { reference, status, metadata } = data;

    if (status !== "success") {
      console.warn(`Payment ${reference} status: ${status}`);
      return res.json({ success: true });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("Database not configured");

    // 3. Fetch payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("paystack_reference", reference)
      .single();

    if (paymentError || !payment) {
      console.warn(`Payment record not found for reference: ${reference}`);
      return res.status(404).json({ error: "Payment not found" });
    }

    // 4. Prevent duplicate processing
    if (payment.status === "success") {
      console.log(`Payment ${reference} already processed`);
      return res.json({ success: true, message: "Payment already processed" });
    }

    // 5. Verify transaction with Paystack API
    try {
      const verifyResponse = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${env.paystackSecretKey}`,
          },
        }
      );

      const verifiedData = verifyResponse.data.data;

      if (verifiedData.status !== "success" || verifiedData.amount !== Math.round(payment.amount * 100)) {
        console.warn(
          `Payment verification failed for ${reference}:`,
          `Expected ${Math.round(payment.amount * 100)}, got ${verifiedData.amount}`
        );

        // Mark as failed
        await supabase
          .from("payments")
          .update({ status: "failed", paystack_status: "verification_failed" })
          .eq("id", payment.id);

        return res.json({ success: true, message: "Verification failed" });
      }
    } catch (verifyError: any) {
      console.error("Paystack verification error:", verifyError.response?.data || verifyError.message);

      await supabase
        .from("payments")
        .update({ status: "failed", paystack_status: "verification_error" })
        .eq("id", payment.id);

      return res.json({ success: true, message: "Verification error" });
    }

    // 6. Mark payment as success
    await supabase
      .from("payments")
      .update({
        status: "success",
        paystack_status: "success",
        paystack_customer_id: data.customer?.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    // 7. Create voucher for the user
    try {
      const voucherCode = generateVoucherCode();

      const { data: user } = await supabase
        .from("users")
        .select("email, name")
        .eq("id", payment.user_id)
        .single();

      const { data: deal } = await supabase
        .from("deals")
        .select("*, merchants(business_name, users(email))")
        .eq("id", payment.deal_id)
        .single();

      // Increment sold quantity
      const { data: currentDeal } = await supabase
        .from("deals")
        .select("sold_quantity")
        .eq("id", payment.deal_id)
        .single();

      await supabase
        .from("deals")
        .update({ sold_quantity: (currentDeal?.sold_quantity || 0) + 1 })
        .eq("id", payment.deal_id);

      // Create voucher
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

      // 8. Send emails
      try {
        if (user && deal) {
          // Email to customer
          await sendCouponPurchased(
            user.email,
            user.name,
            deal.title,
            voucherCode,
            deal.discount_price.toString()
          ).catch((e) => console.error("Customer email error:", e));

          // Email to merchant
          // @ts-ignore
          const merchantEmail = deal.merchants?.users?.email;
          if (merchantEmail) {
            await sendMerchantPurchaseAlert(
              merchantEmail,
              deal.merchants.business_name,
              deal.title,
              user.name
            ).catch((e) => console.error("Merchant email error:", e));
          }
        }
      } catch (emailErr) {
        console.error("Email sending error:", emailErr);
      }

      console.log(`✅ Payment ${reference} processed successfully. Voucher: ${voucherCode}`);
    } catch (voucherErr) {
      console.error("Voucher creation error:", voucherErr);
      // Payment succeeded but voucher creation failed - log for manual review
      await supabase
        .from("payments")
        .update({ paystack_status: "voucher_creation_pending" })
        .eq("id", payment.id);
    }

    res.json({ success: true, message: "Webhook processed" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ────────────────────────────────────────────────────────────────────────────
// POST /api/payments/verify/:reference
// Verify payment status (client-side fallback after redirect)
// ────────────────────────────────────────────────────────────────────────────
router.post("/verify/:reference", requireAuth, async (req, res) => {
  try {
    const { reference } = req.params;
    const env = getEnv();

    if (!env.paystackSecretKey) {
      return res.status(500).json({ error: "Paystack not configured" });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("Database not configured");

    // 1. Fetch local payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("paystack_reference", reference)
      .eq("user_id", req.user.id)
      .single();

    if (paymentError || !payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // 2. If already processed, return status
    if (payment.status === "success") {
      return res.json({
        success: true,
        status: "success",
        message: "Payment confirmed",
        payment,
      });
    }

    // 3. Verify with Paystack
    try {
      const verifyResponse = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${env.paystackSecretKey}`,
          },
        }
      );

      const verifiedData = verifyResponse.data.data;

      if (verifiedData.status === "success") {
        // ────────────────────────────────────────────────────────────────────
        // ⚡ ROBUSTNESS: If Paystack says success but our DB is still pending,
        // we process it here as a fallback (essential for local testing where 
        // webhooks don't reach localhost).
        // ────────────────────────────────────────────────────────────────────
        if (payment.status !== "success") {
          console.log(`Processing payment ${reference} via manual verification fallback...`);
          
          // 1. Mark payment as success
          await supabase
            .from("payments")
            .update({
              status: "success",
              paystack_status: "success",
              paystack_customer_id: verifiedData.customer?.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", payment.id);

          // 2. Create voucher
          try {
            const voucherCode = generateVoucherCode();
            
            // Increment sold quantity
            const { data: currentDeal } = await supabase
              .from("deals")
              .select("sold_quantity")
              .eq("id", payment.deal_id)
              .single();

            await supabase
              .from("deals")
              .update({ sold_quantity: (currentDeal?.sold_quantity || 0) + 1 })
              .eq("id", payment.deal_id);

            // Create voucher
            await supabase
              .from("vouchers")
              .insert({
                user_id: payment.user_id,
                deal_id: payment.deal_id,
                voucher_code: voucherCode,
                payment_id: payment.id,
                status: "ACTIVE",
              });

            // 3. Send emails
            const { data: user } = await supabase.from("users").select("email, name").eq("id", payment.user_id).single();
            const { data: deal } = await supabase.from("deals").select("*, merchants(business_name, users(email))").eq("id", payment.deal_id).single();
            
            if (user && deal) {
              await sendCouponPurchased(user.email, user.name, deal.title, voucherCode, deal.discount_price.toString()).catch(e => console.error("Email Error:", e));
            }
          } catch (voucherErr) {
            console.error("Voucher creation error in fallback:", voucherErr);
          }
        }

        return res.json({
          success: true,
          status: "success",
          message: "Payment verified and processed",
          payment,
        });
      } else {
        return res.json({
          success: false,
          status: verifiedData.status,
          message: `Payment status: ${verifiedData.status}`,
        });
      }
    } catch (verifyError: any) {
      console.error("Verification error:", verifyError.response?.data || verifyError.message);
      return res.status(500).json({
        error: "Failed to verify payment",
      });
    }
  } catch (error: any) {
    console.error("Verify error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
