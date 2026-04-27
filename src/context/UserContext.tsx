import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiClient } from "../api/client";

type UserProfile = Record<string, any> | null;

type UserContextValue = {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

const getStoredUser = (): UserProfile => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("slasham_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem("slasham_user");
    return null;
  }
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient("/auth/me");
      setUser(data);
      if (data) {
        localStorage.setItem("slasham_user", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Failed to refresh user", error);
      localStorage.removeItem("slasham_user");
      localStorage.removeItem("slasham_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("slasham_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("slasham_user");
      localStorage.removeItem("slasham_token");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
