-- ==============================================================================
-- VIVAAH — TRANSACTION-SAFE ATOMIC GUEST CHECK-IN & STORAGE RPC FUNCTIONS
-- ==============================================================================
-- This script adds the atomic PostgreSQL RPC functions for guest check-in and
-- undo check-in to guarantee single-transaction consistency with weddings.actual_checkins.
-- ==============================================================================

-- 1. Atomic Guest Check-in Function
-- Takes either a guest UUID or a QR code string.
-- Atomically marks guest as checked_in, records checked_in_at, and recalculates
-- weddings.actual_checkins (including plus_ones) in a single atomic transaction.
CREATE OR REPLACE FUNCTION public.check_in_guest(
  p_guest_id UUID DEFAULT NULL,
  p_qr_code TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_guest public.guests%ROWTYPE;
  v_wedding_id UUID;
  v_total_checkins INT;
BEGIN
  -- Locate the guest record with row-level lock FOR UPDATE
  IF p_guest_id IS NOT NULL THEN
    SELECT * INTO v_guest FROM public.guests WHERE id = p_guest_id FOR UPDATE;
  ELSIF p_qr_code IS NOT NULL AND trim(p_qr_code) <> '' THEN
    SELECT * INTO v_guest FROM public.guests WHERE qr_code = trim(p_qr_code) FOR UPDATE;
  ELSE
    RETURN jsonb_build_object('success', false, 'message', 'Invalid parameter: guest_id or qr_code required');
  END IF;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Guest record not found');
  END IF;

  -- Prevent duplicate check-ins
  IF v_guest.checked_in THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', format('Duplicate check-in prevented. %s already checked in at %s.', v_guest.name, to_char(v_guest.checked_in_at, 'HH12:MI AM')),
      'guest', to_jsonb(v_guest)
    );
  END IF;

  v_wedding_id := v_guest.wedding_id;

  -- Mark guest as checked in
  UPDATE public.guests
  SET
    checked_in = true,
    checked_in_at = now()
  WHERE id = v_guest.id
  RETURNING * INTO v_guest;

  -- Recalculate actual check-ins for this wedding in the same transaction
  SELECT COALESCE(SUM(1 + COALESCE(plus_ones, 0)), 0)
  INTO v_total_checkins
  FROM public.guests
  WHERE wedding_id = v_wedding_id
    AND checked_in = true;

  -- Update weddings table atomically
  UPDATE public.weddings
  SET actual_checkins = v_total_checkins
  WHERE id = v_wedding_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', format('Successfully checked in %s (+%s accompanying)!', v_guest.name, v_guest.plus_ones),
    'guest', to_jsonb(v_guest),
    'actual_checkins', v_total_checkins
  );
END;
$$;

-- 2. Atomic Undo Guest Check-in Function
CREATE OR REPLACE FUNCTION public.undo_guest_check_in(
  p_guest_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_guest public.guests%ROWTYPE;
  v_wedding_id UUID;
  v_total_checkins INT;
BEGIN
  IF p_guest_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Invalid parameter: guest_id required');
  END IF;

  SELECT * INTO v_guest FROM public.guests WHERE id = p_guest_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Guest record not found');
  END IF;

  IF NOT v_guest.checked_in THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', format('%s is not currently checked in.', v_guest.name),
      'guest', to_jsonb(v_guest)
    );
  END IF;

  v_wedding_id := v_guest.wedding_id;

  -- Reverse check-in status
  UPDATE public.guests
  SET
    checked_in = false,
    checked_in_at = null
  WHERE id = v_guest.id
  RETURNING * INTO v_guest;

  -- Recalculate actual check-ins atomically
  SELECT COALESCE(SUM(1 + COALESCE(plus_ones, 0)), 0)
  INTO v_total_checkins
  FROM public.guests
  WHERE wedding_id = v_wedding_id
    AND checked_in = true;

  UPDATE public.weddings
  SET actual_checkins = v_total_checkins
  WHERE id = v_wedding_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', format('Check-in reversed for %s', v_guest.name),
    'guest', to_jsonb(v_guest),
    'actual_checkins', v_total_checkins
  );
END;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.check_in_guest(UUID, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.undo_guest_check_in(UUID) TO authenticated, service_role;
