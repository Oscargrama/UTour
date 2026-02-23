-- Add "user" role to the multi-role model while keeping existing roles intact.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'users'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
    ALTER TABLE users
      ADD CONSTRAINT users_role_check
      CHECK (role IN ('admin', 'guide', 'ambassador', 'user'));

    ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';
    UPDATE users SET role = 'user' WHERE role IS NULL;
  END IF;
END $$;
