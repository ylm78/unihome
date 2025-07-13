import React from 'react';
import { useState } from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface CartPageProps {
  onNavigate: (page: string, data?: any) => void;
}

const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { items, totalPrice, removeFromCart, updateQuantity, clearCart, checkout } = useCart();
  const { supabaseUser } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const success = await checkout(supabaseUser);
    if (success) {
      onNavigate('home');
    }
    setIsCheckingOut(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
          <p className="text-gray-600 mb-8">Découvrez nos maisons containers et ajoutez-les à votre panier</p>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir le catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('catalog')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continuer les achats
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Votre panier</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 transition-colors"
          >
            Vider le panier
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.houseName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.houseName}</h3>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div>Couleur: {item.colorName}</div>
                      <div>Taille: {item.sizeName}</div>
                      <div className="text-lg font-bold text-blue-600">
                        {item.unitPrice.toLocaleString('fr-FR')}€
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {item.totalPrice.toLocaleString('fr-FR')}€
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 transition-colors mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Résumé de commande</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium">{totalPrice.toLocaleString('fr-FR')}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison</span>
                <span className="font-medium">Gratuite</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TVA (20%)</span>
                <span className="font-medium">{(totalPrice * 0.2).toLocaleString('fr-FR')}€</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{(totalPrice * 1.2).toLocaleString('fr-FR')}€</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isCheckingOut ? 'Commande en cours...' : 'Procéder au paiement'}
              </button>
              <button
                onClick={() => onNavigate('quote', { cartItems: items })}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Demander un devis
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p>✓ Garantie 10 ans</p>
              <p>✓ Livraison et installation incluses</p>
              <p>✓ Service client dédié</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;