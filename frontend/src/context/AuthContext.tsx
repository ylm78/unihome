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
  isAdmin: boolean;
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

  // Email admin autorisé
  const ADMIN_EMAIL = 'arifxhakan78@gmail.com';

  // Fonction pour vérifier si l'utilisateur est admin
  const isUserAdmin = (email: string): boolean => {
    return email === ADMIN_EMAIL;
  };

  // Fonction pour créer un utilisateur basique
  const createBasicUser = (supabaseUser: any): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      firstName: supabaseUser.user_metadata?.first_name || '',
      lastName: supabaseUser.user_metadata?.last_name || '',
      phone: supabaseUser.user_metadata?.phone || '',
      address: '',
    };
  };

  // Initialisation au démarrage
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('🔄 Initialisation de l\'authentification...');
        
        // Timeout de sécurité
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('⏰ Timeout atteint, arrêt du chargement');
            setLoading(false);
          }
        }, 5000); // 5 secondes max

        const { data: { session }, error } = await supabase.auth.getSession();
        
        clearTimeout(timeoutId);
        
        if (!mounted) return;

        if (error) {
          console.error('❌ Erreur session:', error.message);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('✅ Session trouvée:', session.user.email);
          setSupabaseUser(session.user);
          setUser(createBasicUser(session.user));
        } else {
          console.log('ℹ️ Aucune session active');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Exception lors de l\'initialisation:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event);
      
      if (!mounted) return;

      if (session?.user) {
        setSupabaseUser(session.user);
        setUser(createBasicUser(session.user));
      } else {
        setSupabaseUser(null);
        setUser(null);
      }
      
      if (loading) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔄 Tentative de connexion pour:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erreur de connexion:', error.message);
        toast.error('Email ou mot de passe incorrect');
        return false;
      }

      if (data.user) {
        console.log('✅ Connexion réussie');
        toast.success('Connexion réussie !');
        
        // Redirection automatique pour l'admin
        if (isUserAdmin(data.user.email || '')) {
          console.log('🔑 Utilisateur admin détecté, redirection vers /admin');
          setTimeout(() => {
            window.location.href = '/admin';
          }, 1000);
        }
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Exception lors de la connexion:', error);
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
      console.log('🔄 Tentative d\'inscription pour:', email);
      
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
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        console.log('✅ Inscription réussie');
        toast.success('Inscription réussie !');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ Exception lors de l\'inscription:', error);
      toast.error('Erreur d\'inscription');
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('🔄 Déconnexion...');
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur de déconnexion:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user ? isUserAdmin(user.email) : false,
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