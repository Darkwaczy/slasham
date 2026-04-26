import { Router } from "express";
import { getSupabaseAdmin } from "../supabase";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Get a merchant profile by user ID
router.get("/my-profile", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("merchants")
      .select("*")
      .eq("user_id", req.user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Merchant profile not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET merchant dashboard stats
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // 1. Get Merchant ID
    const { data: merchant, error: mError } = await supabase
      .from("merchants")
      .select("id")
      .eq("user_id", req.user.id)
      .single();

    if (mError || !merchant) return res.status(403).json({ error: "Merchant profile required" });

    // 2. Fetch Deals to calculate metrics
    const { data: deals, error: dError } = await supabase
      .from("deals")
      .select("id, is_active")
      .eq("merchant_id", merchant.id);

    if (dError) throw dError;

    // 3. Query all vouchers for all deals of this merchant
    const dealIds = deals.map(d => d.id);
    const { data: allVouchers, error: allVError } = await supabase
      .from("vouchers")
      .select("user_id, status, deals(discount_price)")
      .in("deal_id", dealIds.length > 0 ? dealIds : [null]);

    if (allVError) throw allVError;

    const activeDeals = deals.filter(d => d.is_active).length;
    const totalClaims = allVouchers.length;
    const uniqueCustomers = new Set(allVouchers.map(v => v.user_id)).size;
    
    // Revenue is sum of discount_price for REDEEMED vouchers
    const totalRevenue = allVouchers
      .filter(v => v.status === "REDEEMED")
      // @ts-ignore
      .reduce((acc, v) => acc + (v.deals?.discount_price || 0), 0);

    res.json({
      totalRevenue,
      activeDeals,
      uniqueCustomers,
      totalClaims
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET merchant redemption log
router.get("/redemption-log", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data: merchant } = await supabase
      .from("merchants")
      .select("id")
      .eq("user_id", req.user.id)
      .single();

    if (!merchant) return res.status(403).json({ error: "Merchant profile required" });

    const { data, error } = await supabase
      .from("vouchers")
      .select(`
        id,
        voucher_code,
        status,
        redeemed_at,
        created_at,
        users (name),
        deals!inner (title, merchant_id)
      `)
      .eq("deals.merchant_id", merchant.id)
      .eq("status", "REDEEMED")
      .order("redeemed_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    const mapped = (data as any[]).map(v => ({
      id: v.voucher_code,
      customer: v.users?.name || "Anonymous",
      deal: v.deals?.title || "Unknown Deal",
      time: v.redeemed_at ? new Date(v.redeemed_at).toLocaleTimeString() : "N/A",
      status: "Verified"
    }));

    res.json(mapped);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update merchant profile
router.post("/profile", requireAuth, async (req, res) => {
  try {
    const { business_name, description, address, city, logo_url, banner_url } = req.body;
    
    if (!business_name) {
      return res.status(400).json({ error: "Business name is required" });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // Check if profile exists
    const { data: existing } = await supabase
      .from("merchants")
      .select("id")
      .eq("user_id", req.user.id)
      .single();

    let result;

    if (existing) {
      // Update
      const { data, error } = await supabase
        .from("merchants")
        .update({ business_name, description, address, city, logo_url, banner_url })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      // Create
      const { data, error } = await supabase
        .from("merchants")
        .insert({
          user_id: req.user.id,
          business_name,
          description,
          address,
          city,
          logo_url,
          banner_url
        })
        .select()
        .single();
      if (error) throw error;
      result = data;
      
      // Update user role to MERCHANT if not already
      await supabase.from("users").update({ role: "MERCHANT" }).eq("id", req.user.id);
    }

    res.json({ message: "Profile saved successfully", profile: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Merchant submits a campaign request
router.post("/campaign-request", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data: merchant } = await supabase
      .from("merchants")
      .select("id")
      .eq("user_id", req.user.id)
      .single();

    if (!merchant) return res.status(403).json({ error: "Access denied. Merchant profile required." });

    const { 
      product_name, description, original_price, 
      expected_discount, coupon_type, total_quantity, 
      expiry_date, product_image 
    } = req.body;

    const { data, error } = await supabase
      .from("campaign_requests")
      .insert({
        merchant_id: merchant.id,
        product_name,
        description,
        original_price,
        expected_discount,
        coupon_type,
        total_quantity,
        expiry_date,
        product_image
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Campaign request submitted", request: data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Merchant views their own requests
router.get("/my-requests", requireAuth, async (req, res) => {
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
      .from("campaign_requests")
      .select("*")
      .eq("merchant_id", merchant.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Merchant interest application (Public)
router.post("/apply", async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { 
      business_name, business_type, contact_name, 
      email, phone, city, address, 
      website_social, description,
      rc_number, years_in_operation, contact_role,
      instagram_handle, monthly_customers, avg_transaction_value,
      primary_goal, operating_hours
    } = req.body;

    if (!business_name || !email || !contact_name || !rc_number || !phone) {
      return res.status(400).json({ error: "Missing required fields (Business Name, Email, Contact, RC Number, Phone)" });
    }

    // --- DUPLICATE PREVENTION ---
    // 1. Check Email & Phone
    const { data: existingApp, error: checkError } = await supabase
      .from("merchant_applications")
      .select("id, email, phone")
      .or(`email.eq.${email},phone.eq.${phone}`)
      .limit(1);

    if (existingApp && existingApp.length > 0) {
      const match = existingApp[0];
      const field = match.email === email ? "email" : "phone number";
      return res.status(409).json({ error: `An application with this ${field} has already been submitted.` });
    }

    // 2. Check RC Number (in metadata)
    const { data: existingRC } = await supabase
      .from("merchant_applications")
      .select("id")
      .contains("metadata", { rc_number })
      .limit(1);

    if (existingRC && existingRC.length > 0) {
      return res.status(409).json({ error: "This RC Number / Registration ID is already associated with an application." });
    }
    // ----------------------------

    const { data, error } = await supabase
      .from("merchant_applications")
      .insert({
        business_name,
        business_type,
        contact_name,
        email,
        phone,
        city,
        address,
        website_social,
        description,
        // Detailed metrics
        metadata: {
          rc_number,
          years_in_operation,
          contact_role,
          instagram_handle,
          monthly_customers,
          avg_transaction_value,
          primary_goal,
          operating_hours
        },
        status: "PENDING"
      })
      .select()
      .single();

    if (error) throw error;

    // TODO: Send notification email to Admin via Resend
    
    res.status(201).json({ message: "Application submitted successfully", application: data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get merchant's own reviews
router.get("/my-reviews", requireAuth, async (req, res) => {
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
      .from("reviews")
      .select(`
        *,
        users (name, email),
        deals (title)
      `)
      .eq("merchant_id", merchant.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Merchant replies to a review
router.patch("/reviews/:id/reply", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data: merchant } = await supabase
      .from("merchants")
      .select("id")
      .eq("user_id", req.user.id)
      .single();

    if (!merchant) return res.status(403).json({ error: "Access denied" });

    const { data, error } = await supabase
      .from("reviews")
      .update({ reply, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("merchant_id", merchant.id) // Ensure merchant owns this review
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
