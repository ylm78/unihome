import { ContainerHouse } from '../types';

// Les couleurs et tailles sont maintenant chargées depuis Supabase
// Voir ColorService.getAll() et SizeService.getAll()

export const containerHouses: ContainerHouse[] = [
  {
    id: '1',
    name: 'Maison Container Modern',
    description: 'Une maison container moderne et élégante, parfaite pour une famille. Conçue avec des matériaux de haute qualité et une isolation optimale, elle offre un confort de vie exceptionnel. Les grandes baies vitrées apportent une luminosité naturelle et une vue panoramique sur l\'extérieur.',
    shortDescription: 'Maison moderne avec grandes baies vitrées',
    basePrice: 45000,
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      surface: 40,
      bedrooms: 2,
      bathrooms: 1,
      containers: 2,
      livingRoom: true,
      kitchen: true,
    },
    colors: [], // Chargé dynamiquement depuis Supabase
    sizes: [], // Chargé dynamiquement depuis Supabase
    features: [
      'Isolation thermique renforcée',
      'Baies vitrées panoramiques',
      'Terrasse en bois composite',
      'Système de ventilation double flux',
      'Cuisine équipée moderne',
      'Chauffage au sol',
    ],
    category: 'residential',
  },
  {
    id: '2',
    name: 'Container Studio Pro',
    description: 'Un studio container professionnel idéal pour les espaces de travail créatifs. Optimisé pour la productivité avec un design minimaliste et des finitions haut de gamme. Parfait pour les artistes, architectes, ou tout professionnel recherchant un espace de travail inspirant.',
    shortDescription: 'Studio professionnel avec design minimaliste',
    basePrice: 32000,
    images: [
      'https://images.pexels.com/photos/1396160/pexels-photo-1396160.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396161/pexels-photo-1396161.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396162/pexels-photo-1396162.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      surface: 25,
      bedrooms: 0,
      bathrooms: 1,
      containers: 1,
      livingRoom: true,
      kitchen: false,
    },
    colors: [], // Chargé dynamiquement depuis Supabase
    sizes: [], // Chargé dynamiquement depuis Supabase
    features: [
      'Espace de travail optimisé',
      'Éclairage LED intégré',
      'Prises électriques multiples',
      'Climatisation réversible',
      'Rangements intégrés',
      'Connexion fibre optique',
    ],
    category: 'office',
  },
  {
    id: '3',
    name: 'Villa Container Deluxe',
    description: 'Une villa container de luxe avec finitions premium. Cette maison exceptionnelle combine le charme industriel du container avec le confort d\'une villa moderne. Parfaite pour les familles exigeantes recherchant un habitat unique et écologique.',
    shortDescription: 'Villa de luxe avec finitions premium',
    basePrice: 89000,
    images: [
      'https://images.pexels.com/photos/1396147/pexels-photo-1396147.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396148/pexels-photo-1396148.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396149/pexels-photo-1396149.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      surface: 80,
      bedrooms: 3,
      bathrooms: 2,
      containers: 4,
      livingRoom: true,
      kitchen: true,
    },
    colors: [], // Chargé dynamiquement depuis Supabase
    sizes: [], // Chargé dynamiquement depuis Supabase
    features: [
      'Piscine intégrée',
      'Terrasse sur le toit',
      'Domotique complète',
      'Cuisine équipée haut de gamme',
      'Salle de bain avec baignoire',
      'Garage intégré',
    ],
    category: 'residential',
  },
  {
    id: '4',
    name: 'Container Café Commerce',
    description: 'Un container commercial spécialement conçu pour les cafés et restaurants. Équipé de tout le nécessaire pour démarrer votre activité de restauration mobile. Design attractif et fonctionnel pour attirer la clientèle.',
    shortDescription: 'Container commercial pour café/restaurant',
    basePrice: 55000,
    images: [
      'https://images.pexels.com/photos/1396155/pexels-photo-1396155.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396156/pexels-photo-1396156.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396157/pexels-photo-1396157.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      surface: 35,
      bedrooms: 0,
      bathrooms: 1,
      containers: 1,
      livingRoom: false,
      kitchen: true,
    },
    colors: [], // Chargé dynamiquement depuis Supabase
    sizes: [], // Chargé dynamiquement depuis Supabase
    features: [
      'Comptoir de service intégré',
      'Équipement de cuisine professionnel',
      'Système de ventilation commercial',
      'Éclairage LED d\'ambiance',
      'Terrasse amovible',
      'Enseigne lumineuse',
    ],
    category: 'commercial',
  },
  {
    id: '5',
    name: 'Chalet Container Montagne',
    description: 'Un chalet container conçu pour les environnements montagnards. Résistant aux intempéries avec une isolation renforcée pour les climats rigoureux. Parfait pour une résidence secondaire ou un refuge de montagne.',
    shortDescription: 'Chalet résistant pour environnements montagnards',
    basePrice: 67000,
    images: [
      'https://images.pexels.com/photos/1396140/pexels-photo-1396140.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396141/pexels-photo-1396141.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396142/pexels-photo-1396142.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      surface: 50,
      bedrooms: 2,
      bathrooms: 1,
      containers: 2,
      livingRoom: true,
      kitchen: true,
    },
    colors: [], // Chargé dynamiquement depuis Supabase
    sizes: [], // Chargé dynamiquement depuis Supabase
    features: [
      'Isolation thermique renforcée',
      'Cheminée intégrée',
      'Toit résistant à la neige',
      'Double vitrage anti-froid',
      'Système de chauffage performant',
      'Terrasse couverte',
    ],
    category: 'vacation',
  },
  {
    id: '6',
    name: 'Container Tiny House',
    description: 'Une tiny house container compacte et fonctionnelle. Solution idéale pour les jeunes couples ou les personnes seules recherchant un mode de vie minimaliste. Chaque espace est optimisé pour offrir un maximum de confort.',
    shortDescription: 'Tiny house compacte et fonctionnelle',
    basePrice: 28000,
    images: [
      'https://images.pexels.com/photos/1396165/pexels-photo-1396165.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396166/pexels-photo-1396166.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396167/pexels-photo-1396167.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      surface: 20,
      bedrooms: 1,
      bathrooms: 1,
      containers: 1,
      livingRoom: true,
      kitchen: true,
    },
    colors: [], // Chargé dynamiquement depuis Supabase
    sizes: [], // Chargé dynamiquement depuis Supabase
    features: [
      'Mezzanine pour couchage',
      'Cuisine compacte équipée',
      'Rangements optimisés',
      'Salle de bain avec douche',
      'Éclairage LED économique',
      'Panneaux solaires en option',
    ],
    category: 'residential',
  },
];