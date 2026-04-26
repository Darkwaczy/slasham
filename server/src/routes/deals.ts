import { Router } from "express";
import { getSupabaseAdmin } from "../supabase";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Get public active deals (Feed)
router.get("/", async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { category, search } = req.query;

    let query = supabase
      .from("deals")
      .select(`
        *,
        merchants (
          business_name,
          city,
          logo_url
        )
      `)
      .eq("is_active", true)
      .gt("expiry_date", new Date().toISOString());

    if (category && category !== "All") {
      query = query.eq("category", category);
    }
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single deal
router.get("/:id", async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("deals")
      .select(`
        *,
        merchants (
          business_name,
          city,
          logo_url,
          address
        )
      `)
      .eq("id", req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Deal not found" });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new deal (Merchant only)
router.post("/", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const isAdmin = req.user.role === "ADMIN";
    let merchantId = req.body.merchant_id;

    if (!isAdmin || !merchantId) {
        // Ensure user is a merchant if not admin or no merchant_id provided
        const { data: merchant, error: merchantError } = await supabase
        .from("merchants")
        .select("id")
        .eq("user_id", req.user.id)
        .single();

        if (merchantError || !merchant) {
            return res.status(403).json({ error: "You must be a registered merchant to create deals" });
        }
        merchantId = merchant.id;
    }

    const {
      title,
      description,
      deal_explanation,
      category,
      original_price,
      discount_price,
      total_quantity,
      validity_days,
      expiry_date,
      images,
      is_hot,
    } = req.body;

    const { data, error } = await supabase
      .from("deals")
      .insert({
        merchant_id: merchantId,
        title,
        description,
        deal_explanation,
        category,
        original_price,
        discount_price,
        total_quantity,
        validity_days,
        expiry_date,
        is_hot: is_hot || false,
        images: images || [],
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: "Deal created", deal: data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get deals for a specific merchant
router.get("/merchant/my-deals", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data: merchant } = await supabase
      .from("merchants")
      .select("id")
      .eq("user_id", req.user.id)
      .single();

    if (!merchant) {
      return res.json([]); // No merchant profile yet
    }

    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .eq("merchant_id", merchant.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin deletes a deal
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // Only Admin or the Merchant owner can delete
    const { data: deal } = await supabase.from("deals").select("merchant_id").eq("id", req.params.id).single();
    if (!deal) return res.status(404).json({ error: "Deal not found" });

    const isAdmin = req.user.role === "ADMIN";
    
    if (!isAdmin) {
        const { data: merchant } = await supabase.from("merchants").select("id").eq("user_id", req.user.id).single();
        if (!merchant || merchant.id !== deal.merchant_id) {
            return res.status(403).json({ error: "Unauthorized deletion" });
        }
    }

    const { error } = await supabase.from("deals").delete().eq("id", req.params.id);
    if (error) throw error;

    res.json({ message: "Deal deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
