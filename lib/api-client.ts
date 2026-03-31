import { API_BASE_URL } from './config';
import { getApiBaseUrl } from '@/components/dev-mode-toggle';

/**
 * Get the auth token from cookies (client-side only)
 */
export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/multando_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Set a cookie with the given name and value
 */
export function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Remove a cookie by name
 */
export function removeCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

/**
 * Perform an authenticated GET request
 */
export async function apiGet<T>(path: string): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 401) {
    // Token expired or invalid — redirect to login
    if (typeof window !== 'undefined') {
      removeCookie('multando_token');
      removeCookie('multando_refresh');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}

/**
 * Perform an authenticated POST request
 */
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      removeCookie('multando_token');
      removeCookie('multando_refresh');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}

/**
 * Perform an authenticated PUT request
 */
export async function apiPut<T>(path: string, body?: unknown): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'PUT',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      removeCookie('multando_token');
      removeCookie('multando_refresh');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}

/**
 * Perform an authenticated DELETE request
 */
export async function apiDelete<T>(path: string): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      removeCookie('multando_token');
      removeCookie('multando_refresh');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  return res.json();
}
