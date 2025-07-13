/*
  # Création de la table des couleurs

  1. Nouvelles Tables
    - `colors`
      - `id` (uuid, primary key)
      - `name` (text, nom de la couleur)
      - `hex` (text, code hexadécimal)
      - `price_modifier` (integer, supplément de prix en centimes)
      - `created_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur `colors`
    - Politique de lecture publique
    - Politique d'écriture pour les administrateurs
*/

CREATE TABLE IF NOT EXISTS colors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  hex text NOT NULL,
  price_modifier integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE colors ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture publique
CREATE POLICY "Colors are viewable by everyone"
  ON colors
  FOR SELECT
  USING (true);

-- Politique pour l'écriture par les administrateurs
CREATE POLICY "Colors are editable by admins"
  ON colors
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Insertion des couleurs par défaut
INSERT INTO colors (name, hex, price_modifier) VALUES
  ('Blanc Moderne', '#ffffff', 0),
  ('Noir Élégant', '#1f2937', 50000),
  ('Bleu Océan', '#2563eb', 80000),
  ('Vert Forêt', '#059669', 80000),
  ('Rouge Terracotta', '#dc2626', 80000),
  ('Gris Anthracite', '#6b7280', 30000)
ON CONFLICT DO NOTHING;