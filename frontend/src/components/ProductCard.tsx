import React from 'react';
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import { ContainerHouse } from '../types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  house: ContainerHouse;
  onViewDetails: (id: string) => void;
  onAddToCart: (house: ContainerHouse) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ house, onViewDetails, onAddToCart }) => {
  const handleAddToCart = () => {
    onAddToCart(house);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-amber-100">
      <div className="relative">
        <img
          src={house.images[0]}
          alt={house.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <button className="bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
            <Heart className="w-5 h-5 text-amber-600 hover:text-red-500 transition-colors" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {house.category === 'residential' ? 'Résidentiel' : 
             house.category === 'commercial' ? 'Commercial' : 
             house.category === 'office' ? 'Bureau' : 'Vacances'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-amber-900 mb-2">{house.name}</h3>
        <p className="text-amber-700 mb-4 line-clamp-2">{house.shortDescription}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-amber-600">
            <span>{house.specifications.surface}m²</span>
            <span>•</span>
            <span>{house.specifications.bedrooms} ch.</span>
            <span>•</span>
            <span>{house.specifications.bathrooms} sdb</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-amber-700">
            À partir de {house.basePrice.toLocaleString('fr-FR')}€
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onViewDetails(house.id)}
              className="flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir
            </button>
            <button
              onClick={handleAddToCart}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;