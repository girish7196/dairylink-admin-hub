<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The external-project Supabase client is initialized lazily in the browser using public VITE configuration; never provision a backend or import privileged clients for this phased integration. The connected project supplies its public key as `VITE_SUPABASE_PUBLISHABLE_KEY` (not `VITE_SUPABASE_ANON_KEY`); `src/lib/external-supabase.ts` falls back to it.
- Milk rates query the existing public.milk_rates columns directly through TanStack Query inside a ClientOnly boundary; browser-owned sessions and missing configuration must not trigger SSR requests. The table's RLS policies allow the `authenticated` role only, so reads/writes require a real Supabase Auth session — no anon grant is added.
- Admin sign-in (src/routes/login.tsx) calls real Supabase Auth `signInWithPassword` through the external client; the mock timer sign-in was removed. No route-wide auth gate exists yet — protected pages still render signed-out states by design until Phase 2.
- Rate revisions insert both milk base rates and the shared quality bonuses as one row; the reusable form awaits saves and retains entered values on failures.
