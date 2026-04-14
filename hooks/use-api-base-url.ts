'use client';

import { useCallback, useEffect, useState } from 'react';

export type DataMode = 'production' | 'sandbox';

export const PROD_URL = 'https://api.multando.com/api/v1';
export const SANDBOX_URL = 'https://sandbox-api.multando.com/api/v1';
const STORAGE_KEY = 'multando_data_mode';
const CHANGE_EVENT = 'multando:data-mode-change';

function readStoredMode(): DataMode {
  if (typeof window === 'undefined') return 'production';
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'sandbox' || saved === 'production') return saved;
  } catch {
    // ignore localStorage access errors (SSR / private mode)
  }
  return 'production';
}

/**
 * Stripe-style data mode switch.
 *
 * Returns the currently active mode, a setter that persists to localStorage,
 * and the API base URL to use for public data endpoints.
 *
 * Default mode is always `production` — a first-time visitor sees real data.
 * Changes fan out to all subscribers on the page via a custom window event.
 */
export function useDataMode(): {
  mode: DataMode;
  setMode: (m: DataMode) => void;
  baseUrl: string;
} {
  const [mode, setModeState] = useState<DataMode>('production');

  // Hydrate from localStorage on mount, and subscribe to cross-component changes.
  useEffect(() => {
    setModeState(readStoredMode());

    const handleChange = (e: Event) => {
      const detail = (e as CustomEvent<DataMode>).detail;
      if (detail === 'sandbox' || detail === 'production') {
        setModeState(detail);
      } else {
        setModeState(readStoredMode());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setModeState(readStoredMode());
      }
    };

    window.addEventListener(CHANGE_EVENT, handleChange as EventListener);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handleChange as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const setMode = useCallback((m: DataMode) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, m);
    } catch {
      // ignore
    }
    setModeState(m);
    window.dispatchEvent(new CustomEvent<DataMode>(CHANGE_EVENT, { detail: m }));
  }, []);

  const baseUrl = mode === 'sandbox' ? SANDBOX_URL : PROD_URL;
  return { mode, setMode, baseUrl };
}
