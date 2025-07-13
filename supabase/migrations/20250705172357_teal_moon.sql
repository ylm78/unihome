/*
  # Création de la table des commandes

  1. Nouvelles Tables
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, référence vers auth.users)
      - `house_id` (uuid, référence vers houses)
      - `color_id` (uuid, référence vers colors)
      - `size_id` (uuid, référence vers sizes)
      - `quantity` (integer, quantité)
      - `total_price` (integer, prix total en centimes)
      - `status` (text, statut de la commande)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur `orders`
    - Politique pour que les utilisateurs voient leurs commandes
    - Politique pour que les admins voient toutes les commandes
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  house_id uuid REFERENCES houses(id) ON DELETE CASCADE,
  color_id uuid REFERENCES colors(id) ON DELETE CASCADE,
  size_id uuid REFERENCES sizes(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  total_price integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_production', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs voient leurs propres commandes
CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Politique pour que les utilisateurs créent leurs propres commandes
CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Politique pour que les admins voient toutes les commandes
CREATE POLICY "Admins can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Politique pour que les admins modifient toutes les commandes
CREATE POLICY "Admins can update all orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();