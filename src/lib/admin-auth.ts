import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { createContext, useContext } from "react";
import { getExternalSupabase } from "@/lib/external-supabase";

/** The admin role value used by the existing public.profiles.role column and is_admin(). */
export type AdminRole = "admin";

export type AdminProfile = {
  id: string;
  full_name: string;
  role: string;
};

/** Matches the existing public.is_admin() definition: profiles.role = 'admin'. */
export function isAdminRole(role: string | null | undefined): boolean {
  return role === "admin";
}

/** Accept only same-origin relative paths for post-login navigation. */
export function sanitizeRedirectPath(raw: string | null | undefined): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export const AdminProfileContext = createContext<AdminProfile | null>(null);

/** The signed-in admin's profile, provided by the authenticated layout gate. */
export function useAdminProfile(): AdminProfile {
  const profile = useContext(AdminProfileContext);
  if (!profile) {
    throw new Error("Admin profile is unavailable outside the authenticated layout.");
  }
  return profile;
}

/** Sign out cleanly: stop in-flight queries, drop cached protected data, clear the session. */
export function useAdminSignOut(): () => Promise<void> {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await getExternalSupabase().auth.signOut();
    await navigate({ to: "/login", replace: true });
  };
}
