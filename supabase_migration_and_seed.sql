-- ==============================================================================
-- VIVAAH — HACKATHON SUPABASE SCHEMA MIGRATION & IDEMPOTENT SEED SCRIPT
-- ==============================================================================
-- ESSENTIAL SECURITY ARCHITECTURE (Simple, Hackathon-Focused, Zero Overengineering):
-- 1. Explicit DROP of conflicting legacy policies across all 16 tables.
-- 2. Clean isolation: Client (own wedding), Vendor (own records/assignments), Agency (unified access).
-- 3. Anonymous public: View restricted vendor directory view; submit enquiries with safe default 'New'.
-- 4. Role escalation prevention: Signups default to 'client'; triggers preserve assigned roles & IDs.
-- 5. Quotation requests assigned directly via vendor_id on public.quotation_requests.
-- 6. Lightweight protection triggers: lock pricing/terms on quotes, lock assignments on arrivals.
-- 7. Deterministic RFC-4122 UUID seed data tagged with is_demo = true.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- PART 1: SCHEMA MIGRATIONS (Simple non-destructive column additions)
-- ------------------------------------------------------------------------------

-- 1. Weddings Table Additions
ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS venue TEXT;
ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS progress INT DEFAULT 0;
ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS assigned_planner TEXT;

-- 2. Enquiries Table Additions
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- 3. Tasks Table Additions
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- 4. Vendors Table Additions
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS confirmed_assignments TEXT[] DEFAULT '{}';

-- 5. Quotation Requests & Quotations Additions
-- vendor_id links RFQ directly to invited vendor without complex invitation tables
ALTER TABLE public.quotation_requests ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES public.vendors(id);
ALTER TABLE public.quotation_requests ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- 6. Wedding Vendors (Confirmed assignments) Additions
ALTER TABLE public.wedding_vendors ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- 7. Guests Table Additions
ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- 8. Events Table Additions
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- 9. Vendor Arrivals Additions
ALTER TABLE public.vendor_arrivals ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- 10. Financial Ledgers Additions
ALTER TABLE public.client_payments ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.vendor_payments ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- 11. Documents & Activity Logs Additions
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS blob_url TEXT;
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- ------------------------------------------------------------------------------
-- PART 2: AUTHENTICATION TRIGGER (Safe default 'client' role)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  -- Safe default role is always 'client' for public signup.
  -- Elevated agency roles must be granted by administrators in the database.
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'client'::user_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = now();
    -- Note: existing role is intentionally preserved and NOT overwritten
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ------------------------------------------------------------------------------
-- PART 3: LIGHTWEIGHT DATA INTEGRITY TRIGGERS
-- ------------------------------------------------------------------------------

-- 1. Profile Field Protection: Users cannot change their own role, vendor_id, or wedding_id
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  -- If not admin or service_role, preserve existing role and mapping assignments
  IF NOT (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'::user_role)
    OR auth.role() = 'service_role'
  ) THEN
    NEW.role = OLD.role;
    NEW.vendor_id = OLD.vendor_id;
    NEW.wedding_id = OLD.wedding_id;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.protect_profile_fields();

-- 2. Vendor Profile Protection: Vendors cannot modify administrative, rating, or assignment fields
CREATE OR REPLACE FUNCTION public.protect_vendor_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  IF NOT (public.is_agency_user() OR auth.role() = 'service_role') THEN
    NEW.id = OLD.id;
    NEW.vendor_user_id = OLD.vendor_user_id;
    NEW.confirmed_assignments = OLD.confirmed_assignments;
    NEW.rating = OLD.rating;
    NEW.status = OLD.status;
    NEW.is_demo = OLD.is_demo;
    NEW.created_at = OLD.created_at;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_vendor_fields ON public.vendors;
CREATE TRIGGER trg_protect_vendor_fields
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE PROCEDURE public.protect_vendor_fields();

