-- Add currency display fields to bookings
-- Execute in Supabase SQL Editor

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS display_currency text DEFAULT 'COP',
  ADD COLUMN IF NOT EXISTS display_total numeric;

