"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authorityApi, setAuthorityApiKey, clearAuthorityApiKey } from "@/lib/api";

// Types
export interface Authority {
  id: string;
  name: string;
  jurisdiction: string;
  email: string;
  apiKey: string;
  createdAt: string;
}

interface AuthorityAuthState {
  authority: Authority | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface UseAuthorityAuthReturn extends AuthorityAuthState {
  login: (apiKey: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  maskedApiKey: string;
}

// Storage keys
const AUTHORITY_STORAGE_KEY = "authority_data";
const API_KEY_STORAGE_KEY = "authority_api_key";
const REMEMBER_KEY = "authority_remember";

// Mock authority for development
const MOCK_AUTHORITY: Authority = {
  id: "auth-001",
  name: "DIGESETT",
  jurisdiction: "Santo Domingo, Dominican Republic",
  email: "admin@digesett.gob.do",
  apiKey: "dk_live_1234567890abcdefghijklmnop",
  createdAt: new Date().toISOString(),
};

// Use mock data flag
import { USE_MOCK_DATA } from '@/lib/config';

/**
 * Hook for managing authority API key authentication
 */
export function useAuthorityAuth(): UseAuthorityAuthReturn {
  const router = useRouter();
  const [state, setState] = useState<AuthorityAuthState>({
    authority: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for stored API key
        const storedApiKey = getStoredApiKey();
        const storedAuthority = getStoredAuthority();

        if (storedApiKey && storedAuthority) {
          // Validate the API key with the backend
          setAuthorityApiKey(storedApiKey);

          if (USE_MOCK_DATA) {
            // In mock mode, just use stored data
            setState({
              authority: storedAuthority,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Validate with backend
            try {
              const authority = await authorityApi.get<Authority>("/authority/me");
              setState({
                authority,
                isAuthenticated: true,
                isLoading: false,
              });
            } catch {
              // API key is invalid, clear storage
              clearStorage();
              clearAuthorityApiKey();
              setState({
                authority: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          }
        } else {
          setState({
            authority: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setState({
          authority: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  // Login with API key
  const login = useCallback(
    async (apiKey: string, remember: boolean = false) => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        if (USE_MOCK_DATA) {
          // Simulate API call delay
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Accept any API key that matches the mock format
          if (apiKey.startsWith("dk_") && apiKey.length >= 20) {
            const authority = { ...MOCK_AUTHORITY, apiKey };

            // Store credentials
            setAuthorityApiKey(apiKey);
            if (remember) {
              storeAuthority(authority);
              storeApiKey(apiKey);
              localStorage.setItem(REMEMBER_KEY, "true");
            } else {
              sessionStorage.setItem(AUTHORITY_STORAGE_KEY, JSON.stringify(authority));
              sessionStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
            }

            setState({
              authority,
              isAuthenticated: true,
              isLoading: false,
            });

            router.push("/authority/dashboard");
          } else {
            throw new Error("Invalid API key format. Key should start with 'dk_'");
          }
        } else {
          // Set the API key for requests
          setAuthorityApiKey(apiKey);

          // Validate with backend
          const authority = await authorityApi.get<Authority>("/authority/me");

          // Store credentials
          if (remember) {
            storeAuthority(authority);
            storeApiKey(apiKey);
            localStorage.setItem(REMEMBER_KEY, "true");
          } else {
            sessionStorage.setItem(AUTHORITY_STORAGE_KEY, JSON.stringify(authority));
            sessionStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
          }

          setState({
            authority,
            isAuthenticated: true,
            isLoading: false,
          });

          router.push("/authority/dashboard");
        }
      } catch (error) {
        clearAuthorityApiKey();
        setState({
          authority: null,
          isAuthenticated: false,
          isLoading: false,
        });
        throw error;
      }
    },
    [router]
  );

  // Logout
  const logout = useCallback(() => {
    clearStorage();
    clearAuthorityApiKey();
    setState({
      authority: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push("/authority/login");
  }, [router]);

  // Get masked API key for display
  const maskedApiKey = state.authority?.apiKey
    ? maskApiKey(state.authority.apiKey)
    : "••••••••••••••••";

  return {
    ...state,
    login,
    logout,
    maskedApiKey,
  };
}

// Helper functions
function getStoredApiKey(): string | null {
  if (typeof window === "undefined") return null;

  // Check localStorage first (remember me)
  const remembered = localStorage.getItem(REMEMBER_KEY);
  if (remembered) {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  }

  // Check sessionStorage
  return sessionStorage.getItem(API_KEY_STORAGE_KEY);
}

function getStoredAuthority(): Authority | null {
  if (typeof window === "undefined") return null;

  try {
    const remembered = localStorage.getItem(REMEMBER_KEY);
    const storageKey = remembered
      ? localStorage.getItem(AUTHORITY_STORAGE_KEY)
      : sessionStorage.getItem(AUTHORITY_STORAGE_KEY);

    if (storageKey) {
      return JSON.parse(storageKey);
    }
  } catch {
    return null;
  }

  return null;
}

function storeAuthority(authority: Authority): void {
  localStorage.setItem(AUTHORITY_STORAGE_KEY, JSON.stringify(authority));
}

function storeApiKey(apiKey: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

function clearStorage(): void {
  localStorage.removeItem(AUTHORITY_STORAGE_KEY);
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(AUTHORITY_STORAGE_KEY);
  sessionStorage.removeItem(API_KEY_STORAGE_KEY);
}

function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) return "••••••••";
  const prefix = apiKey.slice(0, 3);
  const suffix = apiKey.slice(-4);
  return `${prefix}${"•".repeat(Math.min(apiKey.length - 7, 16))}${suffix}`;
}
