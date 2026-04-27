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

    // Attach user to request and normalize role for easier access
    const role = user.user_metadata?.role || "USER";
    const userWithRole = { ...user, role };
    
    // Store in cache
    authCache.set(token, { user: userWithRole, expires: Date.now() + CACHE_TTL });

    req.user = userWithRole;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
