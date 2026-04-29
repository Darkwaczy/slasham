import { Request, Response, NextFunction } from "express";
import { getSupabaseAdmin } from "../supabase";

// Simple in-memory cache for Auth lookups to prevent redundant network trips
// during parallel API requests from the frontend.
const authCache = new Map<string, { user: any; expires: number }>();
const CACHE_TTL = 10000; // 10 seconds

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.slasham_session;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Check cache first
    const cached = authCache.get(token);
    if (cached && cached.expires > Date.now()) {
      req.user = cached.user;
      return next();
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return res.status(500).json({ error: "DB not configured" });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      // Clear cache if token is invalid
      authCache.delete(token);
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Prefer role from public.users so admin/merchant role changes take effect immediately.
    let role = user.user_metadata?.role || "USER";
    let isVerified = !!user.email_confirmed_at;
    try {
      const { data: profile } = await supabase
        .from("users")
        .select("role, is_verified")
        .eq("id", user.id)
        .single();

      if (profile?.role) role = profile.role;
      if (typeof profile?.is_verified === "boolean") {
        isVerified = profile.is_verified;
      }
    } catch {
      // Non-fatal: fallback to Auth metadata.
    }

    const userWithRole = { ...user, role, is_verified: isVerified };
    
    // Store in cache
    authCache.set(token, { user: userWithRole, expires: Date.now() + CACHE_TTL });

    req.user = userWithRole;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
