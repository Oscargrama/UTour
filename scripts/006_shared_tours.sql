-- Add booking mode and seat availability for shared tours (Uber Pool style)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_mode TEXT DEFAULT 'full_group' CHECK (booking_mode IN ('full_group', 'join_group'));
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS available_seats INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS is_group_open BOOLEAN DEFAULT false;

-- Create index for finding open groups
CREATE INDEX IF NOT EXISTS idx_bookings_open_groups ON bookings(tour_type, date, is_group_open) WHERE is_group_open = true AND status = 'confirmed';
