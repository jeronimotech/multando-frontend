'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useInfractions, INFRACTION_CATEGORIES, type InfractionCategory, type InfractionWithIcon } from '@/hooks/use-infractions';
import { useReportForm } from '@/hooks/use-report-form';
import {
  Search,
  Gauge,
  ShieldAlert,
  ParkingCircle,
  Users,
  AlertTriangle,
  CircleStop,
  ShieldX,
  Smartphone,
  HardHat,
  Wine,
  ArrowLeftRight,
  ParkingCircleOff,
  Square,
  DoorClosed,
  Accessibility,
  Flame,
  Angry,
  Merge,
  CornerUpRight,
  CarFront,
  Volume2,
  CircleHelp,
} from 'lucide-react';

// Icon mapping for infractions
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Gauge,
  ShieldAlert,
  ParkingCircle,
  Users,
  AlertTriangle,
  CircleStop,
  ShieldX,
  Smartphone,
  HardHat,
  Wine,
  ArrowLeftRight,
  ParkingCircleOff,
  Square,
  DoorClosed,
  Accessibility,
  Flame,
  Angry,
  Merge,
  CornerUpRight,
  CarFront,
  Volume2,
  CircleHelp,
};

interface InfractionSelectProps {
  className?: string;
}

export function InfractionSelect({ className }: InfractionSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<InfractionCategory | 'all'>('all');

  const { data: infractions, isLoading } = useInfractions();
  const { infraction: selectedInfraction, setInfraction } = useReportForm();

  // Filter infractions based on search and category
  const filteredInfractions = useMemo(() => {
    if (!infractions) return [];

    return infractions.filter((inf) => {
      const matchesCategory = activeCategory === 'all' || inf.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inf.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inf.code.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [infractions, activeCategory, searchQuery]);

  // Group by category for display
  const groupedInfractions = useMemo(() => {
    if (activeCategory !== 'all') {
      return { [activeCategory]: filteredInfractions };
    }

    return filteredInfractions.reduce(
      (acc, inf) => {
        const cat = inf.category as InfractionCategory;
        if (!acc[cat]) {
          acc[cat] = [];
        }
        acc[cat].push(inf);
        return acc;
      },
      {} as Record<InfractionCategory, InfractionWithIcon[]>
    );
  }, [filteredInfractions, activeCategory]);

  const handleSelect = (inf: InfractionWithIcon) => {
    setInfraction({
      id: inf.id,
      code: inf.code,
      name: inf.name,
      description: inf.description,
      fineAmount: inf.fineAmount,
      points: inf.points,
      category: inf.category,
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
        <Input
          type="text"
          placeholder="Search infractions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            activeCategory === 'all'
              ? 'bg-brand-500 text-white'
              : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700'
          )}
        >
          All
        </button>
        {INFRACTION_CATEGORIES.map((cat) => {
          const CategoryIcon = ICON_MAP[cat.icon] || CircleHelp;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                activeCategory === cat.id
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700'
              )}
            >
              <CategoryIcon className="h-4 w-4" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-surface-200 bg-surface-100 dark:border-surface-700 dark:bg-surface-800"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredInfractions.length === 0 && (
        <div className="rounded-xl border border-surface-200 bg-surface-50 p-8 text-center dark:border-surface-700 dark:bg-surface-800/50">
          <Search className="mx-auto h-12 w-12 text-surface-300 dark:text-surface-600" />
          <h3 className="mt-4 text-lg font-medium text-surface-900 dark:text-white">
            No infractions found
          </h3>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      )}

      {/* Infraction grid */}
      {!isLoading && Object.entries(groupedInfractions).length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedInfractions).map(([category, items]) => {
            const categoryInfo = INFRACTION_CATEGORIES.find((c) => c.id === category);

            return (
              <div key={category}>
                {activeCategory === 'all' && categoryInfo && (
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
                    {categoryInfo.name}
                  </h3>
                )}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((inf) => {
                    const Icon = ICON_MAP[inf.icon] || AlertTriangle;
                    const isSelected = selectedInfraction?.id === inf.id;

                    return (
                      <button
                        key={inf.id}
                        type="button"
                        onClick={() => handleSelect(inf)}
                        className={cn(
                          'relative flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-200',
                          isSelected
                            ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500 dark:bg-brand-900/20'
                            : 'border-surface-200 bg-white hover:border-brand-300 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:hover:border-brand-700 dark:hover:bg-surface-700'
                        )}
                      >
                        {/* Selected indicator */}
                        {isSelected && (
                          <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}

                        {/* Icon */}
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-lg',
                            isSelected
                              ? 'bg-brand-500 text-white'
                              : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <h4 className="mt-3 font-medium text-surface-900 dark:text-white">
                          {inf.name}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-sm text-surface-500 dark:text-surface-400">
                          {inf.description}
                        </p>

                        {/* Fine info */}
                        <div className="mt-3 flex items-center gap-3 text-xs">
                          <span className="rounded-full bg-danger-100 px-2 py-0.5 font-medium text-danger-700 dark:bg-danger-900/30 dark:text-danger-400">
                            ${inf.fineAmount.toLocaleString()}
                          </span>
                          <span className="rounded-full bg-accent-100 px-2 py-0.5 font-medium text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">
                            {inf.points} pts
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InfractionSelect;
