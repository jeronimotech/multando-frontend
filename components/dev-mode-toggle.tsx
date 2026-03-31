'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Code2, FlaskConical, Rocket } from 'lucide-react';

const SANDBOX_API = 'https://sandbox-api.multando.com';
const PRODUCTION_API = 'https://api.multando.com';
const STORAGE_KEY = 'multando_api_mode';

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API;
  }
  const mode = localStorage.getItem(STORAGE_KEY);
  if (mode === 'sandbox') return SANDBOX_API;
  return process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API;
}

export function isDevMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'sandbox';
}

export function DevModeBanner() {
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    setDevMode(localStorage.getItem(STORAGE_KEY) === 'sandbox');
  }, []);

  if (!devMode) return null;

  return (
    <div className="bg-accent-500 px-4 py-1.5 text-center text-xs font-medium text-white">
      <FlaskConical className="mr-1 inline h-3.5 w-3.5" />
      SANDBOX MODE — Data is test-only. API: sandbox-api.multando.com
      <button
        onClick={() => {
          localStorage.removeItem(STORAGE_KEY);
          window.location.reload();
        }}
        className="ml-3 rounded bg-white/20 px-2 py-0.5 text-[10px] hover:bg-white/30"
      >
        Exit
      </button>
    </div>
  );
}

export function DevModeToggle() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'production' | 'sandbox'>('production');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setMode(stored === 'sandbox' ? 'sandbox' : 'production');
  }, []);

  const handleToggle = (newMode: 'production' | 'sandbox') => {
    setMode(newMode);
    if (newMode === 'sandbox') {
      localStorage.setItem(STORAGE_KEY, 'sandbox');
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    window.location.reload();
  };

  return (
    <div className="rounded-xl border border-surface-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-800">
      <div className="flex items-center gap-3 mb-4">
        <Code2 className="h-5 w-5 text-brand-500" />
        <div>
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
            Developer Mode
          </h3>
          <p className="text-xs text-surface-500">
            Switch between production and sandbox API
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleToggle('production')}
          className={cn(
            'flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all',
            mode === 'production'
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
              : 'border-surface-200 hover:border-surface-300 dark:border-surface-600'
          )}
        >
          <Rocket className={cn('h-5 w-5', mode === 'production' ? 'text-brand-500' : 'text-surface-400')} />
          <div>
            <p className={cn('text-sm font-medium', mode === 'production' ? 'text-brand-700 dark:text-brand-300' : 'text-surface-700 dark:text-surface-300')}>
              Production
            </p>
            <p className="text-[10px] text-surface-500">api.multando.com</p>
          </div>
        </button>

        <button
          onClick={() => handleToggle('sandbox')}
          className={cn(
            'flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all',
            mode === 'sandbox'
              ? 'border-accent-500 bg-accent-50 dark:bg-accent-950/30'
              : 'border-surface-200 hover:border-surface-300 dark:border-surface-600'
          )}
        >
          <FlaskConical className={cn('h-5 w-5', mode === 'sandbox' ? 'text-accent-500' : 'text-surface-400')} />
          <div>
            <p className={cn('text-sm font-medium', mode === 'sandbox' ? 'text-accent-700 dark:text-accent-300' : 'text-surface-700 dark:text-surface-300')}>
              Sandbox
            </p>
            <p className="text-[10px] text-surface-500">sandbox-api.multando.com</p>
          </div>
        </button>
      </div>
    </div>
  );
}
