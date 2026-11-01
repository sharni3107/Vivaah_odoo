-- ==============================================================================
-- VIVAAH — TARGETED HACKATHON ROLLBACK SCRIPT
-- ==============================================================================
-- IMPORTANT NOTE:
-- This script performs a targeted cleanup of the policies, triggers, views, and
-- exact demonstration records added during this migration. It does NOT destroy
-- the underlying 16 tables, does NOT use CASCADE, and does NOT affect genuine
-- production client data.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- STEP 1: DROP DEPENDENT RLS POLICIES (Must precede dropping helper functions)
-- ------------------------------------------------------------------------------
-- Profiles
DROP POLICY IF EXISTS "Profiles view policy" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;

-- Enquiries
DROP POLICY IF EXISTS "Public enquiry submit" ON public.enquiries;
DROP POLICY IF EXISTS "Agency enquiry management" ON public.enquiries;

-- Weddings
DROP POLICY IF EXISTS "Agency wedding management" ON public.weddings;
DROP POLICY IF EXISTS "Client view own wedding" ON public.weddings;
DROP POLICY IF EXISTS "Vendor view assigned wedding summary" ON public.weddings;

-- Tasks
DROP POLICY IF EXISTS "Agency task management" ON public.tasks;
DROP POLICY IF EXISTS "Client view wedding tasks" ON public.tasks;

-- Vendors
DROP POLICY IF EXISTS "Agency vendor management" ON public.vendors;
DROP POLICY IF EXISTS "Vendor view own record" ON public.vendors;
DROP POLICY IF EXISTS "Vendor update own record" ON public.vendors;
DROP POLICY IF EXISTS "Public vendor directory view" ON public.vendors;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.vendors;
DROP POLICY IF EXISTS "Public view active vendors" ON public.vendors;
DROP POLICY IF EXISTS "Allow public read access" ON public.vendors;

-- Quotation Requests
DROP POLICY IF EXISTS "Agency quotation requests management" ON public.quotation_requests;
DROP POLICY IF EXISTS "Vendor view assigned quotation requests" ON public.quotation_requests;
DROP POLICY IF EXISTS "Vendor view relevant quotation requests" ON public.quotation_requests;

-- Quotations
DROP POLICY IF EXISTS "Agency quotation management" ON public.quotations;
DROP POLICY IF EXISTS "Client view shared quotations" ON public.quotations;
DROP POLICY IF EXISTS "Client approve shared quotations" ON public.quotations;
DROP POLICY IF EXISTS "Client feedback on shared quotations" ON public.quotations;
DROP POLICY IF EXISTS "Vendor view own quotations" ON public.quotations;
DROP POLICY IF EXISTS "Vendor insert/update own quotations" ON public.quotations;
DROP POLICY IF EXISTS "Vendor quotation management" ON public.quotations;

-- Wedding Vendors
DROP POLICY IF EXISTS "Agency wedding vendors management" ON public.wedding_vendors;
DROP POLICY IF EXISTS "Client view confirmed vendors" ON public.wedding_vendors;
DROP POLICY IF EXISTS "Vendor view assignments" ON public.wedding_vendors;

-- Guests
DROP POLICY IF EXISTS "Agency guest management" ON public.guests;
DROP POLICY IF EXISTS "Client guest access" ON public.guests;
DROP POLICY IF EXISTS "Client guest management" ON public.guests;

-- Events
DROP POLICY IF EXISTS "Agency events management" ON public.events;
DROP POLICY IF EXISTS "Client view events" ON public.events;
DROP POLICY IF EXISTS "Vendor view assigned events" ON public.events;

-- Vendor Arrivals
DROP POLICY IF EXISTS "Agency vendor arrivals" ON public.vendor_arrivals;
DROP POLICY IF EXISTS "Agency vendor arrivals management" ON public.vendor_arrivals;
DROP POLICY IF EXISTS "Vendor arrival update" ON public.vendor_arrivals;
DROP POLICY IF EXISTS "Vendor manage arrivals" ON public.vendor_arrivals;
DROP POLICY IF EXISTS "Vendor view assigned arrivals" ON public.vendor_arrivals;
DROP POLICY IF EXISTS "Vendor update assigned arrivals" ON public.vendor_arrivals;

-- Client Payments
DROP POLICY IF EXISTS "Agency client payment management" ON public.client_payments;
DROP POLICY IF EXISTS "Client view own payments" ON public.client_payments;

-- Vendor Payments
DROP POLICY IF EXISTS "Agency vendor payments" ON public.vendor_payments;
DROP POLICY IF EXISTS "Agency vendor payment management" ON public.vendor_payments;
DROP POLICY IF EXISTS "Vendor view own payments" ON public.vendor_payments;

-- Expenses
DROP POLICY IF EXISTS "Agency expenses" ON public.expenses;
DROP POLICY IF EXISTS "Agency expenses management" ON public.expenses;

-- Documents
DROP POLICY IF EXISTS "Agency documents management" ON public.documents;
DROP POLICY IF EXISTS "Client view wedding documents" ON public.documents;
DROP POLICY IF EXISTS "Vendor view contract documents" ON public.documents;

-- Activity Logs
DROP POLICY IF EXISTS "Agency activity logs management" ON public.activity_logs;

-- ------------------------------------------------------------------------------
-- STEP 2: DROP TRIGGERS AND FUNCTIONS (Triggers dropped first, then functions)
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_protect_vendor_arrival_fields ON public.vendor_arrivals;
DROP FUNCTION IF EXISTS public.protect_vendor_arrival_fields();

