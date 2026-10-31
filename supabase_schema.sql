-- ==============================================================================
-- VIVAAH — UNIFIED WEDDING AGENCY PLATFORM
-- Supabase PostgreSQL Relational Schema & Row Level Security
-- ==============================================================================

-- 1. ENUMS (Safe creation)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'admin',
    'enquiry_executive',
    'wedding_planner',
    'event_coordinator',
    'finance_executive',
    'client',
    'vendor'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE enquiry_status AS ENUM (
    'New',
    'Contacted',
    'Follow-up',
    'Consultation Scheduled',
    'Confirmed',
    'Lost'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE task_status AS ENUM (
    'To Plan',
    'In Progress',
    'Review',
    'Done'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE task_priority AS ENUM (
    'Low',
    'Medium',
    'High',
    'Urgent'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE quotation_status AS ENUM (
    'Draft',
    'Submitted',
    'Shared with Client',
    'Client Approved',
    'Client Rejected',
    'Confirmed',
    'Closed'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE rsvp_status AS ENUM (
    'Attending',
    'Declined',
    'Pending'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE arrival_status AS ENUM (
    'Expected',
    'Arrived',
    'Delayed',
    'Not Arrived'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. THE 16 REQUIRED TABLES
-- ==============================================================================

-- TABLE 1: PROFILES (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'wedding_planner',
  phone TEXT,
  avatar_url TEXT,
  vendor_id UUID, -- For vendor accounts
  wedding_id UUID, -- For client accounts
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 2: ENQUIRIES
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_names TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  represented_by TEXT DEFAULT 'Self (The Couple)',
  wedding_date DATE NOT NULL,
  destination TEXT NOT NULL,
  expected_guests INT NOT NULL DEFAULT 200,
  package_type TEXT NOT NULL DEFAULT 'Full-Service Wedding Planning',
  estimated_budget NUMERIC NOT NULL DEFAULT 15000000,
  preferred_theme TEXT,
  additional_requirements TEXT,
  status enquiry_status NOT NULL DEFAULT 'New',
  assigned_executive_id UUID REFERENCES public.profiles(id),
  notes JSONB DEFAULT '[]'::jsonb,
  converted_wedding_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 3: WEDDINGS
CREATE TABLE IF NOT EXISTS public.weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID REFERENCES public.enquiries(id),
  title TEXT NOT NULL,
  couple_names TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  package_tier TEXT NOT NULL DEFAULT 'Full-Service Wedding Planning',
  expected_guests INT NOT NULL DEFAULT 400,
  actual_checkins INT DEFAULT 0,
  contract_amount NUMERIC NOT NULL DEFAULT 18000000,
  assigned_planner_id UUID REFERENCES public.profiles(id),
  client_user_id UUID REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'Planning',
  cover_image TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 4: TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  assigned_member TEXT NOT NULL,
  due_date DATE NOT NULL,
  priority task_priority NOT NULL DEFAULT 'Medium',
  status task_status NOT NULL DEFAULT 'To Plan',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 5: VENDORS
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  services TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  vendor_user_id UUID REFERENCES public.profiles(id),
  rating NUMERIC DEFAULT 4.9,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 6: QUOTATION REQUESTS
CREATE TABLE IF NOT EXISTS public.quotation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 7: QUOTATIONS
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.quotation_requests(id) ON DELETE CASCADE,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  price_per_plate_or_service NUMERIC NOT NULL,
  total_quoted_amount NUMERIC NOT NULL,
  service_inclusions TEXT NOT NULL,
  additional_charges NUMERIC DEFAULT 0,
  notes TEXT,
  proposal_pdf_url TEXT,
  status quotation_status NOT NULL DEFAULT 'Submitted',
  shared_with_client BOOLEAN DEFAULT FALSE,
  client_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 8: WEDDING VENDORS (Confirmed assignments)
CREATE TABLE IF NOT EXISTS public.wedding_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  agreed_amount NUMERIC NOT NULL,
  contract_status TEXT NOT NULL DEFAULT 'Confirmed',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 9: GUESTS
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  family_group TEXT NOT NULL DEFAULT 'General',
  plus_ones INT NOT NULL DEFAULT 0,
  invitation_category TEXT NOT NULL DEFAULT 'VIP',
  functions_attending TEXT[] DEFAULT ARRAY['All'],
  rsvp_status rsvp_status NOT NULL DEFAULT 'Pending',
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  qr_code TEXT NOT NULL,
  table_assigned TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 10: EVENTS
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  dress_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 11: VENDOR ARRIVALS
CREATE TABLE IF NOT EXISTS public.vendor_arrivals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  expected_time TIME NOT NULL,
  arrival_status arrival_status NOT NULL DEFAULT 'Expected',
  actual_arrival_time TIME,
  coordinator_notes TEXT,
  reported_issue TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 12: CLIENT PAYMENTS
CREATE TABLE IF NOT EXISTS public.client_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  milestone_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT NOT NULL DEFAULT 'Pending',
  payment_method TEXT,
  reference_no TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 13: VENDOR PAYMENTS
CREATE TABLE IF NOT EXISTS public.vendor_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  milestone_name TEXT NOT NULL,
  agreed_amount NUMERIC NOT NULL,
  amount_paid NUMERIC NOT NULL DEFAULT 0,
  additional_charges NUMERIC NOT NULL DEFAULT 0,
  balance_due NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 14: EXPENSES
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  recorded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 15: DOCUMENTS
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  category TEXT NOT NULL,
  file_size TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 16: ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES public.weddings(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

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

-- Helper function to check if current user is agency employee
CREATE OR REPLACE FUNCTION public.is_agency_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'wedding_planner', 'event_coordinator', 'finance_executive', 'enquiry_executive')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Users can read own profile; agency can read all profiles
CREATE POLICY "Profiles view policy" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_agency_user());

CREATE POLICY "Profiles update policy" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_agency_user());

-- Enquiries: Public can create enquiry (for public website form); agency can manage all
CREATE POLICY "Public enquiry submit" ON public.enquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Agency enquiry management" ON public.enquiries
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

-- Weddings: Agency can manage all; Clients can ONLY view their own wedding
CREATE POLICY "Agency wedding management" ON public.weddings
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Client view own wedding" ON public.weddings
  FOR SELECT USING (client_user_id = auth.uid());

-- Quotations:
-- 1. Agency manages all quotations
CREATE POLICY "Agency quotation management" ON public.quotations
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

-- 2. Clients can ONLY see quotations shared with them for their wedding
CREATE POLICY "Client view shared quotations" ON public.quotations
  FOR SELECT USING (
    shared_with_client = true
    AND wedding_id IN (SELECT id FROM public.weddings WHERE client_user_id = auth.uid())
  );

-- 3. Clients can update feedback/approval on shared quotations
CREATE POLICY "Client approve shared quotations" ON public.quotations
  FOR UPDATE USING (
    shared_with_client = true
    AND wedding_id IN (SELECT id FROM public.weddings WHERE client_user_id = auth.uid())
  );

-- 4. Vendors can ONLY see and update their own quotations
CREATE POLICY "Vendor view own quotations" ON public.quotations
  FOR SELECT USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE vendor_user_id = auth.uid())
  );

CREATE POLICY "Vendor insert/update own quotations" ON public.quotations
  FOR ALL USING (
    vendor_id IN (SELECT id FROM public.vendors WHERE vendor_user_id = auth.uid())
  );

-- Tasks: Agency manages all; Clients view tasks for their wedding
CREATE POLICY "Agency task management" ON public.tasks
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Client view wedding tasks" ON public.tasks
  FOR SELECT USING (wedding_id IN (SELECT id FROM public.weddings WHERE client_user_id = auth.uid()));

-- Guests: Agency manages all; Clients view/add guests for their wedding
CREATE POLICY "Agency guest management" ON public.guests
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Client guest access" ON public.guests
  FOR ALL USING (wedding_id IN (SELECT id FROM public.weddings WHERE client_user_id = auth.uid()));

-- Client Payments: Agency manages; Client views own
CREATE POLICY "Agency client payment management" ON public.client_payments
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Client view own payments" ON public.client_payments
  FOR SELECT USING (wedding_id IN (SELECT id FROM public.weddings WHERE client_user_id = auth.uid()));

-- Vendor Payments & Expenses: Agency only (Clients and other vendors NEVER see expenses or internal finances)
CREATE POLICY "Agency vendor payments" ON public.vendor_payments
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Agency expenses" ON public.expenses
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

-- Vendor Arrivals: Agency manages; Vendors view/update their own arrival status
CREATE POLICY "Agency vendor arrivals" ON public.vendor_arrivals
  FOR ALL USING (public.is_agency_user() OR auth.role() = 'service_role');

CREATE POLICY "Vendor arrival update" ON public.vendor_arrivals
  FOR UPDATE USING (vendor_id IN (SELECT id FROM public.vendors WHERE vendor_user_id = auth.uid()));

-- Storage Buckets Creation (Run once in Supabase Storage UI or SQL)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('agreements', 'agreements', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('quotations', 'quotations', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('invoices', 'invoices', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false);
