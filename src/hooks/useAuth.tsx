import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../lib/supabase';
import { toast } from '../components/ui/toaster';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        // If user doesn't exist in profiles table, create one
        if (error.code === 'PGRST116') {
          const newUser: Partial<User> = {
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
            username: authUser.user_metadata?.username || authUser.email!.split('@')[0],
            verified: false,
            role: 'user',
          };

          const { data: createdUser, error: createError } = await supabase
            .from('users')
            .insert([newUser])
            .select()
            .single();

          if (createError) throw createError;
          setUser(createdUser);
        } else {
          throw error;
        }
      } else {
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Kullanıcı profili yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Başarıyla giriş yaptınız!');
    } catch (error: any) {
      toast.error(error.message || 'Giriş yapılırken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, username: string) => {
    try {
      setLoading(true);
      
      // Check if username is already taken
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        throw new Error('Bu kullanıcı adı zaten kullanılıyor');
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            username,
          },
        },
      });

      if (error) throw error;
      toast.success('Hesabınız oluşturuldu! E-posta adresinizi doğrulayın.');
    } catch (error: any) {
      toast.error(error.message || 'Kayıt olurken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Başarıyla çıkış yaptınız');
    } catch (error: any) {
      toast.error(error.message || 'Çıkış yapılırken hata oluştu');
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, ...updates });
      toast.success('Profil güncellendi!');
    } catch (error: any) {
      toast.error(error.message || 'Profil güncellenirken hata oluştu');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}