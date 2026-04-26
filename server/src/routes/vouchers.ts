import { Router } from "express";
import { getSupabaseAdmin } from "../supabase";
import { requireAuth } from "../middleware/auth";
import { sendCouponPurchased, sendMerchantPurchaseAlert, sendCouponRedeemed } from "../utils/email";

const router = Router();

// Generate random voucher code (e.g. SLSH-X8J-9M2)
const generateVoucherCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const p1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const p2 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `SLSH-${p1}-${p2}`;
};

// User claims a deal
router.post("/claim", requireAuth, async (req, res) => {
  try {
    const { deal_id } = req.body;
    if (!deal_id) return res.status(400).json({ error: "Deal ID is required" });

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // 1. Check deal validity and fetch merchant info for alert
    const { data: deal, error: dealError } = await supabase
      .from("deals")
      .select("*, merchants(*, users(email))")
      .eq("id", deal_id)
      .single();

    if (dealError || !deal) return res.status(404).json({ error: "Deal not found" });
    if (!deal.is_active || new Date(deal.expiry_date) < new Date()) {
      return res.status(400).json({ error: "Deal is expired or inactive" });
    }
    if (deal.sold_quantity >= deal.total_quantity) {
      return res.status(400).json({ error: "Deal is sold out" });
    }

    // 2. Increment sold quantity
    const { error: updateError } = await supabase
      .from("deals")
      .update({ sold_quantity: deal.sold_quantity + 1 })
      .eq("id", deal_id);

    if (updateError) throw updateError;

    // 3. Create voucher
    const voucherCode = generateVoucherCode();
    const { data: voucher, error: voucherError } = await supabase
      .from("vouchers")
      .insert({
        user_id: req.user.id,
        deal_id,
        voucher_code: voucherCode,
      })
      .select()
      .single();

    if (voucherError) throw voucherError;

    // 4. Trigger Emails
    try {
      // Get User Name from session/DB
      const { data: user } = await supabase.from("users").select("name, email").eq("id", req.user.id).single();
      
      if (user) {
        await sendCouponPurchased(user.email, user.name, deal.title, voucherCode, deal.discount_price.toString());
        
        // Alert Merchant
        // @ts-ignore
        const merchantEmail = deal.merchants?.users?.email;
        if (merchantEmail) {
            // @ts-ignore
            await sendMerchantPurchaseAlert(merchantEmail, deal.merchants.business_name, deal.title, user.name);
        }
      }
    } catch (emailErr) {
      console.error("Voucher purchase emails failed:", emailErr);
    }

    res.status(201).json({ message: "Deal claimed successfully", voucher });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's vouchers
router.get("/my-vouchers", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("vouchers")
      .select(`
        *,
        deals (
          title,
          original_price,
          discount_price,
          deal_explanation,
          merchants (
            business_name,
            address
          )
        )
      `)
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Merchant redeems a voucher
router.post("/redeem", requireAuth, async (req, res) => {
  try {
    const { voucher_code } = req.body;
    if (!voucher_code) return res.status(400).json({ error: "Voucher code required" });

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // 1. Verify merchant
    const { data: merchant } = await supabase
      .from("merchants")
      .select("id")
      .eq("user_id", req.user.id)
      .single();

    if (!merchant) return res.status(403).json({ error: "Only merchants can redeem vouchers" });

    // 2. Find voucher
    const { data: voucher, error: voucherError } = await supabase
      .from("vouchers")
      .select("*, deals ( merchant_id )")
      .eq("voucher_code", voucher_code)
      .single();

    if (voucherError || !voucher) {
      return res.status(404).json({ error: "Invalid voucher code" });
    }

    // 3. Verify ownership
    // @ts-ignore (deals is joined)
    if (voucher.deals.merchant_id !== merchant.id) {
      return res.status(403).json({ error: "This voucher is for a different merchant" });
    }

    if (voucher.status === "REDEEMED") {
      return res.status(400).json({ error: "Voucher has already been redeemed" });
    }

    // 4. Update status
    const { data: updated, error: updateError } = await supabase
      .from("vouchers")
      .update({ status: "REDEEMED", redeemed_at: new Date().toISOString() })
      .eq("id", voucher.id)
      .select(`
        *,
        deals (
          title,
          images
        )
      `)
      .single();

    if (updateError) throw updateError;

    // 5. Trigger Redemption Email to User
    try {
        const { data: user } = await supabase
            .from("users")
            .select("name, email")
            .eq("id", updated.user_id)
            .single();
        
        if (user) {
            await sendCouponRedeemed(user.email, user.name, updated.deals.title);
        }
    } catch (emailErr) {
        console.error("Voucher redemption email failed:", emailErr);
    }

    res.json({ message: "Voucher successfully redeemed", voucher: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Merchant sees vouchers redeemed for them
router.get("/merchant/redemptions", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data: merchant } = await supabase
      .from("merchants")
      .select("id")
      .eq("user_id", req.user.id)
      .single();

    if (!merchant) return res.status(403).json({ error: "Access denied" });

    const { data, error } = await supabase
      .from("vouchers")
      .select(`
        *,
        deals!inner (
          title,
          merchant_id
        )
      `)
      .eq("deals.merchant_id", merchant.id)
      .eq("status", "REDEEMED")
      .order("redeemed_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
