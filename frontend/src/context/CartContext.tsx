import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem } from '../types';
import { CartService } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

interface CartContextType extends CartState {
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (supabaseUser: any) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_CART': {
      const items = action.payload;
      return {
        ...state,
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: items.reduce((sum, item) => sum + item.totalPrice, 0),
        loading: false,
      };
    }
    
    case 'ADD_TO_CART': {
      const updatedItems = [...state.items, action.payload];
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
      };
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity, totalPrice: item.unitPrice * action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    loading: false,
  });
  
  const { supabaseUser, loading: authLoading } = useAuth();

  // Charger le panier quand l'utilisateur change
  useEffect(() => {
    if (authLoading) return; // Attendre que l'auth soit initialisée
    
    loadCart();
  }, [supabaseUser, authLoading]);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      if (supabaseUser) {
        console.log('🛒 Chargement du panier pour l\'utilisateur:', supabaseUser.email);
        // Utilisateur connecté : charger depuis Supabase
        const cartData = await CartService.getUserCart(supabaseUser.id);
        
        // Convertir les données Supabase vers le format CartItem
        const cartItems: CartItem[] = (cartData || []).map(item => ({
          id: item.id,
          houseId: item.house_id,
          houseName: item.house_name,
          colorId: item.color_id || 'default',
          colorName: item.color_name,
          sizeId: item.size_id || 'default',
          sizeName: item.size_name,
          quantity: item.quantity,
          unitPrice: Math.round(item.unit_price / 100), // Convertir depuis les centimes
          totalPrice: Math.round(item.total_price / 100), // Convertir depuis les centimes
          image: item.image_url || '',
        }));
        
        dispatch({ type: 'SET_CART', payload: cartItems });
        console.log('✅ Panier chargé:', cartItems.length, 'articles');
      } else {
        console.log('👤 Utilisateur non connecté : chargement depuis localStorage');
        // Utilisateur non connecté : charger depuis localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          try {
            const cartItems = JSON.parse(savedCart);
            dispatch({ type: 'SET_CART', payload: cartItems });
          } catch (error) {
            console.error('Erreur lors du chargement du panier localStorage:', error);
            dispatch({ type: 'SET_CART', payload: [] });
          }
        } else {
          dispatch({ type: 'SET_CART', payload: [] });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      dispatch({ type: 'SET_CART', payload: [] });
    }
  };

  // Sauvegarder dans localStorage pour les utilisateurs non connectés
  useEffect(() => {
    if (!supabaseUser && !authLoading) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, supabaseUser, authLoading]);

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    try {
      if (supabaseUser) {
        console.log('🛒 Ajout au panier Supabase pour:', supabaseUser.email);
        // Utilisateur connecté : sauvegarder dans Supabase
        const cartItemData = {
          user_id: supabaseUser.id,
          house_id: item.houseId,
          color_id: item.colorId === 'default' ? null : item.colorId,
          size_id: item.sizeId === 'default' ? null : item.sizeId,
          quantity: item.quantity,
          unit_price: Math.round(item.unitPrice * 100), // Convertir en centimes
          total_price: Math.round(item.totalPrice * 100), // Convertir en centimes
          house_name: item.houseName,
          color_name: item.colorName,
          size_name: item.sizeName,
          image_url: item.image,
        };
        
        const savedItem = await CartService.addToCart(cartItemData);
        
        // Ajouter à l'état local
        const newCartItem: CartItem = {
          id: savedItem.id,
          houseId: item.houseId,
          houseName: item.houseName,
          colorId: item.colorId,
          colorName: item.colorName,
          sizeId: item.sizeId,
          sizeName: item.sizeName,
          quantity: savedItem.quantity,
          unitPrice: item.unitPrice,
          totalPrice: Math.round(savedItem.total_price / 100),
          image: item.image,
        };
        
        // Recharger le panier pour avoir les données à jour
        await loadCart();
        
        console.log('✅ Article ajouté au panier Supabase');
      } else {
        console.log('👤 Ajout au panier localStorage');
        // Utilisateur non connecté : ajouter au localStorage
        const newItem: CartItem = {
          ...item,
          id: Date.now().toString(),
        };
        dispatch({ type: 'ADD_TO_CART', payload: newItem });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      if (supabaseUser) {
        console.log('🗑️ Suppression du panier Supabase');
        await CartService.removeFromCart(id);
        console.log('✅ Article supprimé du panier Supabase');
      }
      
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(id);
        return;
      }

      if (supabaseUser) {
        console.log('📝 Mise à jour quantité Supabase');
        await CartService.updateQuantity(id, quantity);
        console.log('✅ Quantité mise à jour dans Supabase');
      }
      
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const clearCart = async () => {
    try {
      if (supabaseUser) {
        console.log('🧹 Vidage du panier Supabase');
        await CartService.clearUserCart(supabaseUser.id);
        console.log('✅ Panier vidé dans Supabase');
      }
      
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      toast.error('Erreur lors du vidage du panier');
    }
  };

  const checkout = async (supabaseUser: any): Promise<boolean> => {
    if (!supabaseUser) {
      toast.error('Vous devez être connecté pour passer commande');
      return false;
    }

    try {
      // Créer une commande pour chaque item du panier
      const { OrderService } = await import('../lib/supabase');
      
      for (const item of state.items) {
        await OrderService.create({
          user_id: supabaseUser.id,
          house_id: item.houseId,
          color_id: item.colorId === 'default' ? null : item.colorId,
          size_id: item.sizeId === 'default' ? null : item.sizeId,
          quantity: item.quantity,
          total_price: Math.round(item.totalPrice * 100), // Convertir en centimes
          status: 'pending'
        });
      }
      
      await clearCart();
      toast.success('Commande passée avec succès !');
      return true;
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      toast.error('Erreur lors de la commande');
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};