import { Router } from "express";
import { getSupabaseAdmin } from "../supabase";
import { requireAuth } from "../middleware/auth";
import { sendAdminDisputeAlert, sendMerchantReviewAlert } from "../utils/email";

const router = Router();

// GET all reviews for the current user
router.get("/reviews", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return res.status(500).json({ error: "DB not configured" });

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`
        *,
        merchants (business_name)
      `)
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET user stats (points, savings, etc)
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return res.status(500).json({ error: "DB not configured" });

    // In a real app, these would be aggregated from transactions/points tables
    let userData = { points: 0, total_savings: 0 };
    try {
      const { data, error } = await supabase
        .from("users")
        .select("points, total_savings")
        .eq("id", req.user.id)
        .single();
      
      if (!error && data) {
        userData = data;
      }
    } catch (err) {
      console.warn("Failed to fetch points/savings from DB, falling back to 0:", (err as any).message);
    }

    res.json({
        points: userData.points || 0,
        total_savings: userData.total_savings || 0,
        history: [], // Placeholder for points history
        referrals: [] // Placeholder for referrals
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user/transactions
router.get("/transactions", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        deals(title, merchants(business_name, address, city, phone)),
        vouchers(voucher_code)
      `)
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const transactions = (data || []).map((p: any) => ({
      id: p.id,
      type: "Coupon Purchase",
      merchant: p.deals?.merchants?.business_name || "Unknown",
      merchant_details: {
        address: p.deals?.merchants?.address,
        city: p.deals?.merchants?.city,
        phone: p.deals?.merchants?.phone,
      },
      deal_title: p.deals?.title,
      amount: `₦${Number(p.amount).toLocaleString()}`,
      method: "Paystack",
      status: p.status === "success" ? "Successful" :
              p.status === "pending" ? "Pending" : "Failed",
      date: new Date(p.created_at).toLocaleDateString("en-NG", {
        day: "numeric", month: "short", year: "numeric"
      }),
      voucher_code: p.vouchers?.[0]?.voucher_code || "—",
    }));

    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// User submits a review
router.post("/reviews", requireAuth, async (req, res) => {
  try {
    const { deal_id, merchant_id, rating, comment } = req.body;
    if (!deal_id || !merchant_id || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const insertData: any = {
        user_id: req.user.id,
        deal_id,
        merchant_id,
        rating,
        comment
    };

    if (req.body.media) {
        insertData.media = req.body.media;
    }

    let { data: review, error } = await supabase
      .from("reviews")
      .insert(insertData)
      .select()
      .single();

    // Fail-safe: if media column is missing in DB, retry without it
    if (error && error.message.includes('media')) {
        console.warn("Review media column missing in DB, falling back to text-only review.");
        delete insertData.media;
        const retry = await supabase
          .from("reviews")
          .insert(insertData)
          .select()
          .single();
        review = retry.data;
        error = retry.error;
    }

    if (error) throw error;

    // Trigger Merchant Alert Email
    try {
        const { data: merchant } = await supabase
            .from("merchants")
            .select("business_name, users(email)")
            .eq("id", merchant_id)
            .single();
        
        // @ts-ignore
        const merchantEmail = merchant?.users?.email;
        if (merchantEmail) {
            sendMerchantReviewAlert(merchantEmail, merchant.business_name, rating, comment || "No comment provided").catch(e => console.error("BG Email Error:", e));
        }
    } catch (emailErr) {
        console.error("Merchant review alert failed to send:", emailErr);
    }

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// User submits a dispute/report
router.post("/report", requireAuth, async (req, res) => {
  try {
    const { voucher_id, merchant_id, reason, description, priority } = req.body;
    if (!reason) return res.status(400).json({ error: "Reason is required" });

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data: report, error } = await supabase
      .from("reports")
      .insert({
        user_id: req.user.id,
        voucher_id,
        merchant_id,
        reason,
        description,
        priority: priority || 'Normal',
        status: "PENDING"
      })
      .select()
      .single();

    if (error) throw error;

    // Trigger Admin Alert Email
    try {
        const { data: user } = await supabase.from("users").select("email").eq("id", req.user.id).single();
        sendAdminDisputeAlert("User Dispute", reason || "No detail provided", user?.email || "Unknown User").catch(e => console.error("BG Email Error:", e));
    } catch (emailErr) {
        console.error("Admin dispute alert failed to send:", emailErr);
    }

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET all notifications for the current user
router.get("/notifications", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return res.status(500).json({ error: "DB not configured" });

    // 1. Fetch real notifications from DB (if any)
    const { data: dbNotifications } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    // 2. Generate "Smart" notifications based on user state
    const smartNotifications = [];

    // Welcome Notification
    smartNotifications.push({
      id: "welcome-msg",
      title: "Welcome to Slasham!",
      message: "Start exploring exclusive deals and start saving today.",
      type: "INFO",
      created_at: req.user.created_at,
      is_read: true
    });

    // Verification Notification
    if (req.user.email_confirmed_at) {
        smartNotifications.push({
            id: "verify-success",
            title: "Account Verified",
            message: "Your account is fully verified. You can now claim any deal!",
            type: "SUCCESS",
            created_at: req.user.email_confirmed_at,
            is_read: true
        });
    }

    // City-based prompt
    const userCity = req.user.user_metadata?.city || "your area";
    smartNotifications.push({
        id: "city-deals",
        title: `Deals in ${userCity}`,
        message: `New exclusive offers just landed in ${userCity}. Don't miss out!`,
        type: "PROMO",
        created_at: new Date().toISOString(),
        is_read: false
    });

    const allNotifications = [...(dbNotifications || []), ...smartNotifications];
    
    // Sort by newest first
    allNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json(allNotifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mark a user notification as read
router.post("/notifications/:id/read", requireAuth, async (req, res) => {
    try {
        const supabase = getSupabaseAdmin();
        if (!supabase) return res.status(500).json({ error: "DB not configured" });

        const { id } = req.params;
        
        // If it's a DB notification, update it
        if (id.length > 20) { 
            await supabase
                .from("notifications")
                .update({ is_read: true })
                .eq("id", id)
                .eq("user_id", req.user.id);
        }

        res.json({ success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
