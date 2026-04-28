import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "./env";

let cachedAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cachedAdmin) return cachedAdmin;

  const env = getEnv();
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) return null;

  cachedAdmin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cachedAdmin;
}

export function getAuthClient(): SupabaseClient {
  const admin = getSupabaseAdmin();
  if (!admin) throw new Error("Supabase Admin client not initialized");
  return admin;
}

