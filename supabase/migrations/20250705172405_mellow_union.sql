/*
  # Création de la table des devis

  1. Nouvelles Tables
    - `quotes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, référence vers auth.users)
      - `house_id` (uuid, référence vers houses)
      - `color_id` (uuid, référence vers colors)
      - `size_id` (uuid, référence vers sizes)
      - `customizations` (text[], options supplémentaires)
      - `total_price` (integer, prix total en centimes)
      - `status` (text, statut du devis)
      - `message` (text, message du client)
      - `admin_notes` (text, notes de l'admin)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur `quotes`
    - Politique pour que les utilisateurs voient leurs devis
    - Politique pour que les admins voient tous les devis
*/

CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  house_id uuid REFERENCES houses(id) ON DELETE CASCADE,
  color_id uuid REFERENCES colors(id) ON DELETE CASCADE,
  size_id uuid REFERENCES sizes(id) ON DELETE CASCADE,
  customizations text[] DEFAULT '{}',
  total_price integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message text,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs voient leurs propres devis
CREATE POLICY "Users can view own quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Politique pour que les utilisateurs créent leurs propres devis
CREATE POLICY "Users can create own quotes"
  ON quotes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Politique pour que les admins voient tous les devis
CREATE POLICY "Admins can view all quotes"
  ON quotes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Politique pour que les admins modifient tous les devis
CREATE POLICY "Admins can update all quotes"
  ON quotes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();