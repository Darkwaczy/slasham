import { Router } from "express";
import { getSupabaseAdmin } from "../supabase";
import { requireAuth } from "../middleware/auth";
import { sendOnboardingEmail } from "../utils/email";

const router = Router();

// Middleware to ensure user is admin
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied. Admin only." });
  }
  next();
};

router.get("/stats", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // Parallel counts
    const [users, merchants, deals, vouchers] = await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("merchants").select("id", { count: "exact", head: true }),
      supabase.from("deals").select("id", { count: "exact", head: true }),
      supabase.from("vouchers").select("id", { count: "exact", head: true })
    ]);

    res.json({
      total_users: users.count || 0,
      total_merchants: merchants.count || 0,
      total_deals: deals.count || 0,
      total_vouchers: vouchers.count || 0,
      total_revenue_m: ((vouchers.count || 0) * 0.0005).toFixed(2) // Mock revenue logic: 500 per voucher
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin views all merchants
router.get("/merchants", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("merchants")
      .select(`
        *,
        users ( email, name )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin verifies merchant
router.post("/merchants/:id/verify", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("merchants")
      .update({ is_verified })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin views all campaign requests
router.get("/requests", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("campaign_requests")
      .select(`
        *,
        merchants ( business_name )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin approves/rejects request
router.post("/requests/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("campaign_requests")
      .update({ status, admin_notes })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Billboard Management
router.get("/billboards", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");
    const { data, error } = await supabase.from("billboards").select("*").order("id", { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/billboards", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, subtitle, description, promo_code, bg_class, image_url, id } = req.body;
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");
    
    let result;
    if (id) {
       const { data, error } = await supabase.from("billboards").update({ title, subtitle, description, promo_code, bg_class, image_url, updated_at: new Date() }).eq("id", id).select().single();
       if (error) throw error;
       result = data;
    } else {
       const { data, error } = await supabase.from("billboards").insert({ title, subtitle, description, promo_code, bg_class, image_url }).select().single();
       if (error) throw error;
       result = data;
    }
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// User Management
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/users/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g., 'Active', 'Suspended'

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("users")
      .update({ role: status === "Suspended" ? "SUSPENDED" : "USER" }) // Mapping simplified for demo
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/users/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const supabase = getSupabaseAdmin();
      if (!supabase) throw new Error("DB not configured");
  
      const { error } = await supabase.from("users").delete().eq("id", id);
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});

// Merchant Applications Management
router.get("/applications", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("merchant_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/applications/:id/approve", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // 1. Get application details
    const { data: app, error: appError } = await supabase
      .from("merchant_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (appError || !app) throw new Error("Application not found");

    // 2. Create User account (Supabase Auth)
    // For demo/onboarding flow, we use a temp password
    const tempPassword = "Slasham" + Math.floor(1000 + Math.random() * 9000);
    
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: app.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { name: app.contact_name, role: 'MERCHANT' }
    });

    if (authError) throw authError;

    // 3. Create Merchant Profile
    const { error: merchantError } = await supabase
      .from("merchants")
      .insert({
        user_id: authUser.user.id,
        business_name: app.business_name,
        description: app.description,
        address: app.address,
        city: app.city,
        is_verified: true
      });

    if (merchantError) throw merchantError;

    // 4. Update Application Status
    await supabase.from("merchant_applications").update({ status: "APPROVED" }).eq("id", id);

    // 5. Trigger Resend Onboarding Email
    try {
        await sendOnboardingEmail(app.email, app.contact_name, tempPassword);
    } catch (emailErr) {
        console.error("Failed to send onboarding email, but account was created:", emailErr);
    }

    res.json({ message: "Merchant approved and account created. Credentials sent via email." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/applications/:id/reject", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { error } = await supabase
      .from("merchant_applications")
      .update({ status: "REJECTED" })
      .eq("id", id);

    if (error) throw error;
    res.json({ message: "Application rejected" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reports/disputes
router.get("/reports", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("reports")
      .select(`
        *,
        users (name, email),
        merchants (business_name)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update report status
router.patch("/reports/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;
    
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("reports")
      .update({ status, admin_notes })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