-- 3. Quotation Protection: Preserve client feedback, vendor drafts, and agency ownership
CREATE OR REPLACE FUNCTION public.protect_quotation_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  IF NOT (public.is_agency_user() OR auth.role() = 'service_role') THEN
    -- Case A: Client Updating
    -- Explicitly preserve all fields other than permitted client_feedback and status
    IF EXISTS (
      SELECT 1 FROM public.weddings 
      WHERE (client_user_id = auth.uid() OR id = public.get_current_client_wedding_id()) 
        AND id = OLD.wedding_id
    ) THEN
      NEW.id = OLD.id;
      NEW.request_id = OLD.request_id;
      NEW.wedding_id = OLD.wedding_id;
      NEW.vendor_id = OLD.vendor_id;
      NEW.price_per_plate_or_service = OLD.price_per_plate_or_service;
      NEW.total_quoted_amount = OLD.total_quoted_amount;
      NEW.additional_charges = OLD.additional_charges;
      NEW.service_inclusions = OLD.service_inclusions;
      NEW.notes = OLD.notes;
      NEW.proposal_pdf_url = OLD.proposal_pdf_url;
      NEW.shared_with_client = OLD.shared_with_client;
      NEW.is_demo = OLD.is_demo;
      NEW.created_at = OLD.created_at;
      -- Clients can only transition status to Client Approved or Client Rejected
      IF NEW.status NOT IN ('Client Approved'::quotation_status, 'Client Rejected'::quotation_status, OLD.status) THEN
        NEW.status = OLD.status;
      END IF;

    -- Case B: Vendor Updating
    -- Preserves internal ownership, agency fields, and is_demo
    ELSIF EXISTS (
      SELECT 1 FROM public.vendors 
      WHERE (vendor_user_id = auth.uid() OR id = public.get_current_vendor_id()) 
        AND id = OLD.vendor_id
    ) THEN
      NEW.id = OLD.id;
      NEW.request_id = OLD.request_id;
      NEW.wedding_id = OLD.wedding_id;
      NEW.vendor_id = OLD.vendor_id;
      NEW.shared_with_client = OLD.shared_with_client;
      NEW.client_feedback = OLD.client_feedback;
      NEW.is_demo = OLD.is_demo;
      NEW.created_at = OLD.created_at;

      -- Vendor commercial and status workflow:
      -- 1. In Draft: vendor can edit commercial fields, proposal PDF, and submit (status -> 'Submitted')
      IF OLD.status = 'Draft'::quotation_status THEN
        -- Vendor can keep Draft or advance to Submitted; any other status transition is rejected
        IF NEW.status NOT IN ('Draft'::quotation_status, 'Submitted'::quotation_status) THEN
          NEW.status = OLD.status;
        END IF;
      -- 2. Once submitted (not in Draft): vendor cannot revert to Draft, cannot change status, and commercial terms are locked
      ELSE
        NEW.status = OLD.status;
        NEW.price_per_plate_or_service = OLD.price_per_plate_or_service;
        NEW.total_quoted_amount = OLD.total_quoted_amount;
        NEW.additional_charges = OLD.additional_charges;
        NEW.service_inclusions = OLD.service_inclusions;
        NEW.proposal_pdf_url = OLD.proposal_pdf_url;
      END IF;
    ELSE
      -- Any other user is unauthorized to update quotations
      NEW = OLD;
    END IF;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_quotation_fields ON public.quotations;
CREATE TRIGGER trg_protect_quotation_fields
  BEFORE UPDATE ON public.quotations
  FOR EACH ROW EXECUTE PROCEDURE public.protect_quotation_fields();

-- 4. Arrival Protection: Vendors update only arrival_status, actual_arrival_time, reported_issue
CREATE OR REPLACE FUNCTION public.protect_vendor_arrival_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
  IF NOT (public.is_agency_user() OR auth.role() = 'service_role') THEN
    NEW.id = OLD.id;
    NEW.event_id = OLD.event_id;
    NEW.wedding_id = OLD.wedding_id;
    NEW.vendor_id = OLD.vendor_id;
    NEW.expected_time = OLD.expected_time;
    NEW.coordinator_notes = OLD.coordinator_notes;
    NEW.is_demo = OLD.is_demo;
    NEW.created_at = OLD.created_at;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_vendor_arrival_fields ON public.vendor_arrivals;
CREATE TRIGGER trg_protect_vendor_arrival_fields
  BEFORE UPDATE ON public.vendor_arrivals
  FOR EACH ROW EXECUTE PROCEDURE public.protect_vendor_arrival_fields();

-- ------------------------------------------------------------------------------
-- PART 4: PUBLIC VENDOR DIRECTORY VIEW & BASE TABLE LOCKDOWN
-- ------------------------------------------------------------------------------

-- 1. Base table lockdown: Revoke all base table access from anon and PUBLIC
-- This prevents anonymous users from accessing private columns via inherited PUBLIC grants.
REVOKE ALL ON public.vendors FROM anon, PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vendors TO authenticated;
GRANT ALL ON public.vendors TO service_role;

-- 2. Restricted View exposing ONLY public marketing directory columns
-- security_invoker = false ensures view evaluates with view-owner privileges so
-- anonymous users can safely view marketing columns without base-table access.
CREATE OR REPLACE VIEW public.public_vendor_directory 
WITH (security_invoker = false) AS
SELECT 
  id,
  name,
  category,
  services,
  location,
  rating
FROM public.vendors
WHERE status = 'Active';

-- Grant SELECT on the restricted view to public/anon and authenticated users
GRANT SELECT ON public.public_vendor_directory TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- PART 5: CLEANUP OF ALL CONFLICTING LEGACY POLICIES
-- ------------------------------------------------------------------------------

-- Drop legacy vendor policies
DROP POLICY IF EXISTS "Public vendor directory view" ON public.vendors;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.vendors;
DROP POLICY IF EXISTS "Public view active vendors" ON public.vendors;
DROP POLICY IF EXISTS "Allow public read access" ON public.vendors;
DROP POLICY IF EXISTS "Agency vendor management" ON public.vendors;
DROP POLICY IF EXISTS "Vendor view own record" ON public.vendors;
DROP POLICY IF EXISTS "Vendor update own record" ON public.vendors;

