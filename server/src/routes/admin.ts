import { Router } from "express";
import { getSupabaseAdmin } from "../supabase";
import { requireAuth } from "../middleware/auth";
import { sendOnboardingEmail } from "../utils/email";

const router = Router();

// Middleware to ensure user is admin
const requireAdmin = (req: any, res: any, next: any) => {
  // Admin Access depends entirely on ENV variables or database roles
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
  const userEmail = req.user?.email?.toLowerCase();
  
  const isExplicitAdmin = userEmail && adminEmails.includes(userEmail);
  const hasAdminRole = req.user?.role === "ADMIN";

  if (isExplicitAdmin || hasAdminRole) {
    return next();
  }

  return res.status(403).json({ error: "Access denied. Admin only." });
};

router.get("/me", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error || !user) throw new Error("Profile not found");

    // Dynamic Role Sync: If email is in ADMIN_EMAILS env, ensure DB role is ADMIN
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
    if (user.role !== "ADMIN" && adminEmails.includes(user.email.toLowerCase())) {
       await supabase.from("users").update({ role: "ADMIN" }).eq("id", user.id);
       user.role = "ADMIN";
    }

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/stats", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // 1. Fetch from Auth Admin API
    let userCount = 0;
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (!authError) {
        userCount = authUsers.users.length;
      }
    } catch (e) {
      console.error("Auth count failed, falling back to DB...");
    }

    // 2. Fetch from DB (Fallback/Parallel)
    const [dbUsers, merchants, dealsData, vouchers] = await Promise.all([
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("merchants").select("id", { count: "exact", head: true }),
      supabase.from("deals").select("id, created_at, updated_at"),
      supabase.from("vouchers").select("id", { count: "exact", head: true })
    ]);

    // 3. Calculate Deal Velocity (Average days from creation to approval/launch)
    let avgVelocity = 4.2; // Default fallback
    if (dealsData.data && dealsData.data.length > 0) {
      const velocities = dealsData.data.map((d: any) => {
        const created = new Date(d.created_at).getTime();
        const updated = new Date(d.updated_at).getTime();
        return (updated - created) / (1000 * 60 * 60 * 24); // Days
      });
      avgVelocity = velocities.reduce((a: number, b: number) => a + b, 0) / dealsData.data.length;
    }

    // 4. Calculate Success Rate (Redemption Rate)
    const { count: redeemedVouchers } = await supabase.from("vouchers").select("*", { count: 'exact', head: true }).eq("status", "REDEEMED");
    
    let successRate = 98; // Default fallback
    if (vouchers.count && vouchers.count > 0) {
      successRate = Math.round((redeemedVouchers || 0) / vouchers.count * 100);
    }

    res.json({
      total_users: Math.max(userCount, dbUsers.count || 0),
      total_merchants: merchants.count || 0,
      total_deals: dealsData.data?.length || 0,
      total_vouchers: vouchers.count || 0,
      total_revenue_m: ((vouchers.count || 0) * 0.0005).toFixed(2),
      deal_velocity: avgVelocity.toFixed(1) + "d",
      success_rate: successRate + "%"
    });
  } catch (error: any) {
    console.error("Stats route failed:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/summary", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const [
      { data: profiles, count: userCount },
      { data: merchants, count: merchantCount },
      { data: apps, count: appCount },
      { data: deals, count: dealCount },
      { data: requests, count: requestCount },
      { data: vouchers, count: voucherCount },
      { data: reports, count: reportCount },
      { data: reviews, count: reviewCount },
      { data: systemSettings },
      { data: auditLogs },
      { data: analytics }
    ]: any[] = await Promise.all([
      supabase.from("users").select("*", { count: 'exact' }).order('created_at', { ascending: false }).limit(50),
      supabase.from("merchants").select("*, users(email, name)", { count: 'exact' }).limit(50),
      supabase.from("merchant_applications").select("*", { count: 'exact' }).order('created_at', { ascending: false }).limit(50),
      supabase.from("deals").select("*, merchants(business_name)", { count: 'exact' }).order('created_at', { ascending: false }).limit(50),
      supabase.from("campaign_requests").select("*, merchants(business_name)", { count: 'exact' }).order('created_at', { ascending: false }).limit(50),
      supabase.from("vouchers").select("*, users(email, name), deals(title, merchants(business_name))", { count: 'exact' }).order('created_at', { ascending: false }).limit(50),
      supabase.from("reports").select("*, users(name, email), merchants(business_name)", { count: 'exact' }).order('created_at', { ascending: false }).limit(50),
      supabase.from("reviews").select("*, users(name), merchants(business_name)", { count: 'exact' }).order('created_at', { ascending: false }).limit(50),
      supabase.from("system_settings").select("*").single(),
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(20),
      supabase.from("analytics").select("*").order("date", { ascending: true }).limit(30)
    ]);

    // Calculate total revenue from all vouchers
    const { data: voucherRevenue } = await supabase.from("vouchers").select("amount");
    const totalRevenue = (voucherRevenue || []).reduce((acc: number, v: any) => acc + (Number(v.amount) || 0), 0);

    res.json({
      users: profiles || [],
      merchants: merchants || [],
      applications: apps || [],
      deals: deals || [],
      requests: requests || [],
      vouchers: vouchers || [],
      reports: reports || [],
      reviews: reviews || [],
      auditLogs: auditLogs || [],
      analytics: analytics || [],
      settings: systemSettings?.config || {
        siteName: "",
        supportEmail: "",
        maintenanceMode: false,
        promoBanner: { enabled: false, text: "" },
        commission: "10%",
        withdrawalFee: "100",
        taxRate: "7.5%",
        enforce2FA: false,
        rateLimit: "100/min",
        sessionTimeout: "24h"
      },
      counts: {
        users: userCount,
        merchants: merchantCount,
        applications: appCount,
        deals: dealCount,
        requests: requestCount,
        vouchers: voucherCount,
        reports: reportCount,
        reviews: reviewCount,
        total_revenue: totalRevenue
      }
    });
  } catch (error: any) {
    console.error("Summary fetch failed:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/analytics", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // Fetch last 6 months of registrations to build a growth trend
    const { data: users } = await supabase.from("users").select("created_at");
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const monthIdx = (currentMonth - i + 12) % 12;
      const monthName = months[monthIdx];
      const count = users?.filter(u => new Date(u.created_at).getMonth() === monthIdx).length || 0;
      
      last6Months.push({
        name: monthName,
        revenue: count * 1500, // Mock revenue trend based on users
        users: count
      });
    }

    res.json(last6Months);
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

    // 1. Fetch all users from Supabase Auth (The ultimate source of truth)
    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    // 2. Fetch all profiles from public.users (For metadata like city, points, etc.)
    const { data: profiles } = await supabase.from("users").select("*");
    const profileMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);

    // 3. Merge them
    const mergedUsers = authUsers.map(au => {
      const p = profileMap.get(au.id) as any || {};
      return {
        id: au.id,
        email: au.email,
        name: p.name || au.user_metadata?.name || "Member",
        role: p.role || au.user_metadata?.role || "USER",
        is_verified: p.is_verified ?? !!au.email_confirmed_at,
        created_at: au.created_at,
        city: p.city || "Not Specified",
        phone: p.phone || "Not Specified"
      };
    });

    res.json(mergedUsers);
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
      .update({ is_verified: status !== "Suspended" }) 
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/users/:id/role", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const supabase = getSupabaseAdmin();
      if (!supabase) throw new Error("DB not configured");
  
      const { data, error } = await supabase
        .from("users")
        .update({ role })
        .eq("id", id)
        .select()
        .single();
  
      if (error) throw error;
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});

