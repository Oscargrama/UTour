-- Multi-Role User System for YouTour
-- Roles: admin, guide, ambassador

-- Users table with role-based access
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'guide', 'ambassador')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guides table with detailed information
CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_number TEXT NOT NULL,
  document_issue_date DATE NOT NULL,
  birth_date DATE NOT NULL,
  age INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM AGE(birth_date))) STORED,
  phone TEXT NOT NULL,
  has_vehicle BOOLEAN DEFAULT false,
  available_tours TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Ambassadors table with referral information
CREATE TABLE IF NOT EXISTS ambassadors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_number TEXT NOT NULL,
  phone TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  referral_code UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
  commission_rate DECIMAL(5, 2) DEFAULT 10.00,
  total_earnings DECIMAL(10, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Commissions table to track ambassador earnings
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ambassador_id UUID REFERENCES ambassadors(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(booking_id)
);

-- Update bookings table to add guide and ambassador references
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guide_id UUID REFERENCES guides(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ambassador_id UUID REFERENCES ambassadors(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS referral_code UUID;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_guides_user_id ON guides(user_id);
CREATE INDEX IF NOT EXISTS idx_guides_status ON guides(status);
CREATE INDEX IF NOT EXISTS idx_ambassadors_user_id ON ambassadors(user_id);
CREATE INDEX IF NOT EXISTS idx_ambassadors_referral_code ON ambassadors(referral_code);
CREATE INDEX IF NOT EXISTS idx_ambassadors_username ON ambassadors(username);
CREATE INDEX IF NOT EXISTS idx_commissions_ambassador_id ON commissions(ambassador_id);
CREATE INDEX IF NOT EXISTS idx_commissions_booking_id ON commissions(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guide_id ON bookings(guide_id);
CREATE INDEX IF NOT EXISTS idx_bookings_ambassador_id ON bookings(ambassador_id);
CREATE INDEX IF NOT EXISTS idx_bookings_referral_code ON bookings(referral_code);

-- Function to update ambassador earnings
CREATE OR REPLACE FUNCTION update_ambassador_earnings()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    UPDATE ambassadors
    SET total_earnings = total_earnings + NEW.amount
    WHERE id = NEW.ambassador_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update ambassador earnings
DROP TRIGGER IF EXISTS commission_paid_trigger ON commissions;
CREATE TRIGGER commission_paid_trigger
  AFTER UPDATE ON commissions
  FOR EACH ROW
  EXECUTE FUNCTION update_ambassador_earnings();

-- Function to create commission when booking is completed
CREATE OR REPLACE FUNCTION create_commission_on_booking_complete()
RETURNS TRIGGER AS $$
DECLARE
  ambassador_commission_rate DECIMAL(5, 2);
  commission_amount DECIMAL(10, 2);
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.ambassador_id IS NOT NULL THEN
    SELECT commission_rate INTO ambassador_commission_rate
    FROM ambassadors
    WHERE id = NEW.ambassador_id;
    
    commission_amount := NEW.total_price * (ambassador_commission_rate / 100);
    
    INSERT INTO commissions (ambassador_id, booking_id, amount)
    VALUES (NEW.ambassador_id, NEW.id, commission_amount)
    ON CONFLICT (booking_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create commissions
DROP TRIGGER IF EXISTS booking_completed_commission_trigger ON bookings;
CREATE TRIGGER booking_completed_commission_trigger
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_commission_on_booking_complete();