-- Drop legacy quotation policies
DROP POLICY IF EXISTS "Agency quotation management" ON public.quotations;
DROP POLICY IF EXISTS "Client view shared quotations" ON public.quotations;
DROP POLICY IF EXISTS "Client approve shared quotations" ON public.quotations;
DROP POLICY IF EXISTS "Client feedback on shared quotations" ON public.quotations;
DROP POLICY IF EXISTS "Vendor view own quotations" ON public.quotations;
DROP POLICY IF EXISTS "Vendor insert/update own quotations" ON public.quotations;
DROP POLICY IF EXISTS "Vendor quotation management" ON public.quotations;

-- Drop legacy quotation requests policies
DROP POLICY IF EXISTS "Agency quotation requests management" ON public.quotation_requests;
DROP POLICY IF EXISTS "Vendor view relevant quotation requests" ON public.quotation_requests;
DROP POLICY IF EXISTS "Vendor view assigned quotation requests" ON public.quotation_requests;

-- Drop legacy vendor arrivals policies
DROP POLICY IF EXISTS "Agency vendor arrivals" ON public.vendor_arrivals;
DROP POLICY IF EXISTS "Agency vendor arrivals management" ON public.vendor_arrivals;
DROP POLICY IF EXISTS "Vendor arrival update" ON public.vendor_arrivals;
DROP POLICY IF EXISTS "Vendor manage arrivals" ON public.vendor_arrivals;
DROP POLICY IF EXISTS "Vendor view assigned arrivals" ON public.vendor_arrivals;
DROP POLICY IF EXISTS "Vendor update assigned arrivals" ON public.vendor_arrivals;

-- Drop legacy guest policies
DROP POLICY IF EXISTS "Agency guest management" ON public.guests;
DROP POLICY IF EXISTS "Client guest access" ON public.guests;
DROP POLICY IF EXISTS "Client guest management" ON public.guests;

-- Drop legacy payment & expense policies
DROP POLICY IF EXISTS "Agency client payment management" ON public.client_payments;
DROP POLICY IF EXISTS "Client view own payments" ON public.client_payments;
DROP POLICY IF EXISTS "Agency vendor payments" ON public.vendor_payments;
DROP POLICY IF EXISTS "Agency vendor payment management" ON public.vendor_payments;
DROP POLICY IF EXISTS "Vendor view own payments" ON public.vendor_payments;
DROP POLICY IF EXISTS "Agency expenses" ON public.expenses;
DROP POLICY IF EXISTS "Agency expenses management" ON public.expenses;

-- Drop legacy wedding & task policies
DROP POLICY IF EXISTS "Agency wedding management" ON public.weddings;
DROP POLICY IF EXISTS "Client view own wedding" ON public.weddings;
DROP POLICY IF EXISTS "Vendor view assigned wedding summary" ON public.weddings;
DROP POLICY IF EXISTS "Agency task management" ON public.tasks;
DROP POLICY IF EXISTS "Client view wedding tasks" ON public.tasks;

-- Drop legacy enquiry & profile policies
DROP POLICY IF EXISTS "Public enquiry submit" ON public.enquiries;
DROP POLICY IF EXISTS "Agency enquiry management" ON public.enquiries;
DROP POLICY IF EXISTS "Profiles view policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;

-- Drop legacy event, wedding_vendor, document & activity_log policies
DROP POLICY IF EXISTS "Agency events management" ON public.events;
DROP POLICY IF EXISTS "Client view events" ON public.events;
DROP POLICY IF EXISTS "Vendor view assigned events" ON public.events;
DROP POLICY IF EXISTS "Agency wedding vendors management" ON public.wedding_vendors;
DROP POLICY IF EXISTS "Client view confirmed vendors" ON public.wedding_vendors;
DROP POLICY IF EXISTS "Vendor view assignments" ON public.wedding_vendors;
DROP POLICY IF EXISTS "Agency documents management" ON public.documents;
DROP POLICY IF EXISTS "Client view wedding documents" ON public.documents;
DROP POLICY IF EXISTS "Vendor view contract documents" ON public.documents;
DROP POLICY IF EXISTS "Agency activity logs management" ON public.activity_logs;

-- ------------------------------------------------------------------------------
-- PART 6: COMPREHENSIVE ROLE-BASED RLS POLICIES (All 16 Tables)
-- ------------------------------------------------------------------------------

-- Ensure RLS is active on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_arrivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Unified Agency Staff Helper: All 5 roles share general agency workspace access
CREATE OR REPLACE FUNCTION public.is_agency_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'wedding_planner', 'event_coordinator', 'finance_executive', 'enquiry_executive')
  );
$$;

-- Vendor ID Helper
CREATE OR REPLACE FUNCTION public.get_current_vendor_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
  SELECT vendor_id FROM public.profiles WHERE id = auth.uid();
$$;

