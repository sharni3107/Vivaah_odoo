-- ==============================================================================
-- TARGETED CORRECTION FOR POSTGRESQL RLS CIRCULAR RECURSION (ERROR 42P17)
-- ==============================================================================
-- Description:
-- Breaks circular policy loop between public.weddings and public.wedding_vendors:
--   1. "Vendor view assigned wedding summary" on public.weddings queries public.wedding_vendors.
--   2. "Client view confirmed vendors" on public.wedding_vendors queried public.weddings.
-- Solution:
--   Use SECURITY DEFINER helper function public.get_current_client_wedding_id()
--   to look up wedding_id directly from public.profiles without querying public.weddings.
--
-- Security hardening:
--   - Restricted search_path (SET search_path = '') preventing search_path hijacking.
--   - Fully schema-qualified identifiers (public.profiles, auth.uid()).
--   - Execution restricted strictly to 'authenticated' role (REVOKE from PUBLIC and anon).
--   - Function owner (postgres / supabase_admin) safely bypasses profiles RLS without recursion.
--   - Preserves agency and vendor isolation.
-- ==============================================================================

-- 1. Helper function (Security Definer with empty search_path)
CREATE OR REPLACE FUNCTION public.get_current_client_wedding_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT wedding_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- Revoke all public/anon execution and grant strictly to authenticated
REVOKE ALL ON FUNCTION public.get_current_client_wedding_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_current_client_wedding_id() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_current_client_wedding_id() TO authenticated;

-- 2. Drop the recursive policy on public.wedding_vendors (if present)
DROP POLICY IF EXISTS "Client view confirmed vendors" ON public.wedding_vendors;

-- 3. Re-create with direct helper function call (non-recursive)
CREATE POLICY "Client view confirmed vendors" ON public.wedding_vendors
  FOR SELECT USING (
    wedding_id = public.get_current_client_wedding_id()
  );

