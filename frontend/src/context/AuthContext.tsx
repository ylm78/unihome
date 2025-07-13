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

  // Charger le profil utilisateur depuis la base de données
  const loadUserProfile = async (userId: string, email: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors du chargement du profil:', error);
      }

      // Créer un objet utilisateur avec les données disponibles
      const userData: User = {
        id: userId,
        email: email,
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
      };

      setUser(userData);
    } catch (err) {
      console.error('Exception lors du chargement du profil:', err);
      // Créer un utilisateur basique en cas d'erreur
      setUser({
        id: userId,
        email: email,
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
      });
    }
  };

  // Initialisation au démarrage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setSupabaseUser(session.user);
          await loadUserProfile(session.user.id, session.user.email || '');
        }
      } catch (error) {
        console.error('Erreur d\'initialisation auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        await loadUserProfile(session.user.id, session.user.email || '');
      } else {
        setSupabaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Email ou mot de passe incorrect');
        return false;
      }

      if (data.user) {
        toast.success('Connexion réussie !');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast.error('Erreur de connexion');
      return false;
    }
  };

  const register = async ({
    email,
    password,
    firstName,
    lastName,
    phone,
  }: RegisterParams): Promise<boolean> => {
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
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // Connexion automatique après inscription
        const loginResult = await login(email, password);
        if (loginResult) {
          toast.success('Inscription réussie !');
        }
        return loginResult;
      }

      return false;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      toast.error('Erreur d\'inscription');
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
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