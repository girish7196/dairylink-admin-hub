import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | undefined;

/** Lazy browser-only client for the user's existing external project. */
export function getExternalSupabase(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("Milk rates are available after the page finishes loading.");
  }
  if (browserClient) return browserClient;
  const url = import.meta.env['VITE_SUPABASE_URL'];
  const key = import.meta.env['VITE_SUPABASE_ANON_KEY'];
  if (!url || !key) {
    throw new Error(
      "Milk rates are not connected. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for your existing project, then reload.",
    );
  }
  // Never accept an explicitly privileged JWT or secret key in browser config.
  if (key.startsWith("sb_secret_")) throw new Error("Use the public anon key, not a secret key.");
  const payload = key.split(".")[1];
  if (payload) {
    try {
      const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { role?: string };
      if (decoded.role === "service_role") throw new Error("Use the public anon key, not a service-role key.");
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Use the public")) throw error;
      throw new Error("The public anon key configuration is invalid.");
    }
  }
  browserClient = createClient(url, key);
  return browserClient;
}