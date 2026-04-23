"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import api from "@/lib/api";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    /**
     * Session hydration occurs strictly once on initial app load.
     * Prevents redundant /me calls on internal navigation.
     */
    const hydrateSession = async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (isMounted) {
          setUser(data.data);

          if (window.location.pathname === "/") {
            router.push("/categories");
          }
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
          if (window.location.pathname !== "/") router.push("/");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    hydrateSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const login = (newUser: User) => {
    setUser(newUser);
    router.push("/categories");
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      console.error("[Auth Context]: Logout invalidation failure", e);
    }
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
