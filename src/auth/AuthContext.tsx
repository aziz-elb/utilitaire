import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { login as apiLogin } from "../services/authService";
import { getProfileinfo } from "@/services/Profile";

export interface UserProfile {
  nomPrenom: string;
  email: string;
  telephone: string;
  profilePictureUrl: string;
  interneYn: boolean;
  role: string;
  typeMembreId: string;
  entiteId: string;
  fonctionId: string;
}

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  user: UserProfile | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const isAuthenticated = !!token;
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        localStorage.setItem("token", token);
        try {
          const profileData: UserProfile = await getProfileinfo();
          setProfile(profileData);
        } catch (e) {
          setProfile(null);
        }
      } else {
        localStorage.removeItem("token");
        setProfile(null);
      }
    };
    fetchProfile();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await apiLogin(email, password);
      setToken(res.access_token);
    } catch (e: any) {
      throw new Error(e.response?.data?.message || "Erreur de connexion");
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated, user: profile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
