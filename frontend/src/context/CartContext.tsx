import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem } from '../types';
import { OrderService } from '../lib/supabase';
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

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
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
          color_id: item.colorId,
          size_id: item.sizeId,
          quantity: item.quantity,
          total_price: Math.round(item.totalPrice * 100), // Convertir en centimes
          status: 'pending'
        });
      }
      
      clearCart();
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