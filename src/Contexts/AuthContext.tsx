import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { backendApi } from "../Services/backend";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await backendApi.get("/auth/profile");
        if (response.data?.success && response.data.data) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error("Not authenticated");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await backendApi.post("/auth/logout");
    } catch (err) {
      console.error(err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
