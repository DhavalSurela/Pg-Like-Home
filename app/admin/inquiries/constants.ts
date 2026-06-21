// Inquiry lifecycle, mirroring the DB check constraint
// (status in ('new', 'responded', 'closed')).
export const INQUIRY_STATUSES = ["new", "responded", "closed"] as const;
