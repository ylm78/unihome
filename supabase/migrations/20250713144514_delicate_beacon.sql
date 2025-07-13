/*
  # Fix Admin Permissions and Relations

  1. Foreign Key Relations
    - Add missing foreign key between quotes and user_profiles
    - Add missing foreign key between orders and user_profiles
    - Ensure proper naming for Supabase PostgREST

  2. RLS Policies
    - Add admin policies for user_profiles table
    - Add admin policies for quotes table  
    - Add admin policies for orders table
    - Allow admins to read all data

  3. Security
    - Enable RLS on all tables
    - Create admin-specific policies
    - Maintain user privacy for non-admins
*/

-- First, let's add the missing foreign key constraints with proper names
DO $$
BEGIN
  -- Add foreign key for quotes -> user_profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'quotes_user_id_fkey' 
    AND table_name = 'quotes'
  ) THEN
    ALTER TABLE quotes 
    ADD CONSTRAINT quotes_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key for orders -> user_profiles if it doesn't exist  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'orders_user_id_fkey' 
    AND table_name = 'orders'
  ) THEN
    ALTER TABLE orders 
    ADD CONSTRAINT orders_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable RLS on user_profiles if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users if admin or self" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Read own profile" ON user_profiles;

-- Create comprehensive admin policy for user_profiles
CREATE POLICY "Admins can view all user profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Allow if user is admin (check role in user_profiles)
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
    OR
    -- Allow users to see their own profile
    auth.uid() = id
  );

-- Create admin update policy for user_profiles
CREATE POLICY "Admins can update all user profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
    OR
    auth.uid() = id
  );

-- Ensure quotes policies allow admin access
DROP POLICY IF EXISTS "Admins can view all quotes" ON quotes;
CREATE POLICY "Admins can view all quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
    OR
    auth.uid() = user_id
  );

-- Ensure orders policies allow admin access  
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
    OR
    auth.uid() = user_id
  );

-- Create a function to check if user is admin (for easier policy management)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;