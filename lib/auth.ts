import { api } from "./api";

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

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Store authentication tokens
 */
export function setTokens(tokens: AuthTokens): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

/**
 * Get the current access token
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get the current refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Clear authentication tokens
 */
export function clearTokens(): void {
  if (typeof window === "undefined") return;
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
