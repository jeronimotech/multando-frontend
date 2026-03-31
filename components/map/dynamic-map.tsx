'use client';

import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import type { ReportMapProps } from './report-map';

// Map skeleton for loading state
function MapSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center bg-surface-100 dark:bg-surface-800',
        className
      )}
    >
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
          <svg
            className="h-8 w-8 animate-pulse text-brand-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
            />
          </svg>
        </div>
        <p className="text-sm text-surface-500 dark:text-surface-400">Loading map...</p>
      </div>
    </div>
  );
}

// Dynamic import of the map component with SSR disabled
export const DynamicReportMap = dynamic<ReportMapProps>(
  () => import('./report-map').then((mod) => mod.ReportMap),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);

// Export skeleton for use elsewhere
export { MapSkeleton };

export default DynamicReportMap;
