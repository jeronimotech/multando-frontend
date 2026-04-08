'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from '@/lib/date-utils';
import { Card, CardContent } from '@/components/ui/card';
import type { ReportSummary, VehicleType, ReportStatus } from '@/types/report';
import {
  Car,
  Bike,
  Truck,
  Bus,
  CircleParking,
  HelpCircle,
  MapPin,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export interface ReportCardProps {
  report: ReportSummary;
  className?: string;
  showImage?: boolean;
  compact?: boolean;
}

// Vehicle type icons
const vehicleIcons: Record<VehicleType, React.ComponentType<{ className?: string }>> = {
  car: Car,
  motorcycle: Bike,
  truck: Truck,
  bus: Bus,
  van: CircleParking,
  bicycle: Bike,
  other: HelpCircle,
};

// Status badge component
const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      dotClassName: 'bg-blue-500',
    },
    verified: {
      label: 'Verified',
      className: 'bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-200',
      dotClassName: 'bg-success-500',
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-danger-100 text-danger-800 dark:bg-danger-900/50 dark:text-danger-200',
      dotClassName: 'bg-danger-500',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClassName)} />
      {config.label}
    </span>
  );
};

export function ReportCard({
  report,
  className,
  showImage = true,
  compact = false,
}: ReportCardProps) {
  const VehicleIcon = vehicleIcons[report.vehicleType] || vehicleIcons.other;

  if (compact) {
    return (
      <Link href={`/reports/${report.id}`}>
        <Card
          className={cn(
            'transition-all hover:shadow-md hover:border-brand-500/50',
            className
          )}
        >
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              {/* Vehicle icon */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-700">
                <VehicleIcon className="h-5 w-5 text-surface-600 dark:text-surface-300" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-semibold text-surface-900 dark:text-white truncate">
                    {report.vehiclePlate}
                  </span>
                  <StatusBadge status={report.status} />
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                  {typeof report.infraction === 'object' ? (report.infraction as any)?.name_en || (report.infraction as any)?.code : report.infraction}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/reports/${report.id}`}>
      <Card
        className={cn(
          'overflow-hidden transition-all hover:shadow-lg hover:border-brand-500/50',
          className
        )}
      >
        {/* Image thumbnail */}
        {showImage && report.thumbnailUrl && (
          <div className="relative aspect-video overflow-hidden bg-surface-100 dark:bg-surface-800">
            <img
              src={report.thumbnailUrl}
              alt={`Report ${report.shortId}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <StatusBadge status={report.status} />
            </div>
          </div>
        )}

        <CardContent className={cn('p-4', !showImage && 'pt-4')}>
          {/* Header with plate and status */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-700">
                <VehicleIcon className="h-5 w-5 text-surface-600 dark:text-surface-300" />
              </div>
              <div>
                <span className="font-mono text-base font-bold text-surface-900 dark:text-white">
                  {report.vehiclePlate}
                </span>
                <p className="text-xs text-surface-500 dark:text-surface-400">
                  ID: {report.shortId}
                </p>
              </div>
            </div>
            {!showImage && <StatusBadge status={report.status} />}
          </div>

          {/* Infraction */}
          <div className="mb-3 flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning-500" />
            <div>
              <p className="text-sm font-medium text-surface-900 dark:text-white">
                {typeof report.infraction === 'object' ? (report.infraction as any)?.name_en || (report.infraction as any)?.code : report.infraction}
              </p>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Code: {typeof report.infraction === 'object' ? (report.infraction as any)?.code : report.infractionCode}
              </p>
            </div>
          </div>

          {/* Location and time */}
          <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400">
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate max-w-[120px]">
                {report.location.city || 'Unknown location'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDistanceToNow(report.createdAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Skeleton loader for report card
export function ReportCardSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-surface-200 dark:bg-surface-700" />
            <div className="flex-1">
              <div className="h-4 w-24 rounded bg-surface-200 dark:bg-surface-700" />
              <div className="mt-1 h-3 w-32 rounded bg-surface-200 dark:bg-surface-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-pulse overflow-hidden">
      <div className="aspect-video bg-surface-200 dark:bg-surface-700" />
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-surface-200 dark:bg-surface-700" />
          <div>
            <div className="h-4 w-20 rounded bg-surface-200 dark:bg-surface-700" />
            <div className="mt-1 h-3 w-16 rounded bg-surface-200 dark:bg-surface-700" />
          </div>
        </div>
        <div className="mb-3">
          <div className="h-4 w-full rounded bg-surface-200 dark:bg-surface-700" />
          <div className="mt-1 h-3 w-24 rounded bg-surface-200 dark:bg-surface-700" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-20 rounded bg-surface-200 dark:bg-surface-700" />
          <div className="h-3 w-16 rounded bg-surface-200 dark:bg-surface-700" />
        </div>
      </CardContent>
    </Card>
  );
}

export default ReportCard;
