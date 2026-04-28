import { api } from "./api";
import { setCookie, removeCookie, getAuthToken } from "./api-client";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const COOKIE_TOKEN = "multando_token";
const COOKIE_REFRESH = "multando_refresh";
const COOKIE_EXPIRY_DAYS = 7;

// Also keep localStorage as a fallback for the existing ApiClient
const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Store authentication tokens in both cookies and localStorage
 * Cookies are read by the Next.js middleware (server-side)
 * localStorage is read by the existing ApiClient
 */
export function setTokens(tokens: AuthTokens): void {
  if (typeof window === "undefined") return;

  // Set cookies (readable by middleware)
  setCookie(COOKIE_TOKEN, tokens.accessToken, COOKIE_EXPIRY_DAYS);
  setCookie(COOKIE_REFRESH, tokens.refreshToken, COOKIE_EXPIRY_DAYS);

  // Also set localStorage (used by existing api.ts ApiClient)
  localStorage.setItem(TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

/**
 * Get the current access token (from cookie first, then localStorage fallback)
 */
export function getAccessToken(): string | null {
  const cookieToken = getAuthToken();
  if (cookieToken) return cookieToken;

  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get the current refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/multando_refresh=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Clear authentication tokens from both cookies and localStorage
 */
export function clearTokens(): void {
  if (typeof window === "undefined") return;

  // Clear cookies
  removeCookie(COOKIE_TOKEN);
  removeCookie(COOKIE_REFRESH);

  // Clear localStorage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * Login user
 */
export async function login(
  credentials: LoginCredentials
): Promise<{ user: User; tokens: AuthTokens }> {
  const response = await api.post<{ user: User; tokens: AuthTokens }>(
    "/auth/login",
    credentials
  );
  setTokens(response.tokens);
  return response;
}

/**
 * Register user
 */
export async function register(
  data: RegisterData
): Promise<{ user: User; tokens: AuthTokens }> {
  const response = await api.post<{ user: User; tokens: AuthTokens }>(
    "/auth/register",
    data
  );
  setTokens(response.tokens);
  return response;
}

/**
 * Social login (Google / GitHub)
 * Sends the authorization code to the backend, which exchanges it for user info.
 */
export async function socialLogin(
  provider: "google" | "github",
  payload: { code: string; redirect_uri?: string }
): Promise<{ tokens: AuthTokens }> {
  const response = await api.post<{
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  }>(`/auth/oauth/${provider}`, {
    code: payload.code,
    redirect_uri: payload.redirect_uri || "",
  });
  // Backend returns snake_case; map to camelCase for setTokens
  const tokens: AuthTokens = {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
  };
  setTokens(tokens);
  return { tokens };
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // Ignore errors during logout
  } finally {
    clearTokens();
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  if (!isAuthenticated()) return null;

  try {
    return await api.get<User>("/auth/me");
  } catch {
    clearTokens();
    return null;
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(): Promise<AuthTokens | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const tokens = await api.post<AuthTokens>("/auth/refresh", {
      refreshToken,
    });
    setTokens(tokens);
    return tokens;
  } catch {
    clearTokens();
    return null;
  }
}
