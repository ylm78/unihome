import React, { useState } from 'react';
import { ArrowLeft, Calculator, Send, CheckCircle } from 'lucide-react';
import { HouseService, ColorService, SizeService } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { QuoteService, supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface QuotePageProps {
  onNavigate: (page: string, data?: any) => void;
  initialData?: any;
}

const QuotePage: React.FC<QuotePageProps> = ({ onNavigate, initialData }) => {
  const [selectedHouse, setSelectedHouse] = useState(initialData?.houseId || '');
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedSize, setSelectedSize] = useState('medium');
  const [customizations, setCustomizations] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, supabaseUser } = useAuth();
  const [houses, setHouses] = useState<any[]>([]);
  const [loadingHouses, setLoadingHouses] = useState(true);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);

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
      
      setHouses(housesData || []);
      setColors(colorsData || []);
      setSizes(sizesData || []);
      
      // Définir les valeurs par défaut
      if (colorsData && colorsData.length > 0) {
        setSelectedColor(colorsData[0].id);
      }
      if (sizesData && sizesData.length > 0) {
        setSelectedSize(sizesData[0].id);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des maisons:', error);
    } finally {
      setLoadingHouses(false);
    }
  };

  const house = houses.find(h => h.id === selectedHouse);
  const color = colors.find(c => c.id === selectedColor);
  const size = sizes.find(s => s.id === selectedSize);

  const customizationOptions = [
    { id: 'solar', name: 'Panneaux solaires', price: 8000 },
    { id: 'pool', name: 'Piscine intégrée', price: 25000 },
    { id: 'garage', name: 'Garage attenant', price: 12000 },
    { id: 'terrace', name: 'Terrasse étendue', price: 5000 },
    { id: 'smart', name: 'Domotique avancée', price: 3000 },
    { id: 'garden', name: 'Aménagement jardin', price: 4000 },
  ];

  const calculateTotal = () => {
    if (!house || !color || !size) return 0;
    
    const basePrice = Math.round(house.base_price / 100); // Convertir depuis les centimes
    const colorPrice = Math.round(color.price_modifier / 100);
    const sizePrice = Math.round(size.price_modifier / 100);
    const customizationPrice = customizations.reduce((sum, id) => {
      const option = customizationOptions.find(opt => opt.id === id);
      return sum + (option?.price || 0);
    }, 0);

    return basePrice + colorPrice + sizePrice + customizationPrice;
  };

  const handleCustomizationChange = (id: string, checked: boolean) => {
    if (checked) {
      setCustomizations([...customizations, id]);
    } else {
      setCustomizations(customizations.filter(c => c !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !supabaseUser) {
      onNavigate('login');
      return;
    }

    if (!selectedHouse) {
      toast.error('Veuillez sélectionner un modèle de maison');
      return;
    }

    setIsLoading(true);
    
    try {
      // Récupérer les IDs réels depuis la base de données
      const { data: houses } = await supabase.from('houses').select('id').eq('name', house?.name).single();
      const { data: colorData } = await supabase.from('colors').select('id').eq('name', color?.name).single();
      const { data: sizeData } = await supabase.from('sizes').select('id').eq('name', size?.name).single();

      const quoteData = {
        user_id: supabaseUser.id,
        house_id: houses?.id || selectedHouse,
        color_id: colorData?.id || selectedColor,
        size_id: sizeData?.id || selectedSize,
        customizations,
        total_price: Math.round(calculateTotal() * 100), // Convertir en centimes
        message: message || null,
        status: 'pending' as const
      };

      await QuoteService.create(quoteData);
      toast.success('Votre demande de devis a été envoyée avec succès !');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du devis:', error);
      toast.error('Erreur lors de l\'envoi du devis. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Devis envoyé !</h2>
          <p className="text-gray-600 mb-6">
            Votre demande de devis a été envoyée avec succès. Nous vous contacterons dans les 24h.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Demande de devis personnalisé
              </h1>
              <p className="text-gray-600">
                Configurez votre maison container et obtenez un devis détaillé
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* House Selection */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Choisir un modèle</h3>
                <select
                  value={selectedHouse}
                  onChange={(e) => setSelectedHouse(e.target.value)}
                  required
                  disabled={loadingHouses}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">{loadingHouses ? 'Chargement...' : 'Sélectionnez un modèle'}</option>
                  {houses.map(house => (
                    <option key={house.id} value={house.id}>
                      {house.name} - {Math.round(house.base_price / 100).toLocaleString('fr-FR')}€
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Selection */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Couleur</h3>
                <div className="grid grid-cols-2 gap-3">
                  {colors.map(color => (
                    <label key={color.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="color"
                        value={color.id}
                        checked={selectedColor === color.id}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${
                        selectedColor === color.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                      }`}>
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div>
                          <div className="font-medium text-sm">{color.name}</div>
                          {color.price_modifier > 0 && (
                            <div className="text-xs text-gray-500">+{Math.round(color.price_modifier / 100)}€</div>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Taille</h3>
                <div className="grid grid-cols-2 gap-3">
                  {sizes.map(size => (
                    <label key={size.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="size"
                        value={size.id}
                        checked={selectedSize === size.id}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedSize === size.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                      }`}>
                        <div className="font-medium">{size.name}</div>
                        <div className="text-sm text-gray-500">{size.dimensions}</div>
                        {size.price_modifier > 0 && (
                          <div className="text-xs text-gray-500">+{Math.round(size.price_modifier / 100)}€</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customizations */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Options supplémentaires</h3>
                <div className="space-y-3">
                  {customizationOptions.map(option => (
                    <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customizations.includes(option.id)}
                        onChange={(e) => handleCustomizationChange(option.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1 flex justify-between">
                        <span className="font-medium">{option.name}</span>
                        <span className="text-gray-500">+{option.price.toLocaleString('fr-FR')}€</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Message (optionnel)</h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez vos besoins spécifiques ou posez vos questions..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5 mr-2" />
                Envoyer la demande de devis
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Récapitulatif
            </h3>

            {house && (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Modèle:</span>
                  <span className="font-medium">{house.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix de base:</span>
                  <span className="font-medium">{Math.round(house.base_price / 100).toLocaleString('fr-FR')}€</span>
                </div>

                {color && color.price_modifier > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Couleur ({color.name}):</span>
                    <span className="font-medium">+{Math.round(color.price_modifier / 100).toLocaleString('fr-FR')}€</span>
                  </div>
                )}

                {size && size.price_modifier > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taille ({size.name}):</span>
                    <span className="font-medium">+{Math.round(size.price_modifier / 100).toLocaleString('fr-FR')}€</span>
                  </div>
                )}

                {customizations.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-gray-600">Options:</div>
                    {customizations.map(id => {
                      const option = customizationOptions.find(opt => opt.id === id);
                      return option ? (
                        <div key={id} className="flex justify-between ml-4">
                          <span className="text-sm text-gray-500">{option.name}:</span>
                          <span className="text-sm">+{option.price.toLocaleString('fr-FR')}€</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total estimé:</span>
                    <span className="text-blue-600">{calculateTotal().toLocaleString('fr-FR')}€</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-4">
                  <p>* Prix indicatif hors taxes</p>
                  <p>* Installation et livraison incluses</p>
                  <p>* Devis final après étude technique</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePage;