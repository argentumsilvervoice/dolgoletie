import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";

interface Subscriber {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  subscriptionType: string;
  subscriptionStatus: string;
  createdAt: string;
}

interface AuthContextType {
  subscriber: Subscriber | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  subscriptionType: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Simple in-memory token store (no localStorage — sandboxed)
let memoryToken: string | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    const res = await apiRequest("POST", "/api/login", { email, password });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Ошибка входа");
    memoryToken = data.token;
    setToken(data.token);
    setSubscriber(data.subscriber);
  };

  const register = async (formData: RegisterData) => {
    const res = await apiRequest("POST", "/api/register", formData);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
    memoryToken = data.token;
    setToken(data.token);
    setSubscriber(data.subscriber);
  };

  const logout = () => {
    if (memoryToken) {
      apiRequest("POST", "/api/logout", {});
    }
    memoryToken = null;
    setToken(null);
    setSubscriber(null);
  };

  const refreshMe = async () => {
    if (!memoryToken) return;
    setLoading(true);
    try {
      const res = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${memoryToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSubscriber(data.subscriber);
        setToken(memoryToken);
      } else {
        memoryToken = null;
        setToken(null);
        setSubscriber(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ subscriber, token, loading, login, register, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getMemoryToken() { return memoryToken; }
