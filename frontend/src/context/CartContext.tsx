import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem } from '../types';
import { OrderService, CartService, DatabaseCartItem } from '../lib/supabase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CartContextType extends CartState {
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (supabaseUser: any) => Promise<boolean>;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const newItem: CartItem = {
        ...action.payload,
        id: Date.now().toString(),
      };
      const updatedItems = [...state.items, newItem];
      return {
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
      };
    }
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return {
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
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
      };
    }
    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    case 'LOAD_CART': {
      return {
        items: action.payload,
        totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: action.payload.reduce((sum, item) => sum + item.totalPrice, 0),
      };
    }
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });
  const { supabaseUser } = useAuth();
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Fonction pour convertir DatabaseCartItem vers CartItem
  const convertToCartItem = (dbItem: DatabaseCartItem): CartItem => ({
    id: dbItem.id,
    houseId: dbItem.house_id,
    houseName: dbItem.house_name,
    colorId: dbItem.color_id || 'default',
    colorName: dbItem.color_name,
    sizeId: dbItem.size_id || 'default',
    sizeName: dbItem.size_name,
    quantity: dbItem.quantity,
    unitPrice: Math.round(dbItem.unit_price / 100),
    totalPrice: Math.round(dbItem.total_price / 100),
    image: dbItem.image_url || '',
  });

  // Fonction pour convertir CartItem vers DatabaseCartItem
  const convertToDbCartItem = (item: Omit<CartItem, 'id'>, userId: string): Omit<DatabaseCartItem, 'id' | 'created_at' | 'updated_at'> => ({
    user_id: userId,
    house_id: item.houseId,
    color_id: item.colorId === 'default' ? null : item.colorId,
    size_id: item.sizeId === 'default' ? null : item.sizeId,
    quantity: item.quantity,
    unit_price: Math.round(item.unitPrice * 100),
    total_price: Math.round(item.totalPrice * 100),
    house_name: item.houseName,
    color_name: item.colorName,
    size_name: item.sizeName,
    image_url: item.image,
  });

  // Synchroniser le panier avec la base de données
  const syncCart = async () => {
    if (!supabaseUser) return;

    try {
      const dbCartItems = await CartService.getUserCart(supabaseUser.id);
      const cartItems = dbCartItems.map(convertToCartItem);
      dispatch({ type: 'LOAD_CART', payload: cartItems });
    } catch (error) {
      console.error('Erreur lors de la synchronisation du panier:', error);
    }
  };

  // Charger le panier au démarrage
  useEffect(() => {
    const initializeCart = async () => {
      if (supabaseUser && !isInitialized) {
        // Utilisateur connecté : charger depuis la DB
        await syncCart();
        setIsInitialized(true);
      } else if (!supabaseUser && !isInitialized) {
        // Utilisateur non connecté : charger depuis localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
        }
        setIsInitialized(true);
      }
    };

    initializeCart();
  }, [supabaseUser, isInitialized]);

  // Sauvegarder dans localStorage pour les utilisateurs non connectés
  useEffect(() => {
    if (!supabaseUser && isInitialized) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, supabaseUser, isInitialized]);

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    if (supabaseUser) {
      // Utilisateur connecté : sauvegarder en DB
      try {
        const dbItem = convertToDbCartItem(item, supabaseUser.id);
        await CartService.addToCart(dbItem);
        await syncCart(); // Recharger le panier
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        toast.error('Erreur lors de l\'ajout au panier');
      }
    } else {
      // Utilisateur non connecté : localStorage
      dispatch({ type: 'ADD_TO_CART', payload: item });
    }
  };

  const removeFromCart = async (id: string) => {
    if (supabaseUser) {
      // Utilisateur connecté : supprimer de la DB
      try {
        await CartService.removeFromCart(id);
        await syncCart(); // Recharger le panier
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression');
      }
    } else {
      // Utilisateur non connecté : localStorage
      dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (supabaseUser) {
      // Utilisateur connecté : mettre à jour en DB
      try {
        await CartService.updateQuantity(id, quantity);
        await syncCart(); // Recharger le panier
      } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        toast.error('Erreur lors de la mise à jour');
      }
    } else {
      // Utilisateur non connecté : localStorage
      if (quantity <= 0) {
        removeFromCart(id);
      } else {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
      }
    }
  };

  const clearCart = async () => {
    if (supabaseUser) {
      // Utilisateur connecté : vider la DB
      try {
        await CartService.clearUserCart(supabaseUser.id);
        await syncCart(); // Recharger le panier
      } catch (error) {
        console.error('Erreur lors du vidage du panier:', error);
        toast.error('Erreur lors du vidage du panier');
      }
    } else {
      // Utilisateur non connecté : localStorage
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const checkout = async (supabaseUser: any): Promise<boolean> => {
    if (!supabaseUser) {
      toast.error('Vous devez être connecté pour passer commande');
      return false;
    }

    try {
      // Créer une commande pour chaque item du panier
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
        syncCart,
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