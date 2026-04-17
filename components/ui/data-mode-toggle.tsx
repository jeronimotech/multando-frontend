'use client';

import { useDataMode, type DataMode } from '@/hooks/use-api-base-url';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

interface DataModeToggleProps {
  className?: string;
  /**
   * When true, renders a more compact pill (for tight mobile contexts).
   */
  compact?: boolean;
}

/**
 * Stripe-style live/test data switch.
 *
 * - Two-segment pill: Production (default) and Sandbox.
 * - Active segment gets a white/elevated chip; inactive is transparent.
 * - Sandbox mode tints the pill amber to signal non-production data.
 */
export function DataModeToggle({ className, compact = false }: DataModeToggleProps) {
  const { mode, setMode } = useDataMode();
  const { t } = useTranslation();

  const isSandbox = mode === 'sandbox';

  const prodLabel = t('header.mode_production');
  const sandLabel = t('header.mode_sandbox');

  const segments: Array<{
    value: DataMode;
    label: string;
    tooltip: string;
  }> = [
    {
      value: 'production',
      label: compact ? prodLabel.slice(0, 4) : prodLabel,
      tooltip: t('header.mode_tooltip_prod'),
    },
    {
      value: 'sandbox',
      label: compact ? sandLabel.slice(0, 4) : sandLabel,
      tooltip: t('header.mode_tooltip_sandbox'),
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Data source"
      className={cn(
        'inline-flex items-center rounded-full border p-0.5 transition-colors',
        compact ? 'text-[11px]' : 'text-xs',
        isSandbox
          ? 'border-amber-300 bg-amber-50 dark:border-amber-700/60 dark:bg-amber-950/40'
          : 'border-surface-200 bg-surface-100 dark:border-surface-700 dark:bg-surface-800',
        className
      )}
    >
      {segments.map((seg) => {
        const active = mode === seg.value;
        return (
          <button
            key={seg.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={seg.tooltip}
            onClick={() => {
              if (!active) setMode(seg.value);
            }}
            className={cn(
              'relative inline-flex items-center gap-1.5 rounded-full font-medium transition-all',
              compact ? 'px-2.5 py-1' : 'px-3 py-1.5',
              active
                ? seg.value === 'sandbox'
                  ? 'bg-amber-400 text-amber-950 shadow-sm dark:bg-amber-500 dark:text-amber-50'
                  : 'bg-white text-surface-900 shadow-sm dark:bg-surface-900 dark:text-white'
                : seg.value === 'sandbox' && isSandbox
                  ? 'text-amber-700 dark:text-amber-200'
                  : 'text-surface-500 hover:text-surface-800 dark:text-surface-400 dark:hover:text-surface-100'
            )}
          >
            <span
              aria-hidden
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                seg.value === 'production'
                  ? active
                    ? 'bg-emerald-500'
                    : 'bg-emerald-400/60'
                  : active
                    ? 'bg-amber-950 dark:bg-amber-50'
                    : 'bg-amber-500/70'
              )}
            />
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}

export default DataModeToggle;
