import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Définie' : 'Manquante');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Types pour la base de données
export interface DatabaseHouse {
  id: string;
  name: string;
  description: string;
  short_description: string;
  base_price: number; // Prix en centimes
  images: string[];
  surface: number;
  bedrooms: number;
  bathrooms: number;
  containers: number;
  living_room: boolean;
  kitchen: boolean;
  features: string[];
  category: 'residential' | 'commercial' | 'office' | 'vacation';
  created_at: string;
  updated_at: string;
}

export interface DatabaseColor {
  id: string;
  name: string;
  hex: string;
  price_modifier: number; // Prix en centimes
  created_at: string;
}

export interface DatabaseSize {
  id: string;
  name: string;
  dimensions: string;
  price_modifier: number; // Prix en centimes
  created_at: string;
}

export interface DatabaseOrder {
  id: string;
  user_id: string;
  house_id: string;
  color_id: string;
  size_id: string;
  quantity: number;
  total_price: number; // Prix en centimes
  status: 'pending' | 'confirmed' | 'in_production' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface DatabaseQuote {
  id: string;
  user_id: string;
  house_id: string;
  color_id: string;
  size_id: string;
  customizations: string[];
  total_price: number; // Prix en centimes
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// Fonctions utilitaires pour la conversion des prix
export const formatPrice = (priceInCents: number): string => {
  return (priceInCents / 100).toLocaleString('fr-FR');
};

export const parsePrice = (priceInEuros: number): number => {
  return Math.round(priceInEuros * 100);
};

// Services pour les opérations CRUD
export class HouseService {
  static async getAll() {
    const { data, error } = await supabase
      .from('houses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from('houses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async create(house: Omit<DatabaseHouse, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('houses')
      .insert([house])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, house: Partial<DatabaseHouse>) {
    const { data, error } = await supabase
      .from('houses')
      .update(house)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('houses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

export class ColorService {
  static async getAll() {
    const { data, error } = await supabase
      .from('colors')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async create(color: Omit<DatabaseColor, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('colors')
      .insert([color])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, color: Partial<DatabaseColor>) {
    const { data, error } = await supabase
      .from('colors')
      .update(color)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('colors')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

export class SizeService {
  static async getAll() {
    const { data, error } = await supabase
      .from('sizes')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async create(size: Omit<DatabaseSize, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('sizes')
      .insert([size])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async update(id: string, size: Partial<DatabaseSize>) {
    const { data, error } = await supabase
      .from('sizes')
      .update(size)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('sizes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

export class QuoteService {
  static async getAll() {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        houses(name),
        colors(name),
        sizes(name),
        user_profiles(first_name, last_name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async create(quote: Omit<DatabaseQuote, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('quotes')
      .insert([quote])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateStatus(id: string, status: DatabaseQuote['status'], adminNotes?: string) {
    const updateData: any = { status };
    if (adminNotes !== undefined) {
      updateData.admin_notes = adminNotes;
    }

    const { data, error } = await supabase
      .from('quotes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserQuotes(userId: string) {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        houses(name),
        colors(name),
        sizes(name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

export class OrderService {
  static async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        houses(name),
        colors(name),
        sizes(name),
        user_profiles(first_name, last_name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async create(order: Omit<DatabaseOrder, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateStatus(id: string, status: DatabaseOrder['status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        houses(name),
        colors(name),
        sizes(name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

export class UserService {
  static async getAll() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        users:id (
          email,
          last_sign_in_at
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async updateRole(id: string, role: 'user' | 'admin') {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}