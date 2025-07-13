/*
  # Ajouter la relation foreign key entre quotes et user_profiles

  1. Contraintes de clés étrangères
    - Ajouter une contrainte foreign key sur `quotes.user_id` qui référence `user_profiles.id`
    - Permettre la suppression en cascade pour maintenir l'intégrité des données

  2. Sécurité
    - Assurer l'intégrité référentielle entre les devis et les profils utilisateurs
    - Éviter les données orphelines lors de la suppression d'utilisateurs
*/

-- Ajouter la contrainte de clé étrangère entre quotes et user_profiles
ALTER TABLE public.quotes
ADD CONSTRAINT fk_quotes_user_id
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;

-- Ajouter également la contrainte pour orders si elle n'existe pas déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_orders_user_id' 
    AND table_name = 'orders'
  ) THEN
    ALTER TABLE public.orders
    ADD CONSTRAINT fk_orders_user_id
    FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE;
  END IF;
END $$;