-- Client Wedding ID Helper
CREATE OR REPLACE FUNCTION public.get_current_client_wedding_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
  SELECT wedding_id FROM public.profiles WHERE id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.is_agency_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_vendor_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_client_wedding_id() TO authenticated;

-- 1. PROFILES
CREATE POLICY "Profiles view policy" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_agency_user());

CREATE POLICY "Profiles update policy" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_agency_user());

-- 2. ENQUIRIES (Public website can submit new leads only)
CREATE POLICY "Public enquiry submit" ON public.enquiries
  FOR INSERT WITH CHECK (status = 'New' AND converted_wedding_id IS NULL);

CREATE POLICY "Agency enquiry management" ON public.enquiries
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

-- 3. WEDDINGS
CREATE POLICY "Agency wedding management" ON public.weddings
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Client view own wedding" ON public.weddings
  FOR SELECT USING (
    client_user_id = auth.uid() 
    OR id = public.get_current_client_wedding_id()
  );

CREATE POLICY "Vendor view assigned wedding summary" ON public.weddings
  FOR SELECT USING (
    id IN (
      SELECT wedding_id FROM public.wedding_vendors 
      WHERE vendor_id = public.get_current_vendor_id() 
         OR vendor_id IN (SELECT id FROM public.vendors WHERE vendor_user_id = auth.uid())
    )
  );

-- 4. TASKS
CREATE POLICY "Agency task management" ON public.tasks
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Client view wedding tasks" ON public.tasks
  FOR SELECT USING (
    wedding_id = public.get_current_client_wedding_id()
    OR wedding_id IN (SELECT id FROM public.weddings WHERE client_user_id = auth.uid())
  );

-- 5. VENDORS (Base Table: Agency & Vendor own record only)
CREATE POLICY "Agency vendor management" ON public.vendors
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Vendor view own record" ON public.vendors
  FOR SELECT USING (
    vendor_user_id = auth.uid() 
    OR id = public.get_current_vendor_id()
  );

CREATE POLICY "Vendor update own record" ON public.vendors
  FOR UPDATE USING (
    vendor_user_id = auth.uid() 
    OR id = public.get_current_vendor_id()
  );

-- 6. QUOTATION REQUESTS (Assigned vendor only)
CREATE POLICY "Agency quotation requests management" ON public.quotation_requests
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Vendor view assigned quotation requests" ON public.quotation_requests
  FOR SELECT USING (
    vendor_id = public.get_current_vendor_id()
    OR vendor_id IN (SELECT id FROM public.vendors WHERE vendor_user_id = auth.uid())
  );

-- 7. QUOTATIONS
CREATE POLICY "Agency quotation management" ON public.quotations
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Client view shared quotations" ON public.quotations
  FOR SELECT USING (
    shared_with_client = true
    AND (
      wedding_id = public.get_current_client_wedding_id()
      OR wedding_id IN (SELECT id FROM public.weddings WHERE client_user_id = auth.uid())
    )
  );

CREATE POLICY "Client feedback on shared quotations" ON public.quotations
  FOR UPDATE USING (
    shared_with_client = true
    AND (
      wedding_id = public.get_current_client_wedding_id()
      OR wedding_id IN (SELECT id FROM public.weddings WHERE client_user_id = auth.uid())
    )
  );

CREATE POLICY "Vendor quotation management" ON public.quotations
  FOR ALL USING (
    vendor_id = public.get_current_vendor_id()
    OR vendor_id IN (SELECT id FROM public.vendors WHERE vendor_user_id = auth.uid())
  );

-- 8. WEDDING VENDORS
CREATE POLICY "Agency wedding vendors management" ON public.wedding_vendors
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Client view confirmed vendors" ON public.wedding_vendors
  FOR SELECT USING (
    wedding_id = public.get_current_client_wedding_id()
  );

CREATE POLICY "Vendor view assignments" ON public.wedding_vendors
  FOR SELECT USING (
    vendor_id = public.get_current_vendor_id()
    OR vendor_id IN (SELECT id FROM public.vendors WHERE vendor_user_id = auth.uid())
  );

-- 9. GUESTS (Private: Agency & Client only)
CREATE POLICY "Agency guest management" ON public.guests
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Client guest management" ON public.guests
  FOR ALL USING (
    wedding_id = public.get_current_client_wedding_id()
    OR wedding_id IN (SELECT id FROM public.weddings WHERE client_user_id = auth.uid())
  );

-- 10. EVENTS
CREATE POLICY "Agency events management" ON public.events
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Client view events" ON public.events
  FOR SELECT USING (
    wedding_id = public.get_current_client_wedding_id()
    OR wedding_id IN (SELECT id FROM public.weddings WHERE client_user_id = auth.uid())
  );

CREATE POLICY "Vendor view assigned events" ON public.events
  FOR SELECT USING (
    wedding_id IN (
      SELECT wedding_id FROM public.wedding_vendors 
      WHERE vendor_id = public.get_current_vendor_id() 
         OR vendor_id IN (SELECT id FROM public.vendors WHERE vendor_user_id = auth.uid())
    )
  );

