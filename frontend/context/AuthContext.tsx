"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AuthData {
  id: string;
  userName: string;
  userEmail: string;
  token: string;
  role: "admin" | "business" | "staff" | "client";
  business_id?: string;
  services?: string[];
}

interface AuthContextType {
  authData: AuthData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  setAuthData: (data: AuthData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedAuthData = localStorage.getItem("auth-data");

      if (token && storedAuthData) {
        setAuthData(JSON.parse(storedAuthData));
      }
    } catch (error) {
      console.error("Failed to load auth data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("auth-data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    setAuthData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("auth-data");
    router.push("/");
  };

  const updateAuthData = (data: AuthData) => {
    setAuthData(data);
    localStorage.setItem("token", data.token);
    localStorage.setItem("auth-data", JSON.stringify(data));
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        isLoading,
        isAuthenticated: !!authData,
        logout,
        setAuthData: updateAuthData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
