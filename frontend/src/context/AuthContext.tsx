// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

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
    console.log('[loadUserProfile] Début appel avec ID =', userId);
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[loadUserProfile] Erreur Supabase :', error.message);
        setUser(null);
        return;
      }

      if (!profile) {
        console.warn('[loadUserProfile] Aucun profil trouvé');
        setUser({ id: userId, email, firstName: '', lastName: '', phone: '', address: '' });
        return;
      }

      setUser({
        id: profile.id,
        email: email,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    } catch (err) {
      console.error('[loadUserProfile] Exception bloquante :', err);
      setUser(null);
    }
  };

  useEffect(() => {
    const init = async () => {
      console.log('[AuthContext] Démarrage chargement session');
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSupabaseUser(session.user);
          await loadUserProfile(session.user.id, session.user.email);
        }
      } catch (err) {
        console.error('[AuthContext] Erreur session :', err);
      } finally {
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      if (session?.user) {
        setSupabaseUser(session.user);
        await loadUserProfile(session.user.id, session.user.email);
      } else {
        setSupabaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error("Email ou mot de passe incorrect");

      if (data.user) {
        await loadUserProfile(data.user.id, data.user.email);
        console.log('✅ Profil chargé');
      }

      return true;
    } catch (err: any) {
      console.error("Erreur de connexion:", err.message);
      return false;
    }
    finally {
    setLoading(false); // ✅
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

      if (error) throw new Error(error.message);

      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) throw new Error(loginError.message);

      return true;
    } catch (err: any) {
      console.error("Erreur d'inscription:", err.message);
      return false;
    }
  };

  const logout = () => {
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
