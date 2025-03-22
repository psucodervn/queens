'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RecordModel } from 'pocketbase';

import { AuthModel, pb } from '@/lib/pocketbase';

type AuthContextType = {
  user: AuthModel | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const updateUserFromModel = (model: RecordModel | null) => {
    if (!model) {
      setUser(null);
      return;
    }

    setUser({
      id: model.id,
      email: model.email as string,
      username: model.username as string,
      created: model.created,
      updated: model.updated,
    });
  };

  // Initialize auth state
  useEffect(() => {
    try {
      // Check if there's an existing session
      const isValid = pb.authStore.isValid;
      const model = pb.authStore.record;

      console.log('Auth state initialized:', { isValid, model });

      if (isValid && model) {
        updateUserFromModel(model);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }

    // Subscribe to auth state changes
    pb.authStore.onChange((token, model) => {
      console.log('Auth state changed:', { token: !!token, model });
      updateUserFromModel(model);
    });

    return () => {
      // Cleanup subscription if needed
      pb.authStore.onChange(() => {});
    };
  }, []);

  // Handle auth redirects
  useEffect(() => {
    if (!isLoading) {
      const isAuthRoute = ['/login', '/signup'].includes(pathname);
      const isProtectedRoute = ['/practice', '/room', '/profile'].some((route) =>
        pathname.startsWith(route)
      );

      console.log('Route check:', {
        isAuthRoute,
        isProtectedRoute,
        pathname,
        user: !!user,
        isLoading,
      });

      if (user && isAuthRoute) {
        router.push('/');
      } else if (!user && isProtectedRoute) {
        router.push('/login');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      console.log('Login successful:', authData);
      updateUserFromModel(authData.record);
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    try {
      const data = {
        email,
        username,
        password,
        passwordConfirm: password,
      };

      // Create the user
      const createdUser = await pb.collection('users').create(data);
      console.log('User created:', createdUser);

      // Automatically log them in
      await login(email, password);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
