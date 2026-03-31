'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Filter,
  X,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

interface MapFilters {
  statuses: string[];
  infractionTypes: string[];
  dateRange: string;
}

interface FilterOverlayProps {
  filters: MapFilters;
  onFiltersChange: (filters: MapFilters) => void;
}

const STATUS_OPTIONS = [
  { id: 'pending', labelKey: 'map_filters.pending' as const, color: 'bg-brand-500' },
  { id: 'verified', labelKey: 'map_filters.verified' as const, color: 'bg-success-500' },
  { id: 'rejected', labelKey: 'map_filters.rejected' as const, color: 'bg-danger-500' },
];

const DATE_RANGE_OPTIONS = [
  { id: '24h', labelKey: 'map_filters.last_24h' as const },
  { id: '7d', labelKey: 'map_filters.last_7d' as const },
  { id: '30d', labelKey: 'map_filters.last_30d' as const },
  { id: 'all', labelKey: 'map_filters.all_time' as const },
];

const INFRACTION_TYPES = [
  'Speeding',
  'Illegal Parking',
  'Running Red Light',
  'Phone While Driving',
  'No Seatbelt',
  'Other',
];

export function FilterOverlay({ filters, onFiltersChange }: FilterOverlayProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleStatus = (status: string) => {
    const next = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: next });
  };

  const toggleInfraction = (type: string) => {
    const next = filters.infractionTypes.includes(type)
      ? filters.infractionTypes.filter((t) => t !== type)
      : [...filters.infractionTypes, type];
    onFiltersChange({ ...filters, infractionTypes: next });
  };

  const activeCount =
    filters.statuses.length +
    filters.infractionTypes.length +
    (filters.dateRange !== 'all' ? 1 : 0);

  return (
    <div className="absolute left-4 top-4 z-[1000]">
      {/* Toggle button */}
      <Button
        variant={isOpen ? 'primary' : 'secondary'}
        size="md"
        leftIcon={<Filter className="h-4 w-4" />}
        onClick={() => setIsOpen(!isOpen)}
        className="shadow-lg"
      >
        {t('map_filters.filters')}
        {activeCount > 0 && (
          <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-xs">
            {activeCount}
          </span>
        )}
      </Button>

      {/* Filter panel */}
      {isOpen && (
        <Card className="mt-2 w-72 p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
              {t('map_filters.map_filters')}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Status */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-surface-500">{t('map_filters.status')}</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status.id}
                  onClick={() => toggleStatus(status.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
                    filters.statuses.includes(status.id)
                      ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200 dark:bg-brand-950/30 dark:text-brand-300'
                      : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300'
                  )}
                >
                  <span className={cn('h-2 w-2 rounded-full', status.color)} />
                  {t(status.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-surface-500">{t('map_filters.time_period')}</p>
            <div className="grid grid-cols-2 gap-1.5">
              {DATE_RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() =>
                    onFiltersChange({ ...filters, dateRange: opt.id })
                  }
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                    filters.dateRange === opt.id
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300'
                  )}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Infraction types */}
          <div>
            <p className="mb-2 text-xs font-medium text-surface-500">{t('map_filters.violation_type')}</p>
            <div className="flex flex-wrap gap-1.5">
              {INFRACTION_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleInfraction(type)}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors',
                    filters.infractionTypes.includes(type)
                      ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-200 dark:bg-brand-950/30 dark:text-brand-300'
                      : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300'
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Clear all */}
          {activeCount > 0 && (
            <button
              onClick={() =>
                onFiltersChange({
                  statuses: [],
                  infractionTypes: [],
                  dateRange: 'all',
                })
              }
              className="mt-3 w-full text-center text-xs font-medium text-brand-500 hover:text-brand-600"
            >
              {t('map_filters.clear_all')}
            </button>
          )}
        </Card>
      )}
    </div>
  );
}
