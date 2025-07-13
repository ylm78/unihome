/*
  # Création de la table des tailles

  1. Nouvelles Tables
    - `sizes`
      - `id` (uuid, primary key)
      - `name` (text, nom de la taille)
      - `dimensions` (text, dimensions)
      - `price_modifier` (integer, supplément de prix en centimes)
      - `created_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur `sizes`
    - Politique de lecture publique
    - Politique d'écriture pour les administrateurs
*/

CREATE TABLE IF NOT EXISTS sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  dimensions text NOT NULL,
  price_modifier integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sizes ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture publique
CREATE POLICY "Sizes are viewable by everyone"
  ON sizes
  FOR SELECT
  USING (true);

-- Politique pour l'écriture par les administrateurs
CREATE POLICY "Sizes are editable by admins"
  ON sizes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Insertion des tailles par défaut
INSERT INTO sizes (name, dimensions, price_modifier) VALUES
  ('Compact', '6m x 2.5m', 0),
  ('Standard', '12m x 2.5m', 1500000),
  ('Grande', '18m x 2.5m', 3000000),
  ('Familiale', '24m x 2.5m', 5000000)
ON CONFLICT DO NOTHING;