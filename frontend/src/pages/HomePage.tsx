import React from 'react';
import { ArrowRight, Shield, Truck, Users, Star, CheckCircle, Zap, Award } from 'lucide-react';
import { HouseService } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { ContainerHouse } from '../types';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
  onAddToCart: (house: ContainerHouse) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, onAddToCart }) => {
  const [featuredHouses, setFeaturedHouses] = React.useState<ContainerHouse[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { addToCart } = useCart();

  React.useEffect(() => {
    loadFeaturedHouses();
  }, []);

  const loadFeaturedHouses = async () => {
    try {
      // Vérifier la connexion Supabase avant de charger les données
      const { data, error } = await supabase.from('houses').select('*').limit(3);
      
      if (error) {
        console.error('Erreur Supabase:', error);
        // Utiliser des données de fallback si Supabase n'est pas disponible
        setFeaturedHouses([]);
        setLoading(false);
        return;
      }
      
      // Convertir les données Supabase vers le format ContainerHouse et prendre les 3 premières
      const convertedHouses: ContainerHouse[] = (data || []).map(house => ({
        id: house.id,
        name: house.name,
        description: house.description,
        shortDescription: house.short_description || house.description,
        basePrice: Math.round((house.base_price || 0) / 100), // Convertir depuis les centimes
        images: house.images,
        specifications: {
          surface: house.surface || 0,
          bedrooms: house.bedrooms || 0,
          bathrooms: house.bathrooms || 0,
          containers: house.containers || 1,
          livingRoom: house.living_room || false,
          kitchen: house.kitchen || false,
        },
        colors: [], // Sera chargé séparément si nécessaire
        sizes: [], // Sera chargé séparément si nécessaire
        features: house.features || [],
        category: house.category || 'residential',
      }));
      setFeaturedHouses(convertedHouses);
    } catch (error) {
      console.error('Erreur lors du chargement des maisons:', error);
      // Ne pas bloquer l'application, juste afficher une liste vide
      setFeaturedHouses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (house: ContainerHouse) => {
    // Ajouter avec les options par défaut
    addToCart({
      houseId: house.id,
      houseName: house.name,
      colorId: 'default',
      colorName: 'Standard',
      sizeId: 'default', 
      sizeName: 'Standard',
      quantity: 1,
      unitPrice: house.basePrice,
      totalPrice: house.basePrice,
      image: house.images[0],
    });
    toast.success(`${house.name} ajouté au panier !`);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Votre Maison Container
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 animate-pulse">
                Sur Mesure
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Découvrez nos solutions d'habitat innovantes, écologiques et durables. 
              Des maisons containers modernes conçues pour votre style de vie unique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('catalog')}
                className="group flex items-center justify-center px-8 py-4 bg-white text-amber-700 rounded-lg font-semibold hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Voir le catalogue
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('quote')}
                className="group flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-amber-700 transition-all duration-300 transform hover:-translate-y-1"
              >
                Demander un devis
                <Zap className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              Pourquoi choisir ContainerHomes ?
            </h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              Nous vous accompagnons dans la réalisation de votre projet d'habitat durable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-amber-900 mb-4">Qualité Garantie</h3>
              <p className="text-amber-700 leading-relaxed">
                Nos maisons containers sont construites avec des matériaux de première qualité 
                et bénéficient d'une garantie de 10 ans.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-amber-900 mb-4">Livraison Rapide</h3>
              <p className="text-amber-700 leading-relaxed">
                Installation et livraison sous 8 semaines partout en France. 
                Montage par nos équipes expertes.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-amber-900 mb-4">Accompagnement</h3>
              <p className="text-amber-700 leading-relaxed">
                De la conception à la livraison, notre équipe vous accompagne 
                dans toutes les étapes de votre projet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              Nos Modèles Phares
            </h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              Découvrez une sélection de nos maisons containers les plus populaires
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHouses.map((house) => (
                <ProductCard
                  key={house.id}
                  house={house}
                  onViewDetails={(id) => onNavigate('product', { productId: id })}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('catalog')}
              className="group px-10 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Voir tous nos modèles
              <ArrowRight className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
            <Award className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Que vous soyez à la recherche de containers ou que vous ayez un projet de construction,
              nous sommes en mesure de répondre à votre demande.
            </p>
            <button
              onClick={() => onNavigate('quote')}
              className="group px-10 py-4 bg-white text-amber-700 rounded-lg font-bold text-lg hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              DEMANDER UN DEVIS
              <Zap className="w-6 h-6 ml-2 inline group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              Découvrez les témoignages de nos clients satisfaits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie Dubois",
                role: "Propriétaire",
                content: "Une expérience exceptionnelle ! Notre maison container est magnifique et parfaitement adaptée à nos besoins. L'équipe a été d'un professionnalisme exemplaire.",
                rating: 5
              },
              {
                name: "Pierre Martin",
                role: "Entrepreneur",
                content: "J'ai choisi ContainerHomes pour mon bureau mobile et je ne regrette pas. La qualité est au rendez-vous et les délais ont été respectés.",
                rating: 5
              },
              {
                name: "Sophie Laurent",
                role: "Architecte",
                content: "Un partenaire de confiance pour mes projets clients. Leur expertise technique et leur créativité font la différence.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl border border-amber-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-amber-800 mb-6 text-lg leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="font-bold text-amber-900 text-lg">{testimonial.name}</p>
                  <p className="text-amber-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;