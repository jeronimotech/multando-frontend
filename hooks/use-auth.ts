"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  LoginCredentials,
  RegisterData,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  socialLogin as authSocialLogin,
  getCurrentUser,
  isAuthenticated as checkIsAuthenticated,
} from "@/lib/auth";

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  socialLogin: (
    provider: "google" | "github",
    payload: { code: string; redirect_uri?: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      // Redirect to the page the user was trying to access, or dashboard
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    },
    [router, searchParams]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      const { user } = await authRegister(data);
      setUser(user);
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    },
    [router, searchParams]
  );

  const socialLogin = useCallback(
    async (
      provider: "google" | "github",
      payload: { code: string; redirect_uri?: string }
    ) => {
      await authSocialLogin(provider, payload);
      await refreshUser();
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    },
    [router, searchParams, refreshUser]
  );

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    router.push("/login");
  }, [router]);

  return {
    user,
    isLoading,
    isAuthenticated: checkIsAuthenticated() && !!user,
    login,
    register,
    socialLogin,
    logout,
    refreshUser,
  };
}
