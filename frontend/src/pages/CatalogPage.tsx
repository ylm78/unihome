import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { HouseService, ColorService, SizeService } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { ContainerHouse } from '../types';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface CatalogPageProps {
  onNavigate: (page: string, data?: any) => void;
  onAddToCart: (house: ContainerHouse) => void;
}

const CatalogPage: React.FC<CatalogPageProps> = ({ onNavigate, onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [houses, setHouses] = useState<ContainerHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const { addToCart } = useCart();

  React.useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [housesData, colorsData, sizesData] = await Promise.all([
        HouseService.getAll(),
        ColorService.getAll(),
        SizeService.getAll()
      ]);
      
      // Convertir les données Supabase vers le format ContainerHouse
      const convertedHouses: ContainerHouse[] = (housesData || []).map(house => ({
        id: house.id,
        name: house.name,
        description: house.description,
        shortDescription: house.short_description,
        basePrice: Math.round(house.base_price / 100), // Convertir depuis les centimes
        images: house.images,
        specifications: {
          surface: house.surface,
          bedrooms: house.bedrooms,
          bathrooms: house.bathrooms,
          containers: house.containers,
          livingRoom: house.living_room,
          kitchen: house.kitchen,
        },
        colors: colorsData || [],
        sizes: sizesData || [],
        features: house.features,
        category: house.category,
      }));
      setHouses(convertedHouses);
      setColors(colorsData || []);
      setSizes(sizesData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des maisons:', error);
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
  };

  const categories = [
    { id: 'all', name: 'Tous les modèles' },
    { id: 'residential', name: 'Résidentiel' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'office', name: 'Bureau' },
    { id: 'vacation', name: 'Vacances' },
  ];

  const filteredHouses = houses
    .filter(house => {
      const matchesSearch = house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          house.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || house.category === selectedCategory;
      const matchesPrice = house.basePrice >= priceRange[0] && house.basePrice <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.basePrice - b.basePrice;
        case 'price-high':
          return b.basePrice - a.basePrice;
        case 'surface':
          return b.specifications.surface - a.specifications.surface;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
            Catalogue des Maisons Container
          </h1>
          <p className="text-lg text-amber-700">
            Découvrez notre gamme complète de maisons containers sur mesure
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-amber-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-amber-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="name">Ordre alphabétique</option>
              <option value="price-low">Prix croissant</option>
              <option value="price-high">Prix décroissant</option>
              <option value="surface">Surface</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-700'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'bg-amber-200 text-amber-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-amber-800 mb-2">
              Budget: {priceRange[0].toLocaleString('fr-FR')}€ - {priceRange[1].toLocaleString('fr-FR')}€
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full accent-amber-600"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-amber-700">
            {filteredHouses.length} résultat{filteredHouses.length > 1 ? 's' : ''} trouvé{filteredHouses.length > 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-amber-600">Filtres appliqués</span>
          </div>
        </div>

        {/* Products Grid */}
        {filteredHouses.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredHouses.map((house) => (
              <ProductCard
                key={house.id}
                house={house}
                onViewDetails={(id) => onNavigate('product', { productId: id })}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-amber-600 text-lg">Aucun produit ne correspond à vos critères</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange([0, 100000]);
              }}
              className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;