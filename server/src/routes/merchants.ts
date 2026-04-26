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
      website_social, description 
    } = req.body;

    if (!business_name || !email || !contact_name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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
