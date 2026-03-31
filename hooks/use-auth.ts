"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  LoginCredentials,
  RegisterData,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  getCurrentUser,
  isAuthenticated as checkIsAuthenticated,
} from "@/lib/auth";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };

    initAuth();
  }, [refreshUser]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const { user } = await authLogin(credentials);
      setUser(user);
      router.push("/reports");
    },
    [router]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      const { user } = await authRegister(data);
      setUser(user);
      router.push("/reports");
    },
    [router]
  );

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    router.push("/");
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated: checkIsAuthenticated() && !!user,
    login,
    register,
    logout,
    refreshUser,
  };
}
