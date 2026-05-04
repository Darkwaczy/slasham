import { Router } from "express";
import { randomInt, randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { getAuthClient, getSupabaseAdmin } from "../supabase";
import { getEnv } from "../env";
import { requireAuth } from "../middleware/auth";
import { sendUserWelcome, sendFounderWelcome, sendOTP, sendGuestWelcome } from "../utils/email";

const router = Router();
const env = getEnv();

router.post("/register", async (req, res) => {
  try {
    const { password, name, phone, city } = req.body;
    const email = String(req.body?.email || "").trim().toLowerCase();

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields (email, password, name)" });
    }

    const authClient = getAuthClient();
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // Check if email is blacklisted (previously deleted)
    const { data: bannedUser } = await supabase
      .from("users")
      .select("role")
      .eq("email", email)
      .single();

    if (bannedUser && (bannedUser.role === "DELETED" || bannedUser.role === "BANNED")) {
      return res.status(403).json({ error: "This email has been permanently banned from the platform." });
    }

    // 1. Create Supabase Auth User via Admin API for better control
    const { data: authData, error: authError } = await authClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone: phone || "", city: city || "", role: "USER" }
    });

    if (authError) throw authError;

    // 2. Generate OTP using cryptographically secure randomInt
    const otpCode = randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

    // 3. Insert into our custom public.users table
    try {
      const { error: dbError } = await supabase.from("users").insert({
        id: authData.user.id,
        email,
        name,
        phone: phone || "",
        city: city || "",
        role: "USER",
        is_verified: false
      });
      if (dbError) throw dbError;

      // ✅ Insert OTP into separate table
      await supabase.from("otp_codes").insert({
        user_id: authData.user.id,
        email,
        code: otpCode,
        expires_at: otpExpires.toISOString(),
        attempts: 0
      });
    } catch (dbErr: any) {
      console.warn("Database insert failed (possibly missing columns), retrying with minimal fields:", dbErr.message);
      // Fallback: Try without the new columns if needed
      const { error: fallbackError } = await supabase.from("users").insert({
        id: authData.user.id,
        email,
        name,
        role: "USER",
        is_verified: false
      });
      if (fallbackError) throw fallbackError;

      // ✅ Insert OTP into separate table
      await supabase.from("otp_codes").insert({
        user_id: authData.user.id,
        email,
        code: otpCode,
        expires_at: otpExpires.toISOString(),
        attempts: 0
      });
    }

    // 4. Trigger OTP Email (Non-blocking)
    sendOTP(email, name, otpCode).catch(emailErr => {
      console.error("OTP email failed to send in background:", emailErr);
    });

    res.status(201).json({ 
      message: "Registration successful. Please verify your email.",
      userId: authData.user.id 
    });
  } catch (error: any) {
    // Better UX: If user tries to register again with an unverified email, resend the OTP
    if (error.message?.includes("Email already exists") || error.code === "23505" || error.message?.includes("already been registered")) {
      const email = String(req.body?.email || "").trim().toLowerCase();
      const supabase = getSupabaseAdmin();
      
      if (supabase) {
        // 1. Check if they exist in our DB
        const { data: existingUser } = await supabase.from("users").select("id, is_verified, name").eq("email", email).single();
        
        if (existingUser && !existingUser.is_verified) {
          const otpCode = randomInt(100000, 999999).toString();
          const otpExpires = new Date(Date.now() + 10 * 60000);
          await supabase.from("users").update({
            is_verified: false
          }).eq("email", email);

          // ✅ Replace OTP in separate table
          await supabase.from("otp_codes").delete().eq("email", email);
          await supabase.from("otp_codes").insert({
            user_id: existingUser.id,
            email,
            code: otpCode,
            expires_at: otpExpires.toISOString(),
            attempts: 0
          });
          
          sendOTP(email, existingUser.name, otpCode).catch(e => console.error("BG Email Error:", e));
          return res.status(200).json({ message: "Account already exists but is unverified. A new code has been sent.", action: "VERIFY_EMAIL" });
        } else if (!existingUser) {
          // 2. Profile missing? Check Supabase Auth for this specific email only
          // We can't easily filter listUsers by email in the admin API without a full scan,
          // so we rely on the fact that if they are missing from public.users, 
          // we can't reliably send them an OTP anyway without an ID.
          // For now, we return the standard error to keep it fast.
          return res.status(400).json({ error: "Account exists in Auth but profile is missing. Please contact support." });
        }
      }
      return res.status(400).json({ error: "A user with this email address has already been registered" });
    }
    res.status(400).json({ error: error.message || "Registration failed" });
  }
});

