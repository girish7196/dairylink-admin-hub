# Phase 1
- [x] Implement existing-project client and milk rates query/insert, refresh, loading/error/retry.
- [x] Verify rate selection and insert mapping, inspect mock login, and report external configuration/RLS blockers.
- [x] Verify preview and apply required package security update.
- [x] Connect the existing Supabase project (DairyLink Project): env keys supplied by the integration, client reads VITE_SUPABASE_PUBLISHABLE_KEY, login wired to real Supabase Auth; live connectivity verified (real auth + RLS errors observed).
- [ ] Verify real authorized insert/readback — blocked by needing real admin credentials signed in via /login (external project: no managed session).