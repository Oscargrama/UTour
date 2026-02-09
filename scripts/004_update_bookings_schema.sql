-- Update bookings table to add new fields for enhanced booking system

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'spanish' CHECK (language IN ('spanish', 'english')),
ADD COLUMN IF NOT EXISTS has_minors BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS booking_reference TEXT UNIQUE;

-- Create booking reference generator function
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
BEGIN
  ref := 'YT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN ref;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_reference IS NULL THEN
    NEW.booking_reference := generate_booking_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS booking_reference_trigger ON bookings;
CREATE TRIGGER booking_reference_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_reference();

-- Add index for booking reference
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
