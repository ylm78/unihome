/*
  # Correction des politiques RLS - Suppression de la récursion infinie

  1. Problème résolu
    - Supprime toutes les politiques problématiques sur user_profiles
    - Crée des politiques simples sans récursion
    - Accès admin basé sur l'email JWT uniquement

  2. Sécurité
    - Admin peut tout voir et modifier
    - Utilisateurs peuvent voir/modifier leurs propres données
    - Pas de référence circulaire entre tables
*/

-- Supprimer toutes les politiques existantes sur user_profiles pour éviter la récursion
DROP POLICY IF EXISTS "Enable all for admin users" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all quotes" ON quotes;
DROP POLICY IF EXISTS "Users can view own quotes" ON quotes;
DROP POLICY IF EXISTS "Admins can update all quotes" ON quotes;
DROP POLICY IF EXISTS "Users can create own quotes" ON quotes;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;

-- Créer des politiques simples sans récursion
-- Pour user_profiles
CREATE POLICY "Admin full access user_profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'email'::text) = 'arifxhakan78@gmail.com'::text);

CREATE POLICY "Users can manage own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

-- Pour quotes
CREATE POLICY "Admin full access quotes"
  ON quotes
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'email'::text) = 'arifxhakan78@gmail.com'::text);

CREATE POLICY "Users can manage own quotes"
  ON quotes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Pour orders
CREATE POLICY "Admin full access orders"
  ON orders
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'email'::text) = 'arifxhakan78@gmail.com'::text);

CREATE POLICY "Users can manage own orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Pour houses, colors, sizes (lecture publique, modification admin)
DROP POLICY IF EXISTS "Houses are viewable by everyone" ON houses;
DROP POLICY IF EXISTS "Houses are editable by admins" ON houses;
DROP POLICY IF EXISTS "Colors are viewable by everyone" ON colors;
DROP POLICY IF EXISTS "Colors are editable by admins" ON colors;
DROP POLICY IF EXISTS "Sizes are viewable by everyone" ON sizes;
DROP POLICY IF EXISTS "Sizes are editable by admins" ON sizes;

CREATE POLICY "Public read houses" ON houses FOR SELECT TO public USING (true);
CREATE POLICY "Admin manage houses" ON houses FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email'::text) = 'arifxhakan78@gmail.com'::text);

CREATE POLICY "Public read colors" ON colors FOR SELECT TO public USING (true);
CREATE POLICY "Admin manage colors" ON colors FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email'::text) = 'arifxhakan78@gmail.com'::text);

CREATE POLICY "Public read sizes" ON sizes FOR SELECT TO public USING (true);
CREATE POLICY "Admin manage sizes" ON sizes FOR ALL TO authenticated 
  USING ((auth.jwt() ->> 'email'::text) = 'arifxhakan78@gmail.com'::text);