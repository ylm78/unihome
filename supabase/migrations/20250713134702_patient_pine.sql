/*
  # Création de la table cart_items pour le panier persistant

  1. Nouvelle table
    - `cart_items` pour stocker les articles du panier des utilisateurs connectés
    - Référence directe à auth.users() via user_id (UUID)
    - Pas de clé étrangère car auth.users n'est pas accessible

  2. Sécurité
    - RLS activé
    - Politiques pour que les utilisateurs ne voient que leur propre panier
*/

-- Créer la table cart_items
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, -- Référence à auth.users(id) mais sans contrainte FK
  house_id text NOT NULL,
  color_id text,
  size_id text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price integer NOT NULL, -- Prix unitaire en centimes
  total_price integer NOT NULL, -- Prix total en centimes
  house_name text NOT NULL,
  color_name text NOT NULL DEFAULT 'Standard',
  size_name text NOT NULL DEFAULT 'Standard',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs ne voient que leur propre panier
CREATE POLICY "Users can manage their own cart items"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS cart_items_user_id_idx ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS cart_items_created_at_idx ON cart_items(created_at);