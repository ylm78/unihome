/*
  # Fix RLS infinite recursion

  1. Remove all problematic policies
  2. Create simple, non-recursive policies
  3. Fix admin access without circular references
*/

-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "Enable all for admin users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own data" ON user_profiles;

-- Drop problematic policies on orders and quotes
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;

DROP POLICY IF EXISTS "Admins can view all quotes" ON quotes;
DROP POLICY IF EXISTS "Users can view own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can create own quotes" ON quotes;
DROP POLICY IF EXISTS "Admins can update all quotes" ON quotes;

-- Create simple, non-recursive policies for user_profiles
CREATE POLICY "Allow admin full access to user_profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::json->>'email')::text = 'arifxhakan78@gmail.com'
  )
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::json->>'email')::text = 'arifxhakan78@gmail.com'
  );

CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create simple policies for orders
CREATE POLICY "Admin can access all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::json->>'email')::text = 'arifxhakan78@gmail.com'
  )
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::json->>'email')::text = 'arifxhakan78@gmail.com'
  );

CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create simple policies for quotes
CREATE POLICY "Admin can access all quotes"
  ON quotes
  FOR ALL
  TO authenticated
  USING (
    (current_setting('request.jwt.claims', true)::json->>'email')::text = 'arifxhakan78@gmail.com'
  )
  WITH CHECK (
    (current_setting('request.jwt.claims', true)::json->>'email')::text = 'arifxhakan78@gmail.com'
  );

CREATE POLICY "Users can view own quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create quotes"
  ON quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);