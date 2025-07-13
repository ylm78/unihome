import React, { useState } from 'react';
import { ArrowLeft, Heart, Share2, ShoppingCart, CheckCircle } from 'lucide-react';
import { HouseService, ColorService, SizeService } from '../lib/supabase';
import { ContainerHouse, Color, Size } from '../types';
import { useCart } from '../context/CartContext';

interface ProductPageProps {
  productId: string;
  onNavigate: (page: string, data?: any) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ productId, onNavigate }) => {
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [house, setHouse] = useState<ContainerHouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);

  React.useEffect(() => {
    loadAllData();
  }, [productId]);

  const loadAllData = async () => {
    try {
      const [houseData, colorsData, sizesData] = await Promise.all([
        HouseService.getById(productId),
        ColorService.getAll(),
        SizeService.getAll()
      ]);
      
      if (houseData) {
        // Convertir les données Supabase vers le format ContainerHouse
        const convertedHouse: ContainerHouse = {
          id: houseData.id,
          name: houseData.name,
          description: houseData.description,
          shortDescription: houseData.short_description,
          basePrice: Math.round(houseData.base_price / 100), // Convertir depuis les centimes
          images: houseData.images,
          specifications: {
            surface: houseData.surface,
            bedrooms: houseData.bedrooms,
            bathrooms: houseData.bathrooms,
            containers: houseData.containers,
            livingRoom: houseData.living_room,
            kitchen: houseData.kitchen,
          },
          colors: colorsData || [],
          sizes: sizesData || [],
          features: houseData.features,
          category: houseData.category,
        };
        setHouse(convertedHouse);
      }
      
      setColors(colorsData || []);
      setSizes(sizesData || []);
      
      // Définir les valeurs par défaut
      if (colorsData && colorsData.length > 0) {
        setSelectedColor(colorsData[0]);
      }
      if (sizesData && sizesData.length > 0) {
        setSelectedSize(sizesData[0]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la maison:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit introuvable</h1>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = house.basePrice + 
    (selectedColor ? Math.round(selectedColor.price_modifier / 100) : 0) + 
    (selectedSize ? Math.round(selectedSize.price_modifier / 100) : 0);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error('Veuillez sélectionner une couleur et une taille');
      return;
    }

    addToCart({
      houseId: house.id,
      houseName: house.name,
      colorId: selectedColor.id,
      colorName: selectedColor.name,
      sizeId: selectedSize.id,
      sizeName: selectedSize.name,
      quantity,
      unitPrice: totalPrice,
      totalPrice: totalPrice * quantity,
      image: house.images[0],
    });
    
    toast.success('Produit ajouté au panier !');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('catalog')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour au catalogue
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-w-4 aspect-h-3 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={house.images[selectedImage]}
                alt={house.name}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {house.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-4 aspect-h-3 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${house.name} ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{house.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {house.category === 'residential' ? 'Résidentiel' : 
                   house.category === 'commercial' ? 'Commercial' : 
                   house.category === 'office' ? 'Bureau' : 'Vacances'}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="text-gray-400 hover:text-blue-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{house.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Spécifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">Surface:</span>
                  <span className="ml-2 font-medium">{house.specifications.surface}m²</span>
                </div>
                <div>
                  <span className="text-gray-500">Chambres:</span>
                  <span className="ml-2 font-medium">{house.specifications.bedrooms}</span>
                </div>
                <div>
                  <span className="text-gray-500">Salles de bain:</span>
                  <span className="ml-2 font-medium">{house.specifications.bathrooms}</span>
                </div>
                <div>
                  <span className="text-gray-500">Containers:</span>
                  <span className="ml-2 font-medium">{house.specifications.containers}</span>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Couleur</h3>
              <div className="grid grid-cols-3 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                      selectedColor?.id === color.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="text-left">
                      <div className="font-medium text-sm">{color.name}</div>
                      {color.price_modifier > 0 && (
                        <div className="text-xs text-gray-500">+{Math.round(color.price_modifier / 100)}€</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Taille</h3>
              <div className="grid grid-cols-2 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedSize?.id === size.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{size.name}</div>
                    <div className="text-sm text-gray-500">{size.dimensions}</div>
                    {size.price_modifier > 0 && (
                      <div className="text-xs text-gray-500">+{Math.round(size.price_modifier / 100)}€</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Caractéristiques</h3>
              <ul className="space-y-2">
                {house.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price and Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-blue-600">
                    {totalPrice.toLocaleString('fr-FR')}€
                  </div>
                  <div className="text-sm text-gray-500">
                    Prix configuré
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Ajouter au panier
                </button>
                <button
                  onClick={() => onNavigate('quote', { houseId: house.id })}
                  className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Demander un devis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;