# Site E-commerce de Maisons en Container

Un site e-commerce moderne pour la vente de maisons containers avec un back-office d'administration complet.

## 🚀 Fonctionnalités

### Site Public
- **Catalogue** de maisons containers avec filtres avancés
- **Pages produit** détaillées avec configurateur
- **Panier** et gestion des commandes
- **Système de devis** personnalisés
- **Authentification** utilisateur
- **Pages informatives** (FAQ, Contact, Guide de construction)

### Back-Office Admin
- **Tableau de bord** avec statistiques
- **Gestion CRUD** complète :
  - Maisons containers
  - Couleurs et tailles
  - Commandes et devis
  - Utilisateurs
  - Paramètres système

## 🛠 Technologies

- **Frontend** : React 18, TypeScript, Tailwind CSS
- **Backend** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **Validation** : React Hook Form + Yup
- **Icons** : Lucide React
- **Notifications** : React Hot Toast

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd container-homes
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**

### Étape 1 : Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL et votre clé anonyme

### Étape 2 : Configurer les variables d'environnement
1. Copiez `.env.example` vers `.env`
2. Remplacez les valeurs par vos vraies clés Supabase :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anonyme
```

### Étape 3 : Exécuter les migrations
1. Dans votre dashboard Supabase, allez dans "SQL Editor"
2. Exécutez les fichiers de migration dans l'ordre :
   - `supabase/migrations/create_houses_table.sql`
   - `supabase/migrations/create_colors_table.sql`
   - `supabase/migrations/create_sizes_table.sql`
   - `supabase/migrations/create_orders_table.sql`
   - `supabase/migrations/create_quotes_table.sql`
   - `supabase/migrations/create_user_profiles_table.sql`
   - `supabase/migrations/insert_sample_data.sql`

### Étape 4 : Configurer l'authentification
1. Dans Supabase, allez dans "Authentication" > "Settings"
2. Configurez les paramètres selon vos besoins
3. Ajoutez les domaines autorisés

4. **Lancer le projet**
```bash
npm run dev
```

## 🔐 Accès Admin

Pour créer un compte administrateur :

1. **Inscrivez-vous** normalement sur le site
2. Dans Supabase, allez dans "Authentication" > "Users"
3. Trouvez votre utilisateur et modifiez les métadonnées :
```json
{
  "role": "admin"
}
```
4. Accédez au back-office via `/admin`

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── admin/          # Composants du back-office
│   ├── Header.tsx      # En-tête du site
│   ├── Footer.tsx      # Pied de page
│   └── ProductCard.tsx # Carte produit
├── pages/              # Pages du site
│   ├── admin/          # Pages du back-office
│   ├── HomePage.tsx    # Page d'accueil
│   ├── CatalogPage.tsx # Catalogue
│   └── ...
├── context/            # Contextes React
├── lib/                # Services et utilitaires
├── types/              # Types TypeScript
└── data/               # Données statiques
```

## 🗄️ Base de Données

### Tables principales :
- **houses** : Maisons containers
- **colors** : Couleurs disponibles
- **sizes** : Tailles disponibles
- **orders** : Commandes clients
- **quotes** : Devis demandés
- **user_profiles** : Profils utilisateurs

### Sécurité :
- **RLS (Row Level Security)** activé sur toutes les tables
- **Politiques** pour séparer les données utilisateurs/admins
- **Authentification** requise pour les actions sensibles

## 🚀 Déploiement

1. **Build du projet**
```bash
npm run build
```

2. **Déployer** sur votre plateforme préférée (Vercel, Netlify, etc.)

3. **Variables d'environnement** : Configurez les mêmes variables sur votre plateforme

## 📝 Utilisation

### Côté Client
1. Parcourir le catalogue
2. Configurer une maison (couleur, taille)
3. Ajouter au panier ou demander un devis
4. Créer un compte et passer commande

### Côté Admin
1. Se connecter avec un compte admin
2. Aller sur `/admin`
3. Gérer les produits, commandes, devis
4. Suivre les statistiques

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.