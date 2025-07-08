import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin } from '../services/authService';

interface TestUser {
  prenom: string;
  nom: string;
  avatar: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  user: TestUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const isAuthenticated = !!token;
  // Test user (hardcoded for now)
  const testUser: TestUser = {
    prenom: 'Test',
    nom: 'User',
    avatar: 'https://ui-avatars.com/api/?name=Test+User',
    email: 'usertest@gmail.com',
  };
  const user = isAuthenticated ? testUser : null;

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await apiLogin(email, password);
      setToken(res.access_token);
    } catch (e: any) {
      throw new Error(e.response?.data?.message || 'Erreur de connexion');
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}; 