// Resend OTP
router.post("/resend-otp", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ error: "Email is required" });

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // 1. Verify user exists in our DB (indexed search)
    const { data: user, error: dbError } = await supabase
      .from("users")
      .select("id, name, is_verified")
      .eq("email", email)
      .single();

    if (dbError || !user) {
      return res.status(404).json({ error: "No account found with this email." });
    }

    // 2. Generate new OTP
    const otpCode = randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 minutes

    // 3. Update public.users
    await supabase.from("users").update({
      is_verified: false
    }).eq("id", user.id);

    // ✅ Replace OTP in separate table
    await supabase.from("otp_codes").delete().eq("email", email);
    await supabase.from("otp_codes").insert({
      user_id: user.id,
      email,
      code: otpCode,
      expires_at: otpExpires.toISOString(),
      attempts: 0
    });

    // 4. Send Email (Non-blocking)
    sendOTP(email, user.name || "Member", otpCode).catch(emailErr => {
      console.error("OTP resend email failed in background:", emailErr);
    });

    res.json({ message: "A new verification code has been sent to your email." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const code = String(req.body?.code || "").trim();
    if (!email || !code) return res.status(400).json({ error: "Email and code are required" });

    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    // 1. Fetch current OTP record
    const { data: otpRecord, error: otpError } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpRecord) {
      return res.status(400).json({ error: "OTP not found. Please request a new code." });
    }

    // 2. Fetch user to verify status
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id, name, email, is_verified")
      .eq("email", email)
      .single();

    if (fetchError || !user) return res.status(404).json({ error: "User not found" });
    if (user.is_verified) return res.status(400).json({ error: "Email already verified" });

    // Guard: Too many failed attempts
    if ((otpRecord.attempts || 0) >= 5) {
      return res.status(429).json({ error: "Too many failed attempts. Please request a new code." });
    }

    if (new Date(otpRecord.expires_at) < new Date()) {
      await supabase.from("otp_codes").delete().eq("id", otpRecord.id);
      return res.status(400).json({ error: "Verification code expired" });
    }

    if (otpRecord.code !== code) {
      await supabase.from("otp_codes")
        .update({ attempts: (otpRecord.attempts || 0) + 1 })
        .eq("id", otpRecord.id);
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // ✅ OTP valid — delete it and mark user verified
    await supabase.from("otp_codes").delete().eq("id", otpRecord.id);

    const { error: updateError } = await supabase
      .from("users")
      .update({ is_verified: true, points: 500 }) // Award 500 welcome points
      .eq("id", user.id);

    if (updateError) throw updateError;

    // 3. Trigger Welcome Emails after verification (Non-blocking)
    sendUserWelcome(user.email, user.name).catch(e => console.error("BG Email Error:", e));
    sendFounderWelcome(user.email, user.name).catch(e => console.error("BG Email Error:", e));

    res.json({ message: "Email verified successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const { password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    // ✅ CRITICAL SECURITY FIX: Create a fresh client instance just for authentication.
    const env = getEnv();
    const freshAuthClient = createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
      auth: { persistSession: false }
    });

    const { data, error } = await freshAuthClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase login error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    if (!data?.session || !data?.session.access_token || !data?.user) {
      console.error("Login did not return session/user", { data });
      return res.status(400).json({ error: "Login failed. Please check your credentials and verify your email." });
    }

    // Fetch role/verification status from public.users where possible
    const supabaseAdmin = getSupabaseAdmin();
    let role = "USER";
    let is_verified = !!data.user.email_confirmed_at; // TRUST AUTH STATUS FIRST

    if (supabaseAdmin) {
      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("id, role, is_verified")
        .eq("id", data.user.id)
        .single();

      const finalRole = existingUser?.role || data.user.user_metadata?.role || "USER";

      if (!existingUser) {
        await supabaseAdmin
          .from("users")
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || "Member",
            is_verified: true,
            role: finalRole,
          });
      }

      role = existingUser?.role || finalRole;
      is_verified = existingUser?.is_verified ?? is_verified;
    }

    if (role === "DELETED" || role === "BANNED") {
      return res.status(403).json({ error: "This account has been permanently disabled." });
    }

    if (!is_verified) {
      return res.status(403).json({
        error: "Please verify your email before logging in.",
        action: "VERIFY_EMAIL",
      });
    }

    // Set session cookie only after all account checks pass.
    res.cookie("slasham_session", data.session.access_token, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
      maxAge: data.session.expires_in * 1000,
      path: "/",
    });

    // ✅ Store refresh token for auto-renewal
    res.cookie("slasham_refresh", data.session.refresh_token, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.json({
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || "Member",
        phone: data.user.user_metadata?.phone || "",
        city: data.user.user_metadata?.city || "",
        role,
        is_verified,
        points: 0,
        total_savings: 0,
      },
    });
  } catch (error: any) {
    console.error("Login handler unexpected error:", error);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return res.status(500).json({ error: "DB not configured" });

    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, role, is_verified, created_at, phone, city, points, total_savings, avatar_url")
      .eq("id", req.user.id)
      .single();

    if (error || !user) {
      console.warn("User profile not found in public.users, falling back to Auth metadata");
      // Fallback: return basic info from Supabase Auth
      return res.json({
        id: req.user.id,
        email: req.user.email,
        name: req.user.user_metadata?.name || "Member",
        role: req.user.role || req.user.user_metadata?.role || "USER",
        is_verified: req.user.is_verified ?? !!req.user.email_confirmed_at,
        created_at: req.user.created_at,
        phone: "",
        city: "",
        points: 0,
        total_savings: 0,
        avatar_url: null
      });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/me", requireAuth, async (req, res) => {
  try {
    const { name, phone, city, avatar_url, notification_settings } = req.body;
    const supabase = getSupabaseAdmin();
    if (!supabase) return res.status(500).json({ error: "DB not configured" });

    const { data: user, error } = await supabase
      .from("users")
      .update({ name, phone, city, avatar_url, notification_settings })
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/change-password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }

    const authClient = getAuthClient();
    
    // 1. Verify current password by attempting a re-login
    const { error: loginError } = await authClient.auth.signInWithPassword({
      email: req.user.email,
      password: currentPassword
    });

    if (loginError) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    // 2. Update to new password
    const { error: updateError } = await authClient.auth.updateUser({
      password: newPassword
    });

    if (updateError) throw updateError;

    res.json({ message: "Password updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const authClient = getAuthClient();
    const { error } = await authClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.clientUrl}/#/reset-password`,
    });

    if (error) throw error;

    res.json({ message: "Password reset instructions sent to your email." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { password, token } = req.body;
    if (!password) return res.status(400).json({ error: "New password is required" });

    const authClient = getAuthClient();
    
    // If a token is provided (from URL), verify it first
    if (token) {
        const { error: sessionError } = await authClient.auth.verifyOtp({
            email: req.body.email,
            token,
            type: 'recovery'
        });
        if (sessionError) throw sessionError;
    }

    const { error } = await authClient.auth.updateUser({ password });
    if (error) throw error;

    res.json({ message: "Password updated successfully. You can now log in." });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/auth/guest-checkout
router.post("/guest-checkout", async (req, res) => {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) throw new Error("DB not configured");

    const { firstName, lastName, email, phone, city, state, address } = req.body;

    if (!firstName || !lastName || !email || !phone || !city) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const fullName = `${firstName} ${lastName}`.trim();
    const env = getEnv();

    // ✅ tempPassword defined at top level — in scope for both new and existing users
    const tempPassword = randomBytes(8).toString("hex");

    // 1. Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u: any) => u.email === email);

    let userId: string;
    let isNewUser = false;

    if (existingUser) {
      userId = existingUser.id;

      // Update profile with latest billing info
      await supabase.from("users").update({
        name: fullName,
        phone,
        city,
      }).eq("id", userId);

    } else {
      isNewUser = true;

      const { data: newAuth, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { name: fullName, role: "USER" }
      });

      if (authError) throw authError;
      userId = newAuth.user.id;

      await supabase.from("users").upsert({
        id: userId,
        email,
        name: fullName,
        phone,
        city,
        role: "USER",
        is_verified: true,
        points: 0,
        total_savings: 0,
      });

      // Send welcome email with temp password
      sendGuestWelcome(email, firstName, tempPassword).catch(
        (e: any) => console.error("Guest welcome email failed:", e)
      );
    }

    // 4. Get full user profile
    const { data: userProfile } = await supabase
      .from("users")
      .select("id, email, name, role, city, phone, is_verified, points, total_savings")
      .eq("id", userId)
      .single();

    res.json({ success: true, isNewUser, user: userProfile });

  } catch (error: any) {
    console.error("Guest checkout error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/logout", (_req, res) => {
  const isProduction = env.nodeEnv === "production";
  res.clearCookie("slasham_session", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  // ✅ Also clear refresh token
  res.clearCookie("slasham_refresh", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
});

export default router;
