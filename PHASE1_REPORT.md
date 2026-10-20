# DairyLink Phase 1 integration report

## Implemented
- Existing navigation and styling preserved; only the Milk Rates page connects to the existing backend.
- Lazy browser client reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Missing configuration produces a clear error; privileged keys are rejected.
- Rate history selects the supplied columns, newest effective date first. Current cards select the latest date no later than the browser's current local date. Future revisions remain scheduled.
- Cow and buffalo base rates remain separate from the shared fat and SNF bonuses. No demo fallback.
- Revision form inserts a single row containing both base rates, both bonuses and the effective date. No update/delete operations or schema changes. Success invalidates the query; failures preserve entered values.
- Other pages still use demo data, including collection pricing; they were intentionally not integrated in Phase 1.

## Exact read query
```ts
getExternalSupabase().schema("public").from("milk_rates")
  .select("id,effective_from,cow_rate_per_litre,buffalo_rate_per_litre,fat_bonus_per_percent,snf_bonus_per_percent,created_at")
  .order("effective_from", { ascending: false })
  .order("created_at", { ascending: false })
```
The query also receives TanStack Query's abort signal. The second order resolves equal-date revisions deterministically.

## Exact write
```ts
getExternalSupabase().schema("public").from("milk_rates").insert({
  effective_from,
  cow_rate_per_litre,
  buffalo_rate_per_litre,
  fat_bonus_per_percent,
  snf_bonus_per_percent,
})
```
No fabricated rows were sent. Actual inserts require an authorized user submitting the form. IDs and created_at must already have defaults in the existing table; no defaults or schema were changed.

## Configuration and permissions blockers
- Neither required public environment variable was available during verification. Set the existing project's URL and public anon key through project configuration. Never supply a service-role or secret key.
- To link your existing backend in Lovable, open Settings → General → External Supabase → Connect. Do not enable a new Cloud project. After connecting, verify the required variable names exist.
- Existing grants and RLS must permit SELECT for the intended readers and INSERT only for authorized administrators. No policies were inspected or changed; anonymous/public write permissions must not be added.
- A SELECT denied by RLS can return an empty array rather than an error; the page therefore cannot prove whether an empty result means no rows or filtered rows.
- Without the actual backend connection, grants, policies, defaults, numeric constraints and live reads/writes remain unverified.

## Login audit
The login is still a mock: any nonempty email/password triggers a delayed success toast and navigation without credential verification. Remember me has no session behavior; forgot password only displays a toast. Logout only navigates. The hardcoded header profile is not evidence of an authenticated user. Authentication was not implemented or claimed in this phase. Admin-only inserts will be blocked unless a real authorized session exists; real admin authentication is a prerequisite for secured writes.

## Verification
- Four retained tests passed: latest effective selection; no demo fallback; exact insert mapping with unchanged base rates; missing input rejection.
- Automatic project type check/build: final result build OK.
- Browser verified /rates: missing configuration displays unavailable rates, retry works, failed save retains values and shows an error. No browser runtime errors observed.
- No live database request succeeded or was possible with the missing configuration. End-to-end authenticated insert/readback remains blocked, not verified.

## Files changed
- src/lib/external-supabase.ts (new reusable client)
- src/data/milk-rates.ts (new read/write and date-selection layer)
- src/data/milk-rates.test.ts (new tests)
- src/routes/rates.tsx (connected milk rates UI)
- src/components/forms/EntityFormDialog.tsx (await save, retain errors/values)
- src/routes/__root.tsx (error prop type compatibility only)
- package.json and bun.lock (required libraries)
- AGENTS.md (architecture rules)
- roadmap.md (task status)
- PHASE1_REPORT.md (this report)