-- 11. VENDOR ARRIVALS
CREATE POLICY "Agency vendor arrivals management" ON public.vendor_arrivals
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Vendor view assigned arrivals" ON public.vendor_arrivals
  FOR SELECT USING (
    vendor_id = public.get_current_vendor_id()
    OR vendor_id IN (SELECT id FROM public.vendors WHERE vendor_user_id = auth.uid())
  );

CREATE POLICY "Vendor update assigned arrivals" ON public.vendor_arrivals
  FOR UPDATE USING (
    vendor_id = public.get_current_vendor_id()
    OR vendor_id IN (SELECT id FROM public.vendors WHERE vendor_user_id = auth.uid())
  );

-- 12. CLIENT PAYMENTS
CREATE POLICY "Agency client payment management" ON public.client_payments
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Client view own payments" ON public.client_payments
  FOR SELECT USING (
    wedding_id = public.get_current_client_wedding_id()
    OR wedding_id IN (SELECT id FROM public.weddings WHERE client_user_id = auth.uid())
  );

-- 13. VENDOR PAYMENTS (Vendor can view own disbursements)
CREATE POLICY "Agency vendor payment management" ON public.vendor_payments
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Vendor view own payments" ON public.vendor_payments
  FOR SELECT USING (
    vendor_id = public.get_current_vendor_id()
    OR vendor_id IN (SELECT id FROM public.vendors WHERE vendor_user_id = auth.uid())
  );

-- 14. EXPENSES (Agency only)
CREATE POLICY "Agency expenses management" ON public.expenses
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

-- 15. DOCUMENTS
CREATE POLICY "Agency documents management" ON public.documents
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Client view wedding documents" ON public.documents
  FOR SELECT USING (
    wedding_id = public.get_current_client_wedding_id()
    OR wedding_id IN (SELECT id FROM public.weddings WHERE client_user_id = auth.uid())
  );

CREATE POLICY "Vendor view contract documents" ON public.documents
  FOR SELECT USING (
    wedding_id IN (
      SELECT wedding_id FROM public.wedding_vendors 
      WHERE vendor_id = public.get_current_vendor_id() 
         OR vendor_id IN (SELECT id FROM public.vendors WHERE vendor_user_id = auth.uid())
    )
    AND category IN ('Vendor Agreement', 'Vendor Quotation', 'Proposal')
  );

-- 16. ACTIVITY LOGS (Agency only)
CREATE POLICY "Agency activity logs management" ON public.activity_logs
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

-- ------------------------------------------------------------------------------
-- PART 7: IDEMPOTENT SEED DATA (Deterministic UUIDs, Tagged with is_demo = true)
-- ------------------------------------------------------------------------------

