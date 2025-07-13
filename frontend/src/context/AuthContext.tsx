// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import toast from 'react-hot-toast';

type RegisterParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterParams) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  supabaseUser: any;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (userId: string, email: string) => {
    console.log('👤 Chargement profil utilisateur:', userId);
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('📝 Profil utilisateur non trouvé, création d\'un profil basique');
          setUser({ id: userId, email, firstName: '', lastName: '', phone: '', address: '' });
        } else {
          console.error('❌ Erreur lors du chargement du profil:', error.message);
          setUser({ id: userId, email, firstName: '', lastName: '', phone: '', address: '' });
        }
        return;
      }

      console.log('✅ Profil utilisateur chargé:', profile.first_name, profile.last_name);

      setUser({
        id: profile.id,
        email: email,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    } catch (err) {
      console.error('❌ Exception lors du chargement du profil:', err);
      // Créer un utilisateur basique pour ne pas bloquer l'application
      setUser({ id: userId, email, firstName: '', lastName: '', phone: '', address: '' });
    }
  };

  useEffect(() => {
    if (supabaseUser) {
      if (!isInitialized) {
        initializeCart();
      }
    }
  }, [supabaseUser]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ Erreur de session:', error.message);
          setLoading(false);
          return;
        }
        if (session?.user) {
          console.log('✅ Session utilisateur trouvée');
          setSupabaseUser(session.user);
          await loadUserProfile(session.user.id, session.user.email || '');
        }
      } catch (err) {
        console.error('❌ Erreur d\'initialisation:', err);
      } finally {
        console.log('✅ Initialisation terminée');
        setLoading(false);
      }
      setIsInitialized(true);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔄 Changement d\'état d\'authentification:', _event);
      setLoading(true);
      try {
        if (session?.user) {
          setSupabaseUser(session.user);
          await loadUserProfile(session.user.id, session.user.email || '');
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
      } catch (err) {
        console.error('❌ Erreur changement d\'état:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fonction pour migrer le panier localStorage vers la DB lors de la connexion
  const migrateLocalCartToDatabase = async (userId: string) => {
    try {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        const cartItems = JSON.parse(localCart);
        if (cartItems.length > 0) {
          console.log('🛒 Migration du panier local vers la base de données...');
          // Cette migration sera gérée par le CartContext
          // On vide juste le localStorage après la connexion
          localStorage.removeItem('cart');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la migration du panier:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔑 Tentative de connexion pour:', email);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('❌ Erreur de connexion:', error.message);
        throw new Error("Email ou mot de passe incorrect");
      }

      if (data.user) {
        console.log('✅ Connexion réussie');
        await loadUserProfile(data.user.id, data.user.email || '');
        await migrateLocalCartToDatabase(data.user.id);
      }

      return true;
    } catch (err: any) {
      console.error("❌ Erreur de connexion:", err.message);
      toast.error(err.message || 'Erreur de connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async ({
    email,
    password,
    firstName,
    lastName,
    phone,
  }: RegisterParams): Promise<boolean> => {
    console.log('📝 Tentative d\'inscription pour:', email);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone || null,
            role: 'user',
          },
        },
      });

      if (error) {
        console.error('❌ Erreur d\'inscription:', error.message);
        throw new Error(error.message);
      }

      console.log('✅ Inscription réussie, connexion automatique...');
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        console.error('❌ Erreur de connexion après inscription:', loginError.message);
        throw new Error(loginError.message);
      }

      return true;
    } catch (err: any) {
      console.error("❌ Erreur d'inscription:", err.message);
      toast.error(err.message || 'Erreur d\'inscription');
      return false;
    }
  };

  const logout = () => {
    console.log('👋 Déconnexion');
    supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        supabaseUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