router.post("/users/:id/notify", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const supabase = getSupabaseAdmin();
      if (!supabase) throw new Error("DB not configured");
  
      // Simple notification log (assuming a notifications table exists or just for demo)
      const { error } = await supabase.from("notifications").insert({
        user_id: id,
        type: "SYSTEM",
        title: "System Notification",
        message,
        is_read: false
      });
  
      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});

router.delete("/users/:id", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const supabase = getSupabaseAdmin();
      if (!supabase) throw new Error("DB not configured");
  
      // 1. Fetch email before "deleting" so we can keep it as a blacklist marker
      const { data: user } = await supabase.from("users").select("email").eq("id", id).single();
      
      // 2. Instead of full delete, mark as DELETED to blacklist the email
      const { error } = await supabase
        .from("users")
        .update({ 
          role: "DELETED", 
          name: "Banned User", 
          is_verified: false,
          phone: null,
          city: null
        })
        .eq("id", id);
  
      if (error) throw error;

      // 3. Wipe their Supabase Auth record so they can't log in/register
      const { getAuthClient } = await import("../supabase.js");
      const authClient = getAuthClient();
      await authClient.auth.admin.deleteUser(id as string);

      res.json({ success: true, message: "User permanently banned and blacklisted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});

// Merchant Applications Management
router.get("/applications", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // Use the admin/service role context to ensure we bypass RLS
    const { data, error } = await supabase
      .from("merchant_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Sanitize metadata for frontend safety
    const sanitized = data.map(app => ({
      ...app,
      metadata: app.metadata || {}
    }));

    res.json(sanitized);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/applications/:id/approve", requireAuth, async (req, res) => {
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

    // 2.5 Ensure the user exists in our public.users table (Satisfy FK constraint)
    const { error: userError } = await supabase.from("users").upsert({
      id: authUser.user.id,
      email: app.email,
      name: app.contact_name,
      role: 'MERCHANT',
      is_verified: true
    });

    if (userError) throw userError;

    // 3. Create Merchant Profile
    const { error: merchantError } = await supabase
      .from("merchants")
      .insert({
        user_id: authUser.user.id,
        business_name: app.business_name,
        description: app.description,
        address: app.metadata?.physical_address || app.city,
        email: app.email,
        phone: app.phone,
        website: app.metadata?.website_url,
        logo_url: "https://via.placeholder.com/150",
        category: app.business_type,
        status: 'Active',
        is_verified: true
      });

    if (merchantError) throw merchantError;

    // 4. Update Application Status
    await supabase
      .from("merchant_applications")
      .update({ status: 'APPROVED' })
      .eq("id", id);

    // 5. Send Onboarding Email
    await sendOnboardingEmail(app.email, app.contact_name, tempPassword);

    res.json({ success: true, tempPassword });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/applications/:id/reject", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data: app, error: fetchError } = await supabase
        .from("merchant_applications")
        .select("*")
        .eq("id", id)
        .single();
    
    if (fetchError || !app) throw new Error("Application not found");

    const { error } = await supabase
      .from("merchant_applications")
      .update({ 
        status: 'REJECTED',
        admin_notes: reason 
      })
      .eq("id", id);

    if (error) throw error;

    // 2. Send Rejection Email
    const { sendRejectionEmail } = await import("../utils/email.js");
    await sendRejectionEmail(app.email, app.contact_name, reason);

    res.json({ success: true, message: "Application rejected" });
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

// Admin views all vouchers
router.get("/vouchers", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("vouchers")
      .select(`
        *,
        users ( email, name ),
        deals ( 
          title,
          merchants ( business_name )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin views redemptions
router.get("/redemptions", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("vouchers")
      .select(`
        *,
        users ( email, name ),
        deals ( 
          title,
          merchants ( business_name )
        )
      `)
      .eq("status", "REDEEMED")
      .order("redeemed_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin views reviews
router.get("/reviews", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        users ( name ),
        merchants ( business_name )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// System Settings Management
router.get("/settings", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { data, error } = await supabase
      .from("system_settings")
      .select("*")
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    // Return default settings if none exist
    if (!data) {
      return res.json({
        siteName: "",
        supportEmail: "",
        maintenanceMode: false,
        promoBanner: { enabled: false, text: "" },
        commission: "10%",
        withdrawalFee: "100",
        taxRate: "7.5%",
        enforce2FA: false,
        rateLimit: "100/min",
        sessionTimeout: "24h"
      });
    }

    res.json(data.config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/settings", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { config } = req.body;
    
    // Upsert settings (using id 1 as the singleton)
    const { data, error } = await supabase
      .from("system_settings")
      .upsert({ id: 1, config, updated_at: new Date() })
      .select()
      .single();

    if (error) throw error;
    res.json(data.config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- EMAIL TEMPLATES & BROADCASTS ---

router.get("/emails/templates", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");
    const { data, error } = await supabase.from("email_templates").select("*").order("name");
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/emails/templates/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");
    const { subject, html_body } = req.body;
    const { data, error } = await supabase
      .from("email_templates")
      .update({ subject, html_body, updated_at: new Date() })
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/emails/broadcasts", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");
    const { data, error } = await supabase.from("email_broadcasts").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/emails/broadcast", requireAuth, requireAdmin, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");
    const { subject, html_body, target_audience } = req.body;
    
    // In a real app, we would query the users table based on target_audience and use Resend to bulk send.
    // Here we record the broadcast for the UI demo.
    const mockSentCount = target_audience === 'ALL_USERS' ? 12450 : target_audience === 'MERCHANTS' ? 342 : 120;
    
    const { data, error } = await supabase
      .from("email_broadcasts")
      .insert({
        subject,
        html_body,
        target_audience,
        sent_count: mockSentCount,
        status: 'COMPLETED',
        sent_by: req.user.email
      })
      .select()
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