-- 1. Vendors Seed (4 Verified Artisan Partners)
INSERT INTO public.vendors (id, name, category, contact_person, phone, email, services, location, status, rating, confirmed_assignments, is_demo)
VALUES
  (
    'b0000001-0000-0000-0000-000000000001',
    'Royal Feast Catering Atelier',
    'Catering',
    'Chef Ranveer Brar',
    '+91 98200 44551',
    'proposals@royalfeastcatering.com',
    'Multi-course royal banquets, live silver-service stations, artisanal dessert installations',
    'Jaipur & Delhi NCR',
    'Active',
    4.9,
    ARRAY['Aarav & Meera — Royal Jaipur Palace Wedding'],
    true
  ),
  (
    'b0000001-0000-0000-0000-000000000002',
    'Rajputana Floral & Scenography',
    'Decoration & Scenography',
    'Vikramaditya Rathore',
    '+91 98200 44552',
    'designs@rajputanafloral.com',
    'Bespoke Mandap architecture, Dutch imported blooms, heritage courtyard lighting',
    'Jaipur, Rajasthan',
    'Active',
    4.8,
    ARRAY['Aarav & Meera — Royal Jaipur Palace Wedding'],
    true
  ),
  (
    'b0000001-0000-0000-0000-000000000003',
    'Celebrity Cinema & Portraits',
    'Photography & Cinema',
    'Aditya Kothari',
    '+91 98200 44553',
    'visuals@celebritycinema.com',
    '6-camera cinematic wedding film, drone aerial coverage, royal portraiture albums',
    'Mumbai & Jaipur',
    'Active',
    5.0,
    ARRAY['Aarav & Meera — Royal Jaipur Palace Wedding'],
    true
  ),
  (
    'b0000001-0000-0000-0000-000000000004',
    'Symphony Royal Sound & Trussing',
    'Production & Lighting',
    'Gaurav Chawla',
    '+91 98200 44554',
    'tech@symphonyproduction.com',
    'Concert line-array audio, intelligent moving head fixtures, concert trussing setup',
    'Delhi & Jaipur',
    'Active',
    4.7,
    ARRAY['Aarav & Meera — Royal Jaipur Palace Wedding'],
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 2. Enquiries Seed (1 Confirmed, 2 Active Pipeline)
INSERT INTO public.enquiries (id, client_names, email, phone, represented_by, wedding_date, destination, expected_guests, package_type, estimated_budget, preferred_theme, additional_requirements, status, is_demo)
VALUES
  (
    'e0000001-0000-0000-0000-000000000001',
    'Aarav Singhania & Meera Kapoor',
    'aarav.meera@client.vivaah.com',
    '+91 98201 11223',
    'Self (The Couple)',
    '2026-12-18',
    'Jaipur, Rajasthan',
    400,
    'Full-Service Wedding Planning',
    18000000,
    'Royal Rajputana Heritage & Champagne Gold',
    'Requires luxury fleet transfers from airport and private lakeside mandap arrangement.',
    'Confirmed',
    true
  ),
  (
    'e0000001-0000-0000-0000-000000000002',
    'Kabir Oberoi & Rhea Talwar',
    'kabir.rhea@client.vivaah.com',
    '+44 7700 900888',
    'Family Office Representative',
    '2027-01-12',
    'Lake Como, Italy',
    180,
    'Destination Wedding',
    35000000,
    'Italian Riviera Romance & Classical Strings',
    'Private speedboat flotilla and vintage open-top vintage sports car welcome.',
    'Consultation Scheduled',
    true
  ),
  (
    'e0000001-0000-0000-0000-000000000003',
    'Devendra Mehta & Sanjana Patel',
    'dev.sanjana@patelgroup.com',
    '+91 98202 33445',
    'Parents of Bride',
    '2027-02-04',
    'Udaipur, Rajasthan',
    350,
    'Full-Service Wedding Planning',
    22000000,
    'Lakeside Royal Palace & Midnight Fireworks',
    'Exclusive buyout of Lake Palace and customized culinary menu for international dignitaries.',
    'New',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 3. Weddings Seed (1 Demo Wedding Project: Aarav & Meera)
INSERT INTO public.weddings (id, enquiry_id, title, couple_names, email, phone, destination, venue, start_date, end_date, package_tier, expected_guests, actual_checkins, contract_amount, assigned_planner, status, progress, cover_image, notes, is_demo)
VALUES
  (
    'a0000001-0000-0000-0000-000000000001',
    'e0000001-0000-0000-0000-000000000001',
    'Aarav & Meera — Royal Jaipur Palace Wedding',
    'Aarav Singhania & Meera Kapoor',
    'aarav.meera@client.vivaah.com',
    '+91 98201 11223',
    'Jaipur, Rajasthan',
    'City Palace & Rambagh Palace',
    '2026-12-18',
    '2026-12-20',
    'Full-Service Wedding Planning',
    400,
    312,
    18000000,
    'Priya Sharma (Principal Planner)',
    'Planning',
    74,
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    'Exclusive celebration across Rambagh Palace courtyards and City Palace Durbar hall.',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Link enquiry to wedding
UPDATE public.enquiries
SET converted_wedding_id = 'a0000001-0000-0000-0000-000000000001'
WHERE id = 'e0000001-0000-0000-0000-000000000001';

-- 4. Tasks Seed
INSERT INTO public.tasks (id, wedding_id, title, category, assigned_member, due_date, priority, status, notes, is_demo)
VALUES
  (
    'c0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'Lock City Palace Courtyard & Execute Lease Agreement',
    'Venue',
    'Priya Sharma',
    '2026-10-15',
    'Urgent',
    'Done',
    'Lease agreement signed and ASI permissions filed.',
    true
  ),
  (
    'c0000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000001',
    'Approve 3D Mandap Scenography & Royal Velvet Drapes',
    'Decoration',
    'Priya Sharma',
    '2026-11-05',
    'High',
    'Done',
    'Couple signed off on Champagne Gold and Deep Plum palette.',
    true
  ),
  (
    'c0000001-0000-0000-0000-000000000003',
    'a0000001-0000-0000-0000-000000000001',
    'Finalize Royal Banquet Tasting with Chef Ranveer Brar',
    'Catering',
    'Arjun Verma',
    '2026-11-20',
    'High',
    'In Progress',
    'Tasting scheduled at Rambagh Palace kitchen.',
    true
  ),
  (
    'c0000001-0000-0000-0000-000000000004',
    'a0000001-0000-0000-0000-000000000001',
    'Dispatch Digital QR Boarding Passes to VIP Guest List',
    'Guest Coordination',
    'Vikram Sen',
    '2026-12-01',
    'Urgent',
    'To Plan',
    '312 confirmed RSVPs queued for digital dispatch.',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Events Seed
INSERT INTO public.events (id, wedding_id, event_name, date, start_time, end_time, location, description, dress_code, is_demo)
VALUES
  (
    'd0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'Royal Mehendi & Welcome High Tea',
    '2026-12-18',
    '14:00',
    '18:00',
    'Pari Mahal Garden, Rambagh Palace',
    'Afternoon high tea garden gathering with live Rajasthani folk musicians, artisanal bangle bazaar, and organic henna stations.',
    'Festive Indian Pastel / Florals',
    true
  ),
  (
    'd0000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000001',
    'Grand Sangeet & Musical Extravaganza',
    '2026-12-18',
    '19:30',
    '01:00',
    'Jaigarh Amphitheatre Courtyard',
    'Electrifying evening of family performances, headlining Bollywood musical artists, and midnight gourmet street food pavilion.',
    'Royal Glamour / Tuxedos & Lehengas',
    true
  ),
  (
    'd0000001-0000-0000-0000-000000000003',
    'a0000001-0000-0000-0000-000000000001',
    'Vedic Mandap Pheras Ceremony',
    '2026-12-19',
    '16:00',
    '20:00',
    'Zenana Courtyard Mandap, City Palace',
    'Sacred Vedic nuptials beneath an open-air handcrafted floral mandap, accompanied by a 21-piece classical symphony.',
    'Traditional Rajputana Royal Attire',
    true
  ),
  (
    'd0000001-0000-0000-0000-000000000004',
    'a0000001-0000-0000-0000-000000000001',
    'Durbar Hall Black-Tie Reception',
    '2026-12-20',
    '19:00',
    '23:30',
    'Durbar Hall, City Palace',
    'Formal 7-course sit-down silver banquet, wedding toasts, champagne fountains, and synchronized lakeside pyrotechnics.',
    'Black Tie / Formal Sovereign',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Guests Seed
INSERT INTO public.guests (id, wedding_id, name, phone, family_group, plus_ones, invitation_category, rsvp_status, checked_in, checked_in_at, qr_code, table_assigned, is_demo)
VALUES
  (
    'f0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'Vikramaditya Singhania',
    '+91 98200 11001',
    'Groom Immediate Family',
    2,
    'VIP Royal Patron',
    'Attending',
    true,
    '2026-12-18T14:15:00Z',
    'VIVAAH-W01-G001-SINGHANIA',
    'Table 1 - Royal Durbar',
    true
  ),
  (
    'f0000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000001',
    'Rajeshwari Kapoor',
    '+91 98200 11002',
    'Bride Immediate Family',
    1,
    'VIP Royal Patron',
    'Attending',
    true,
    '2026-12-18T14:22:00Z',
    'VIVAAH-W01-G002-KAPOOR',
    'Table 2 - Zenana Pavilion',
    true
  ),
  (
    'f0000001-0000-0000-0000-000000000003',
    'a0000001-0000-0000-0000-000000000001',
    'Dr. Alistair & Claire Sterling',
    '+44 7700 900111',
    'Distinguished VIPs',
    1,
    'VVIP Sovereign',
    'Attending',
    false,
    null,
    'VIVAAH-W01-G003-STERLING',
    'Table 3 - Ambassadors Suite',
    true
  ),
  (
    'f0000001-0000-0000-0000-000000000004',
    'a0000001-0000-0000-0000-000000000001',
    'Col. Harshavardhan Rathore',
    '+91 98200 11004',
    'Royal Extended Clan',
    3,
    'VIP Royal Patron',
    'Pending',
    false,
    null,
    'VIVAAH-W01-G004-RATHORE',
    'Table 4 - Lake Pavilion',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 7. Quotation Requests Seed (Directly targeted to Chef Ranveer Brar's vendor_id)
INSERT INTO public.quotation_requests (id, wedding_id, vendor_id, category, title, description, status, is_demo)
VALUES
  (
    '10000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000001',
    'Catering & Banqueting',
    'Multi-Day Royal Banquet & Sangeet Gala (400 Guests)',
    'Full service 3-day royal dining including Welcome Mehendi tea garden, Royal Sangeet gourmet feast, Ceremony high-tea, and Durbar Hall 7-course plated banquet.',
    'Open',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Quotations Seed
INSERT INTO public.quotations (id, request_id, wedding_id, vendor_id, price_per_plate_or_service, total_quoted_amount, service_inclusions, additional_charges, notes, status, shared_with_client, client_feedback, is_demo)
VALUES
  (
    '20000001-0000-0000-0000-000000000001',
    '10000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000001',
    9500,
    4200000,
    'Dedicated Executive Chef and 35 culinary team members; 12 Live Cooking Counters; Silver Plating banquet service for 400 covers across 3 days.',
    300000,
    'Executive chef has guaranteed personal supervision.',
    'Confirmed',
    true,
    'Aarav & Meera loved the Rajputana Royal Thali tasting.',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 8. Client Payments Seed (Milestones total exactly 18,000,000)
INSERT INTO public.client_payments (id, wedding_id, milestone_name, amount, due_date, paid_date, status, payment_method, reference_no, is_demo)
VALUES
  (
    '30000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'Booking Advance Deposit (20%)',
    3600000,
    '2026-09-20',
    '2026-09-18',
    'Received',
    'RTGS Wire Transfer',
    'RTGS-HDFC-9920141',
    true
  ),
  (
    '30000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000001',
    'Venue & Scenography Production Lock (40%)',
    7200000,
    '2026-10-30',
    '2026-10-28',
    'Received',
    'RTGS Wire Transfer',
    'RTGS-ICICI-4882104',
    true
  ),
  (
    '30000001-0000-0000-0000-000000000003',
    'a0000001-0000-0000-0000-000000000001',
    'Vendor Advances & Operations (25%)',
    4500000,
    '2026-11-30',
    null,
    'Pending',
    'RTGS Wire Transfer',
    'INV-W01-MIL-03',
    true
  ),
  (
    '30000001-0000-0000-0000-000000000004',
    'a0000001-0000-0000-0000-000000000001',
    'Post-Reception Audit & Final Settlement (15%)',
    2700000,
    '2026-12-28',
    null,
    'Pending',
    'RTGS Wire Transfer',
    'INV-W01-MIL-04',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 9. Vendor Payments Seed
INSERT INTO public.vendor_payments (id, wedding_id, vendor_id, milestone_name, agreed_amount, amount_paid, additional_charges, balance_due, status, due_date, is_demo)
VALUES
  (
    '40000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000001',
    'Catering Procurement Lock (60%)',
    4200000,
    2500000,
    0,
    1700000,
    'Partially Paid',
    '2026-11-25',
    true
  ),
  (
    '40000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000002',
    'Mandap Floral Production Advance (50%)',
    3000000,
    1500000,
    0,
    1500000,
    'Partially Paid',
    '2026-11-20',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 10. Expenses Seed
INSERT INTO public.expenses (id, wedding_id, category, description, amount, recorded_by, is_demo)
VALUES
  (
    '50000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'Venue Licensing',
    'ASI Heritage Monument special lighting and late-night acoustic permission fees.',
    250000,
    'Siddharth Goenka',
    true
  ),
  (
    '50000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000001',
    'Logistics & Chauffeur Fleet',
    'Luxury Volvo shuttle transfers and airport reception desk fleet for arriving VIPs.',
    480000,
    'Siddharth Goenka',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 11. Documents Seed
INSERT INTO public.documents (id, wedding_id, file_name, file_url, category, file_size, uploaded_by, is_demo)
VALUES
  (
    '60000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'Master_Service_Agreement_Singhania.pdf',
    '/documents/Master_Service_Agreement_Singhania.pdf',
    'Client Agreement',
    '3.4 MB',
    'Pooja Singhania',
    true
  ),
  (
    '60000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000001',
    'City_Palace_Heritage_Lease_Contract.pdf',
    '/documents/City_Palace_Heritage_Lease_Contract.pdf',
    'Permits & Licenses',
    '5.1 MB',
    'Siddharth Goenka',
    true
  ),
  (
    '60000001-0000-0000-0000-000000000003',
    'a0000001-0000-0000-0000-000000000001',
    'Royal_Feast_Catering_Bespoke_Quote.pdf',
    '/documents/Royal_Feast_Catering_Bespoke_Quote.pdf',
    'Vendor Quotation',
    '2.8 MB',
    'Chef Ranveer Brar',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 12. Wedding Vendors Seed (Confirmed Assignments for Aarav & Meera)
INSERT INTO public.wedding_vendors (id, wedding_id, vendor_id, category, agreed_amount, contract_status, is_demo)
VALUES
  (
    '70000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000001',
    'Catering',
    4200000,
    'Confirmed',
    true
  ),
  (
    '70000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000002',
    'Decoration & Scenography',
    3000000,
    'Confirmed',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 13. Vendor Arrivals Seed
INSERT INTO public.vendor_arrivals (id, event_id, wedding_id, vendor_id, expected_time, arrival_status, actual_arrival_time, coordinator_notes, is_demo)
VALUES
  (
    '80000001-0000-0000-0000-000000000001',
    'd0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000001',
    '12:00',
    'Arrived',
    '11:45',
    'Catering logistics team arrived on schedule with cold storage fleet.',
    true
  ),
  (
    '80000001-0000-0000-0000-000000000002',
    'd0000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'b0000001-0000-0000-0000-000000000002',
    '10:00',
    'Arrived',
    '09:50',
    'Floral mandap staging started early in the Pari Mahal garden.',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 14. Activity Logs Seed
INSERT INTO public.activity_logs (id, wedding_id, action, actor_name, details, is_demo)
VALUES
  (
    '90000001-0000-0000-0000-000000000001',
    'a0000001-0000-0000-0000-000000000001',
    'Project Initialized',
    'Priya Sharma',
    'Wedding project established from confirmed enquiry e0000001-0000-0000-0000-000000000001.',
    true
  ),
  (
    '90000001-0000-0000-0000-000000000002',
    'a0000001-0000-0000-0000-000000000001',
    'Milestone Payment Received',
    'Finance Desk',
    'Payment RTGS-HDFC-9920141 recorded for Booking Advance Deposit (20%).',
    true
  )
ON CONFLICT (id) DO NOTHING;
