import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getExternalSupabase } from "@/lib/external-supabase";
import { AdminProfileContext, isAdminRole, type AdminProfile } from "@/lib/admin-auth";

export const Route = createFileRoute("/_authenticated")({
  // The session lives in browser storage; this gate and everything below it run client-side only.
  ssr: false,
  beforeLoad: async ({ location }) => {
    const supabase = getExternalSupabase();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      const network = userError instanceof Error && /fetch|network|load/i.test(userError.message);
      throw redirect({
        to: "/login",
        search: { redirect: location.href, reason: network ? "network" : undefined },
      });
    }

    const { data: profile, error: profileError } = await supabase
      .schema("public")
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", user.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      throw redirect({
        to: "/login",
        search: { redirect: location.href, reason: "network" },
      });
    }

    if (!profile || !isAdminRole(profile.role)) {
      // A session without an authorized admin profile must not linger in the browser.
      await supabase.auth.signOut();
      throw redirect({
        to: "/login",
        search: { redirect: undefined, reason: profile ? "not_admin" : "no_profile" },
      });
    }

    return { adminProfile: profile as AdminProfile };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { adminProfile } = Route.useRouteContext();
  return (
    <AdminProfileContext.Provider value={adminProfile}>
      <Outlet />
    </AdminProfileContext.Provider>
  );
}
