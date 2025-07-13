/*
  # Fix infinite recursion in user_profiles policies

  1. Problem
    - Infinite recursion detected in policy for relation "user_profiles"
    - Circular dependency in RLS policies when accessing quotes

  2. Solution
    - Remove problematic policies that cause recursion
    - Create simpler, non-recursive policies
    - Ensure admin access without circular references
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Enable read access for all users" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Simple admin policy without recursion
CREATE POLICY "Enable all for admin users" ON user_profiles
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'arifxhakan78@gmail.com'
  );