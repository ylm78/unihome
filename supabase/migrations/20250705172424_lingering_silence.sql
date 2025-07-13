/*
  # Insertion des données d'exemple

  1. Données d'exemple
    - Maisons containers avec toutes les spécifications
    - Données réalistes pour la démonstration

  2. Notes
    - Les prix sont en centimes (multiply by 100)
    - Images depuis Pexels pour la démo
*/

-- Insertion des maisons d'exemple
INSERT INTO houses (
  name, 
  description, 
  short_description, 
  base_price, 
  images, 
  surface, 
  bedrooms, 
  bathrooms, 
  containers, 
  living_room, 
  kitchen, 
  features, 
  category
) VALUES 
(
  'Maison Container Modern',
  'Une maison container moderne et élégante, parfaite pour une famille. Conçue avec des matériaux de haute qualité et une isolation optimale, elle offre un confort de vie exceptionnel. Les grandes baies vitrées apportent une luminosité naturelle et une vue panoramique sur l''extérieur.',
  'Maison moderne avec grandes baies vitrées',
  4500000,
  ARRAY[
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  40,
  2,
  1,
  2,
  true,
  true,
  ARRAY[
    'Isolation thermique renforcée',
    'Baies vitrées panoramiques',
    'Terrasse en bois composite',
    'Système de ventilation double flux',
    'Cuisine équipée moderne',
    'Chauffage au sol'
  ],
  'residential'
),
(
  'Container Studio Pro',
  'Un studio container professionnel idéal pour les espaces de travail créatifs. Optimisé pour la productivité avec un design minimaliste et des finitions haut de gamme. Parfait pour les artistes, architectes, ou tout professionnel recherchant un espace de travail inspirant.',
  'Studio professionnel avec design minimaliste',
  3200000,
  ARRAY[
    'https://images.pexels.com/photos/1396160/pexels-photo-1396160.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1396161/pexels-photo-1396161.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1396162/pexels-photo-1396162.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  25,
  0,
  1,
  1,
  true,
  false,
  ARRAY[
    'Espace de travail optimisé',
    'Éclairage LED intégré',
    'Prises électriques multiples',
    'Climatisation réversible',
    'Rangements intégrés',
    'Connexion fibre optique'
  ],
  'office'
),
(
  'Villa Container Deluxe',
  'Une villa container de luxe avec finitions premium. Cette maison exceptionnelle combine le charme industriel du container avec le confort d''une villa moderne. Parfaite pour les familles exigeantes recherchant un habitat unique et écologique.',
  'Villa de luxe avec finitions premium',
  8900000,
  ARRAY[
    'https://images.pexels.com/photos/1396147/pexels-photo-1396147.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1396148/pexels-photo-1396148.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1396149/pexels-photo-1396149.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  80,
  3,
  2,
  4,
  true,
  true,
  ARRAY[
    'Piscine intégrée',
    'Terrasse sur le toit',
    'Domotique complète',
    'Cuisine équipée haut de gamme',
    'Salle de bain avec baignoire',
    'Garage intégré'
  ],
  'residential'
),
(
  'Container Café Commerce',
  'Un container commercial spécialement conçu pour les cafés et restaurants. Équipé de tout le nécessaire pour démarrer votre activité de restauration mobile. Design attractif et fonctionnel pour attirer la clientèle.',
  'Container commercial pour café/restaurant',
  5500000,
  ARRAY[
    'https://images.pexels.com/photos/1396155/pexels-photo-1396155.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1396156/pexels-photo-1396156.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1396157/pexels-photo-1396157.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  35,
  0,
  1,
  1,
  false,
  true,
  ARRAY[
    'Comptoir de service intégré',
    'Équipement de cuisine professionnel',
    'Système de ventilation commercial',
    'Éclairage LED d''ambiance',
    'Terrasse amovible',
    'Enseigne lumineuse'
  ],
  'commercial'
),
(
  'Chalet Container Montagne',
  'Un chalet container conçu pour les environnements montagnards. Résistant aux intempéries avec une isolation renforcée pour les climats rigoureux. Parfait pour une résidence secondaire ou un refuge de montagne.',
  'Chalet résistant pour environnements montagnards',
  6700000,
  ARRAY[
    'https://images.pexels.com/photos/1396140/pexels-photo-1396140.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1396141/pexels-photo-1396141.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1396142/pexels-photo-1396142.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  50,
  2,
  1,
  2,
  true,
  true,
  ARRAY[
    'Isolation thermique renforcée',
    'Cheminée intégrée',
    'Toit résistant à la neige',
    'Double vitrage anti-froid',
    'Système de chauffage performant',
    'Terrasse couverte'
  ],
  'vacation'
),
(
  'Container Tiny House',
  'Une tiny house container compacte et fonctionnelle. Solution idéale pour les jeunes couples ou les personnes seules recherchant un mode de vie minimaliste. Chaque espace est optimisé pour offrir un maximum de confort.',
  'Tiny house compacte et fonctionnelle',
  2800000,
  ARRAY[
    'https://images.pexels.com/photos/1396165/pexels-photo-1396165.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1396166/pexels-photo-1396166.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1396167/pexels-photo-1396167.jpeg?auto=compress&cs=tinysrgb&w=800'
  ],
  20,
  1,
  1,
  1,
  true,
  true,
  ARRAY[
    'Mezzanine pour couchage',
    'Cuisine compacte équipée',
    'Rangements optimisés',
    'Salle de bain avec douche',
    'Éclairage LED économique',
    'Panneaux solaires en option'
  ],
  'residential'
)
ON CONFLICT DO NOTHING;