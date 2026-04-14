'use client';

import { useDataMode } from '@/hooks/use-api-base-url';
import { useTranslation } from '@/hooks/use-translation';
import { Wrench } from 'lucide-react';

/**
 * Amber banner shown below the header whenever the user is browsing
 * sandbox data. Invisible in production mode.
 */
export function SandboxBanner() {
  const { mode, setMode } = useDataMode();
  const { t } = useTranslation();

  if (mode !== 'sandbox') return null;

  return (
    <div
      role="status"
      className="border-b border-amber-300 bg-amber-100/80 text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/60 dark:text-amber-100"
    >
      <div className="container-app">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-sm">
          <span className="inline-flex items-center gap-2 font-medium">
            <Wrench className="h-4 w-4" aria-hidden />
            {t('sandbox_banner.viewing')}
          </span>
          <button
            type="button"
            onClick={() => setMode('production')}
            className="rounded-full bg-amber-200/80 px-3 py-0.5 text-xs font-semibold text-amber-900 underline-offset-2 transition-colors hover:bg-amber-300 hover:underline dark:bg-amber-900/60 dark:text-amber-100 dark:hover:bg-amber-800"
          >
            {t('sandbox_banner.switch')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SandboxBanner;
