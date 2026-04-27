import { Router } from "express";
import { getSupabaseAdmin } from "../supabase";
import { requireAuth } from "../middleware/auth";
import { sendMerchantApplicationReceived } from "../utils/email";

const router = Router();

// Get all verified merchants (Public)
router.get("/public", async (_req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("merchants")
      .select("id, business_name, city, logo_url, banner_url, category")
      .eq("status", "Active")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get a public merchant profile by ID
router.get("/public/:id", async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { id } = req.params;
    let query = supabase.from("merchants").select("*");
    
    // Check if ID is a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    if (isUUID) {
      query = query.eq("id", id);
    } else {
      // Treat as business name slug (convert rsvp-lagos to RSVP Lagos-ish)
      // For now, exact match on business_name or ilike
      query = query.ilike("business_name", id.replace(/-/g, " "));
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Merchant not found" });
      }
      throw error;
    }

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

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

// GET merchant customers (unique users who redeemed vouchers)
router.get("/my-customers", requireAuth, async (req, res) => {
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
        user_id,
        users (name, email),
        redeemed_at,
        deals!inner (title, discount_price, merchant_id)
      `)
      .eq("deals.merchant_id", merchant.id)
      .eq("status", "REDEEMED")
      .order("redeemed_at", { ascending: false });

    if (error) throw error;

    // Group by user and calculate metrics
    const customerMap = new Map();
    data.forEach((voucher: any) => {
      const userId = voucher.user_id;
      if (!customerMap.has(userId)) {
        customerMap.set(userId, {
          id: `CUST-${userId.slice(-6).toUpperCase()}`,
          name: voucher.users?.name || "Anonymous",
          email: voucher.users?.email || "",
          visits: 0,
          spent: 0,
          lastVisit: voucher.redeemed_at,
          status: "Member"
        });
      }
      const customer = customerMap.get(userId);
      customer.visits += 1;
      customer.spent += voucher.deals?.discount_price || 0;
      if (new Date(voucher.redeemed_at) > new Date(customer.lastVisit)) {
        customer.lastVisit = voucher.redeemed_at;
      }
    });

    // Format for frontend
    const customers = Array.from(customerMap.values()).map(customer => ({
      ...customer,
      spent: `₦${customer.spent.toLocaleString()}`,
      lastVisit: new Date(customer.lastVisit).toLocaleString(),
      status: customer.visits >= 10 ? "Platinum" : customer.visits >= 5 ? "Gold Member" : "Member"
    }));

    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET merchant reviews
router.get("/my-reviews", requireAuth, async (req, res) => {
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
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        reply,
        created_at,
        updated_at,
        users (name),
        deals (title)
      `)
      .eq("merchant_id", merchant.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const mapped = data.map((review: any) => ({
      id: review.id,
      customerName: review.users?.name || "Anonymous",
      dealTitle: review.deals?.title || "Unknown Deal",
      rating: review.rating,
      comment: review.comment,
      reply: review.reply,
      createdAt: review.created_at,
      updatedAt: review.updated_at
    }));

    res.json(mapped);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET merchant notifications
router.get("/notifications", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data: merchant } = await supabase
      .from("merchants")
      .select("id, business_name")
      .eq("user_id", req.user.id)
      .single();

    if (!merchant) return res.status(403).json({ error: "Merchant profile required" });

    // Get recent redemptions (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: recentRedemptions } = await supabase
      .from("vouchers")
      .select(`
        id,
        voucher_code,
        redeemed_at,
        deals!inner (title, discount_price)
      `)
      .eq("deals.merchant_id", merchant.id)
      .eq("status", "REDEEMED")
      .gte("redeemed_at", yesterday.toISOString())
      .order("redeemed_at", { ascending: false })
      .limit(10);

    // Get low inventory deals (less than 20% remaining)
    const { data: deals } = await supabase
      .from("deals")
      .select("id, title, total_quantity, sold_quantity")
      .eq("merchant_id", merchant.id)
      .eq("is_active", true);

    const lowInventoryDeals = (deals || []).filter(d => {
      const remaining = d.total_quantity - d.sold_quantity;
      const percentage = (remaining / d.total_quantity) * 100;
      return percentage < 20 && remaining > 0;
    });

    // Get recent reviews (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: recentReviews } = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, users(name)")
      .eq("merchant_id", merchant.id)
      .gte("created_at", weekAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(5);

    // Get expiring deals (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const { data: expiringDeals } = await supabase
      .from("deals")
      .select("id, title, expiry_date")
      .eq("merchant_id", merchant.id)
      .eq("is_active", true)
      .lte("expiry_date", nextWeek.toISOString())
      .gte("expiry_date", new Date().toISOString())
      .order("expiry_date", { ascending: true });

    // Build notifications array
    const notifications: any[] = [];

    // Recent redemptions
    if (recentRedemptions) {
      recentRedemptions.forEach((redemption: any) => {
        notifications.push({
          id: `redemption-${redemption.id}`,
          type: "redemption",
          title: "New Redemption",
          message: `Voucher ${redemption.voucher_code} redeemed for ${redemption.deals?.title || 'deal'}`,
          timestamp: redemption.redeemed_at,
          priority: "normal"
        });
      });
    }

    // Low inventory alerts
    lowInventoryDeals.forEach(deal => {
      const remaining = deal.total_quantity - deal.sold_quantity;
      notifications.push({
        id: `low-inventory-${deal.id}`,
        type: "inventory",
        title: "Low Inventory Alert",
        message: `Only ${remaining} units remaining for "${deal.title}"`,
        timestamp: new Date().toISOString(),
        priority: "high"
      });
    });

    // Recent reviews
    if (recentReviews) {
      recentReviews.forEach((review: any) => {
        notifications.push({
          id: `review-${review.id}`,
          type: "review",
          title: "New Review",
          message: `${review.users?.name || "A customer"} left a ${review.rating}-star review`,
          timestamp: review.created_at,
          priority: "normal"
        });
      });
    }

    // Expiring deals
    if (expiringDeals) {
      expiringDeals.forEach(deal => {
        const daysUntilExpiry = Math.ceil((new Date(deal.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        notifications.push({
          id: `expiring-${deal.id}`,
          type: "expiry",
          title: "Deal Expiring Soon",
          message: `"${deal.title}" expires in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}`,
          timestamp: new Date().toISOString(),
          priority: "high"
        });
      });
    }

    // Sort by timestamp (most recent first)
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mark a notification as read
router.post("/notifications/:id/read", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // If it's a real DB notification (UUID-like), update it
    if (id.length > 20) {
        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", id)
            .eq("user_id", req.user.id);
        
        if (error) throw error;
    }
    
    res.json({ message: "Notification marked as read" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get merchant analytics data
router.get("/analytics", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data: merchant, error: merchantError } = await supabase
      .from("merchants")
      .select("id")
      .eq("user_id", req.user.id)
      .single();

    if (merchantError || !merchant) return res.status(403).json({ error: "Merchant profile required" });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: vouchers, error } = await supabase
      .from("vouchers")
      .select(`
        redeemed_at,
        user_id,
        deals!inner (discount_price, merchant_id)
      `)
      .eq("deals.merchant_id", merchant.id)
      .eq("status", "REDEEMED")
      .gte("redeemed_at", sevenDaysAgo.toISOString())
      .order("redeemed_at", { ascending: true });

    if (error) throw error;

    const dailyData: Record<string, { revenue: number; reach: number }> = {};
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const label = days[date.getDay()];
      dailyData[label] = { revenue: 0, reach: 0 };
    }

    const uniqueUsers = new Set<string>();
    vouchers.forEach((voucher: any) => {
      const redeemedAt = voucher.redeemed_at ? new Date(voucher.redeemed_at) : null;
      if (!redeemedAt) return;
      const label = days[redeemedAt.getDay()];
      dailyData[label].revenue += voucher.deals?.discount_price || 0;
      dailyData[label].reach += 1;
      if (voucher.user_id) uniqueUsers.add(voucher.user_id);
    });

    res.json({
      analyticsData: Object.entries(dailyData).map(([name, metrics]) => ({
        name,
        revenue: metrics.revenue,
        reach: metrics.reach
      })),
      activeUsers: uniqueUsers.size
    });
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

    // --- DUPLICATE PREVENTION (Parallelized) ---
    // Run all duplicate checks in parallel instead of sequentially
    const [existingAppResult, existingRCResult] = await Promise.all([
      supabase
        .from("merchant_applications")
        .select("id, email, phone, status")
        .or(`email.eq.${email},phone.eq.${phone}`)
        .neq('status', 'REJECTED')
        .limit(1),
      supabase
        .from("merchant_applications")
        .select("id")
        .contains("metadata", { rc_number })
        .neq('status', 'REJECTED')
        .limit(1)
    ]);

    const { data: existingApp } = existingAppResult;
    const { data: existingRC } = existingRCResult;

    if (existingApp && existingApp.length > 0) {
      const match = existingApp[0];
      const field = match.email === email ? "email" : "phone number";
      return res.status(409).json({ error: `An application with this ${field} has already been submitted.` });
    }

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

    // 3. Send confirmation email to Merchant (Non-blocking)
    sendMerchantApplicationReceived(email, contact_name).catch(e => console.error("BG Email Error:", e));
    
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
