/*
  # Création de la table des maisons containers

  1. Nouvelles Tables
    - `houses`
      - `id` (uuid, primary key)
      - `name` (text, nom de la maison)
      - `description` (text, description complète)
      - `short_description` (text, description courte)
      - `base_price` (integer, prix de base en centimes)
      - `images` (text[], URLs des images)
      - `surface` (integer, surface en m²)
      - `bedrooms` (integer, nombre de chambres)
      - `bathrooms` (integer, nombre de salles de bain)
      - `containers` (integer, nombre de containers)
      - `living_room` (boolean, présence salon)
      - `kitchen` (boolean, présence cuisine)
      - `features` (text[], caractéristiques)
      - `category` (text, catégorie)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur `houses`
    - Politique de lecture publique
    - Politique d'écriture pour les administrateurs
*/

CREATE TABLE IF NOT EXISTS houses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  base_price integer NOT NULL,
  images text[] DEFAULT '{}',
  surface integer NOT NULL,
  bedrooms integer NOT NULL DEFAULT 0,
  bathrooms integer NOT NULL DEFAULT 0,
  containers integer NOT NULL DEFAULT 1,
  living_room boolean DEFAULT true,
  kitchen boolean DEFAULT true,
  features text[] DEFAULT '{}',
  category text NOT NULL CHECK (category IN ('residential', 'commercial', 'office', 'vacation')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture publique
CREATE POLICY "Houses are viewable by everyone"
  ON houses
  FOR SELECT
  USING (true);

-- Politique pour l'écriture par les administrateurs
CREATE POLICY "Houses are editable by admins"
  ON houses
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_houses_updated_at
  BEFORE UPDATE ON houses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();