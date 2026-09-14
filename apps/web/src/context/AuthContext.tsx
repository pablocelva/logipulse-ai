'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api-client';

export type UserRole = 'ADMIN' | 'DISPATCHER' | 'DRIVER';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginAsDemo: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('logipulse_user');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {}
          }
          // Verify session validity with backend /auth/me
          try {
            const res = await api.auth.me();
            if (res?.user) {
              setUser(res.user);
              localStorage.setItem('logipulse_user', JSON.stringify(res.user));
            }
          } catch {
            // Token expired or logged out -> purge state
            setUser(null);
            localStorage.removeItem('logipulse_jwt_token');
            localStorage.removeItem('logipulse_user');
          }
        }
      } catch (e) {
        console.warn('Error inicializando AuthContext:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, password);
      if (res.user) {
        setUser(res.user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async (role: UserRole) => {
    let email = 'admin@logipulse.ai';
    let password = 'admin123';

    if (role === 'DISPATCHER') {
      email = 'dispatcher@logipulse.ai';
      password = 'dispatcher123';
    } else if (role === 'DRIVER') {
      email = 'driver@logipulse.ai';
      password = 'driver123';
    }

    await login(email, password);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.auth.logout();
    } catch {
      // Ignore logout network errors
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('logipulse_jwt_token');
        localStorage.removeItem('logipulse_user');
        window.location.href = '/login';
      }
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
