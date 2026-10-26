-- Minimum secure fix: the tables exist with RLS policies, but no Data API grants were ever issued,
-- so even authenticated users get "permission denied" (42501). Grant only what the existing
-- policies allow; RLS remains enabled and unchanged.

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.milk_rates TO authenticated;
GRANT ALL ON public.milk_rates TO service_role;