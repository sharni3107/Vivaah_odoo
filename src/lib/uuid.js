/**
 * Validates whether a value is a standard RFC 4122 UUID (version 1-5 hex with hyphens).
 * Useful for guarding Supabase PostgreSQL queries against string demo IDs like 'task-001', 'gst-005', 'arr-001'.
 *
 * @param {*} val
 * @returns {boolean}
 */
export const isUUID = (val) => {
  return typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
};
