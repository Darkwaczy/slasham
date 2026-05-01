import { Router } from "express";
import { getSupabaseAdmin } from "../supabase";
import { requireAuth } from "../middleware/auth";

const router = Router();

// In-Memory Cache for High-Traffic Routes (30-second TTL)
interface CacheEntry {
  data: any;
  timestamp: number;
}
const apiCache: Record<string, CacheEntry> = {};
const CACHE_TTL = 30 * 1000; // 30 seconds

// Get public active deals (Feed)
router.get("/", async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { category, search, merchant_id } = req.query;

    const cacheKey = `deals_feed_${category || 'all'}_${search || 'none'}_${merchant_id || 'all'}`;
    const cached = apiCache[cacheKey];
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return res.json(cached.data);
    }

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
    if (merchant_id) {
      query = query.eq("merchant_id", merchant_id);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;
    
    // Save to cache
    apiCache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Lightning-fast home page deals (limited, optimized)
router.get("/home", async (_req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const cacheKey = "deals_home_feed";
    const cached = apiCache[cacheKey];
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return res.json(cached.data);
    }

    // Only fetch 12 deals for home page - minimal data needed
    const { data, error } = await supabase
      .from("deals")
      .select(`
        id,
        title,
        discount_price,
        original_price,
        images,
        category,
        expiry_date,
        total_quantity,
        sold_quantity,
        deal_explanation,
        merchants (
          business_name,
          city
        )
      `)
      .eq("is_active", true)
      .gt("expiry_date", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) throw error;
    
    // Save to cache
    apiCache[cacheKey] = {
      data: data || [],
      timestamp: Date.now()
    };

    res.json(data || []);
  } catch (error: any) {
    console.error("Home deals fetch failed:", error);
    res.json([]); // Return empty array on error for instant loading
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
      .eq("id", req.params.id.trim().replace(/\s+/g, '-'))
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Deal not found" });

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get reviews for a specific deal
router.get("/:id/reviews", async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        users(name)
      `)
      .eq("deal_id", req.params.id.trim().replace(/\s+/g, '-'))
      .order("created_at", { ascending: false });

    if (error) throw error;
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

    if (!isAdmin && !merchantId) {
        // Ensure user is a merchant if not admin or no merchant_id provided
        const { data: merchant, error: merchantError } = await supabase
        .from("merchants")
        .select("id")
        .eq("user_id", req.user.id)
        .single();

        if (merchantError && merchantError.code !== "PGRST116") {
            throw merchantError;
        }

        if (!merchant) {
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
      coupon_price,
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
        coupon_price,
        total_quantity,
        validity_days,
        expiry_date,
        is_hot: is_hot || false,
        images: images || [],
        is_active: isAdmin ? true : false, // ✅ Merchants require review, Admin can auto-approve
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
    const { data: deal } = await supabase.from("deals").select("merchant_id, title").eq("id", req.params.id).single();
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

    // Sync with campaign_requests so the merchant sees it as removed/rejected
    await supabase.from("campaign_requests")
      .update({ status: 'REJECTED', admin_notes: isAdmin ? 'Deal was deleted by Admin.' : 'Deal was deleted by Merchant.' })
      .eq("merchant_id", deal.merchant_id)
      .eq("title", deal.title);

    res.json({ message: "Deal deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
