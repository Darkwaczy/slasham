import { Router } from "express";
import { randomInt } from "crypto";
import { getAuthClient, getSupabaseAdmin } from "../supabase";
import { createClient } from "@supabase/supabase-js";
import { getEnv } from "../env";
import { requireAuth } from "../middleware/auth";
import { sendUserWelcome, sendFounderWelcome, sendOTP } from "../utils/email";

const router = Router();
const env = getEnv();

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const authClient = getAuthClient();
    const supabase = getSupabaseAdmin();

    if (!supabase) throw new Error("DB not configured");

    // 1. Create Supabase Auth User via Admin API for better control
    const { data: authData, error: authError } = await authClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: role || "USER" }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Failed to create auth user");

    // 2. Generate OTP using cryptographically secure randomInt
    const otpCode = randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

    // 3. Insert into our custom public.users table
    try {
      const { error: dbError } = await supabase.from("users").insert({
        id: authData.user.id,
        email,
        name,
        role: role || "USER",
        otp_code: otpCode,
        otp_expires: otpExpires.toISOString(),
        otp_attempts: 0,
        is_verified: false
      });
      if (dbError) throw dbError;
    } catch (dbErr: any) {
      console.warn("Database insert failed (possibly missing columns), retrying with minimal fields:", dbErr.message);
      // Fallback: Try without the new 'otp_attempts' column
      const { error: fallbackError } = await supabase.from("users").insert({
        id: authData.user.id,
        email,
        name,
        role: role || "USER",
        otp_code: otpCode,
        otp_expires: otpExpires.toISOString(),
        is_verified: false
      });
      if (fallbackError) throw fallbackError;
    }

    // 4. Trigger OTP Email
    try {
      await sendOTP(email, name, otpCode);
    } catch (emailErr) {
      console.error("OTP email failed to send:", emailErr);
    }

    res.status(201).json({ 
      message: "Registration successful. Please verify your email.",
      userId: authData.user.id 
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Registration failed" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Email and code are required" });

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // 1. Fetch user and check OTP
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !user) return res.status(404).json({ error: "User not found" });
    if (user.is_verified) return res.status(400).json({ error: "Email already verified" });

    // Guard: Too many failed attempts
    if ((user.otp_attempts || 0) >= 5) {
      return res.status(429).json({ error: "Too many failed attempts. Please request a new code." });
    }

    if (user.otp_code !== code) {
      try {
        await supabase.from("users").update({ otp_attempts: (user.otp_attempts || 0) + 1 }).eq("id", user.id);
      } catch (e) {
        console.warn("Failed to increment otp_attempts (column likely missing)");
      }
      return res.status(400).json({ error: "Invalid verification code" });
    }

    if (new Date(user.otp_expires) < new Date()) {
      return res.status(400).json({ error: "Verification code expired" });
    }

    // 2. Mark as verified and clear OTP data
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_verified: true, otp_code: null, otp_expires: null, otp_attempts: 0 })
      .eq("id", user.id);

    if (updateError) throw updateError;

    // 3. Trigger Welcome Emails after verification
    try {
      await sendUserWelcome(user.email, user.name);
      await sendFounderWelcome(user.email, user.name);
    } catch (emailErr) {
      console.error("Welcome emails failed to send:", emailErr);
    }

    res.json({ message: "Email verified successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const authClient = getAuthClient();
    const { data, error } = await authClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Securely set the access token as an HTTP-only cookie
    res.cookie("slasham_session", data.session.access_token, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "strict",
      maxAge: data.session.expires_in * 1000,
    });

    // Also fetch the user's role from the public.users table
    const supabaseAdmin = getSupabaseAdmin();
    let role = "USER";
    let is_verified = false;
    if (supabaseAdmin) {
      const { data: userRecord } = await supabaseAdmin
        .from("users")
        .select("role, is_verified")
        .eq("id", data.user.id)
        .single();
      if (userRecord) {
        role = userRecord.role;
        is_verified = userRecord.is_verified;
      }
    }

    // Block unverified users from accessing the platform
    if (!is_verified) {
      return res.status(403).json({
        error: "Please verify your email before logging in.",
        action: "VERIFY_EMAIL"
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email,
        role,
        is_verified
      },
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message || "Invalid credentials" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return res.status(500).json({ error: "DB not configured" });

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, role, is_verified, created_at")
      .eq("id", req.user.id)
      .single();

    if (error || !user) {
      console.warn("User profile not found in public.users, falling back to Auth metadata");
      // Fallback: return basic info from Supabase Auth
      return res.json({
        id: req.user.id,
        email: req.user.email,
        name: req.user.user_metadata?.name || "Member",
        role: req.user.user_metadata?.role || "USER",
        is_verified: !!req.user.email_confirmed_at,
        created_at: req.user.created_at
      });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/me", requireAuth, async (req, res) => {
  try {
    const { name, phone, city } = req.body;
    const supabase = getSupabaseAdmin();
    if (!supabase) return res.status(500).json({ error: "DB not configured" });

    const { data: user, error } = await supabase
      .from("users")
      .update({ name, phone, city })
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("slasham_session");
  res.json({ message: "Logged out successfully" });
});

export default router;
