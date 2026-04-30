import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { apiClient } from "../api/client";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  city?: string;
  phone?: string;
  avatar_url?: string;
  is_verified?: boolean;
  points?: number;
  total_savings?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const CACHE_KEY = "slasham_user";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME_KEY = "slasham_user_cached_at";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      const cachedAt = localStorage.getItem(CACHE_TIME_KEY);
      if (saved && cachedAt) {
        const age = Date.now() - parseInt(cachedAt);
        if (age < CACHE_TTL) {
          return JSON.parse(saved); // ✅ Use cache if fresh
        }
      }
    } catch {}
    return null;
  });

  const [isLoading, setIsLoading] = useState(!user); // ✅ Skip loading if cached

  const setUser = useCallback((newUser: AuthUser | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(newUser));
      localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    } else {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIME_KEY);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiClient("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {}
    setUser(null);
    setIsLoading(false);
  }, [setUser]);

  useEffect(() => {
    // Check if we have a valid cache to show immediately
    const cachedAt = localStorage.getItem(CACHE_TIME_KEY);
    if (cachedAt) {
      setIsLoading(false); // ✅ Show UI immediately from cache
    }
    
    // Always validate session in background
    refreshUser();
  }, [refreshUser]); // ✅ Runs ONCE on app mount

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      refreshUser,
      logout,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