DROP TRIGGER IF EXISTS trg_protect_quotation_fields ON public.quotations;
DROP FUNCTION IF EXISTS public.protect_quotation_fields();

DROP TRIGGER IF EXISTS trg_protect_vendor_fields ON public.vendors;
DROP FUNCTION IF EXISTS public.protect_vendor_fields();

DROP TRIGGER IF EXISTS trg_protect_profile_fields ON public.profiles;
DROP FUNCTION IF EXISTS public.protect_profile_fields();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

DROP FUNCTION IF EXISTS public.is_agency_user();
DROP FUNCTION IF EXISTS public.get_current_vendor_id();
DROP FUNCTION IF EXISTS public.get_current_client_wedding_id();

-- ------------------------------------------------------------------------------
-- STEP 3: DROP RESTRICTED VIEW
-- ------------------------------------------------------------------------------
DROP VIEW IF EXISTS public.public_vendor_directory;

-- ------------------------------------------------------------------------------
-- STEP 4: DELETE TARGETED DEMO RECORDS (Child-to-Parent Order, strictly checking is_demo = true)
-- ------------------------------------------------------------------------------

-- 1. Activity Logs (Leaf)
DELETE FROM public.activity_logs 
WHERE id IN (
  '90000001-0000-0000-0000-000000000001',
  '90000001-0000-0000-0000-000000000002'
) AND is_demo = true;

-- 2. Vendor Arrivals (Depends on events, weddings, vendors)
DELETE FROM public.vendor_arrivals 
WHERE id IN (
  '80000001-0000-0000-0000-000000000001',
  '80000001-0000-0000-0000-000000000002'
) AND is_demo = true;

-- 3. Wedding Vendors (Depends on weddings, vendors)
DELETE FROM public.wedding_vendors 
WHERE id IN (
  '70000001-0000-0000-0000-000000000001',
  '70000001-0000-0000-0000-000000000002'
) AND is_demo = true;

-- 4. Documents (Depends on weddings)
DELETE FROM public.documents 
WHERE id IN (
  '60000001-0000-0000-0000-000000000001',
  '60000001-0000-0000-0000-000000000002',
  '60000001-0000-0000-0000-000000000003'
) AND is_demo = true;

-- 5. Expenses (Depends on weddings)
DELETE FROM public.expenses 
WHERE id IN (
  '50000001-0000-0000-0000-000000000001',
  '50000001-0000-0000-0000-000000000002'
) AND is_demo = true;

-- 6. Vendor Payments (Depends on weddings, vendors)
DELETE FROM public.vendor_payments 
WHERE id IN (
  '40000001-0000-0000-0000-000000000001',
  '40000001-0000-0000-0000-000000000002'
) AND is_demo = true;

-- 7. Client Payments (Depends on weddings)
DELETE FROM public.client_payments 
WHERE id IN (
  '30000001-0000-0000-0000-000000000001',
  '30000001-0000-0000-0000-000000000002',
  '30000001-0000-0000-0000-000000000003',
  '30000001-0000-0000-0000-000000000004'
) AND is_demo = true;

-- 8. Quotations (Depends on quotation_requests, weddings, vendors)
DELETE FROM public.quotations 
WHERE id IN (
  '20000001-0000-0000-0000-000000000001'
) AND is_demo = true;

-- 9. Quotation Requests (Depends on weddings)
DELETE FROM public.quotation_requests 
WHERE id IN (
  '10000001-0000-0000-0000-000000000001'
) AND is_demo = true;

-- 10. Guests (Depends on weddings)
DELETE FROM public.guests 
WHERE id IN (
  'f0000001-0000-0000-0000-000000000001',
  'f0000001-0000-0000-0000-000000000002',
  'f0000001-0000-0000-0000-000000000003',
  'f0000001-0000-0000-0000-000000000004'
) AND is_demo = true;

-- 11. Events (Depends on weddings)
DELETE FROM public.events 
WHERE id IN (
  'd0000001-0000-0000-0000-000000000001',
  'd0000001-0000-0000-0000-000000000002',
  'd0000001-0000-0000-0000-000000000003',
  'd0000001-0000-0000-0000-000000000004'
) AND is_demo = true;

-- 12. Tasks (Depends on weddings)
DELETE FROM public.tasks 
WHERE id IN (
  'c0000001-0000-0000-0000-000000000001',
  'c0000001-0000-0000-0000-000000000002',
  'c0000001-0000-0000-0000-000000000003',
  'c0000001-0000-0000-0000-000000000004'
) AND is_demo = true;

-- 13. Break Circular Enquiry-Wedding Link
UPDATE public.enquiries 
SET converted_wedding_id = NULL 
WHERE id = 'e0000001-0000-0000-0000-000000000001' AND is_demo = true;

-- 14. Weddings (Parent of tasks, events, guests, etc.; Depends on enquiries)
DELETE FROM public.weddings 
WHERE id IN (
  'a0000001-0000-0000-0000-000000000001'
) AND is_demo = true;

-- 15. Enquiries
DELETE FROM public.enquiries 
WHERE id IN (
  'e0000001-0000-0000-0000-000000000001',
  'e0000001-0000-0000-0000-000000000002',
  'e0000001-0000-0000-0000-000000000003'
) AND is_demo = true;

-- 16. Vendors
DELETE FROM public.vendors 
WHERE id IN (
  'b0000001-0000-0000-0000-000000000001',
  'b0000001-0000-0000-0000-000000000002',
  'b0000001-0000-0000-0000-000000000003',
  'b0000001-0000-0000-0000-000000000004'
) AND is_demo = true;
