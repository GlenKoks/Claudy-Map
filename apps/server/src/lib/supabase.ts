import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config.js";

/**
 * Admin client (service-role key). Bypasses RLS — server-side use only.
 * Never expose the service-role key to the client.
 */
export function createAdminClient(): SupabaseClient {
  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Anon client. Used to exchange an admin-generated OTP token for a real
 * user session (access + refresh tokens) that is handed back to the app.
 */
export function createAnonClient(): SupabaseClient {
  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
