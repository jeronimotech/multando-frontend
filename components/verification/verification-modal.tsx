'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DynamicReportMap } from '@/components/map/dynamic-map';
import { useReport } from '@/hooks/use-reports';
import { useTranslation } from '@/hooks/use-translation';
import { formatDistanceToNow, formatDateTime } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import type { ReportSummary, VehicleType, Evidence } from '@/types/report';
import {
  X,
  CheckCircle,
  XCircle,
  SkipForward,
  Award,
  MapPin,
  Clock,
  Car,
  Bike,
  Truck,
  Bus,
  CircleParking,
  HelpCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
  Video,
} from 'lucide-react';

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

interface VerificationModalProps {
  report: ReportSummary;
  isOpen: boolean;
  initialAction?: 'verify' | 'reject' | null;
  onClose: () => void;
  onVerify: (reason?: string) => void;
  onReject: (reason: string) => void;
  onSkip?: () => void;
  isLoading?: boolean;
}

// Evidence gallery for modal
function ModalEvidenceGallery({ evidence }: { evidence: Evidence[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!evidence.length) {
    return (
      <div className="flex h-64 items-center justify-center bg-surface-100 dark:bg-surface-700">
        <div className="text-center text-surface-400">
          <ImageIcon className="mx-auto mb-2 h-12 w-12" />
          <p>No evidence</p>
        </div>
      </div>
    );
  }

  const current = evidence[currentIndex];

  return (
    <div className="relative">
      {/* Main evidence display */}
      <div className="relative aspect-video w-full overflow-hidden bg-surface-900">
        {current.type === 'image' ? (
          <img
            src={current.url}
            alt={`Evidence ${currentIndex + 1}`}
            className="h-full w-full object-contain"
          />
        ) : (
          <video
            src={current.url}
            controls
            className="h-full w-full object-contain"
          />
        )}

        {/* Navigation buttons */}
        {evidence.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + evidence.length) % evidence.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % evidence.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
          {currentIndex + 1} / {evidence.length}
        </div>
      </div>

      {/* Thumbnails */}
      {evidence.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-2">
          {evidence.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2',
                index === currentIndex
                  ? 'border-brand-500'
                  : 'border-transparent opacity-60 hover:opacity-100'
              )}
            >
              <img
                src={item.thumbnailUrl || item.url}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function VerificationModal({
  report,
  isOpen,
  initialAction,
  onClose,
  onVerify,
  onReject,
  onSkip,
  isLoading = false,
}: VerificationModalProps) {
  const { t } = useTranslation();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(initialAction === 'reject');
  const [reasonError, setReasonError] = useState('');

  // Fetch full report details
  const { data: fullReport, isLoading: isLoadingReport } = useReport(report.id);

  const VehicleIcon = vehicleIcons[report.vehicleType] || vehicleIcons.other;

  // Points to be earned
  const pointsToEarn = 10;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRejectionReason('');
      setShowRejectInput(initialAction === 'reject');
      setReasonError('');
    }
  }, [isOpen, initialAction]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerify = () => {
    onVerify();
  };

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }

    if (!rejectionReason.trim()) {
      setReasonError(t('verification.reason_required'));
      return;
    }

    onReject(rejectionReason);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-surface-800">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-surface-100 p-2 text-surface-600 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="border-b border-surface-200 p-6 dark:border-surface-700">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/50">
              <VehicleIcon className="h-6 w-6 text-brand-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">
                {t('verification.review_report')}
              </h2>
              <p className="mt-1 font-mono text-sm text-surface-500 dark:text-surface-400">
                #{report.shortId}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1.5 dark:bg-yellow-900/50">
              <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                +{pointsToEarn} {t('verification.points')}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoadingReport ? (
            <div className="animate-pulse space-y-4">
              <div className="aspect-video w-full rounded-lg bg-surface-200 dark:bg-surface-700" />
              <div className="h-4 w-3/4 rounded bg-surface-200 dark:bg-surface-700" />
              <div className="h-4 w-1/2 rounded bg-surface-200 dark:bg-surface-700" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Evidence Gallery */}
              <div>
                <h3 className="mb-2 text-sm font-semibold text-surface-700 dark:text-surface-300">
                  {t('reports.evidence')}
                </h3>
                <div className="overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700">
                  <ModalEvidenceGallery evidence={fullReport?.evidence || []} />
                </div>
              </div>

              {/* Report Details Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Vehicle Info */}
                <div className="rounded-lg bg-surface-50 p-4 dark:bg-surface-700/50">
                  <h3 className="mb-3 text-sm font-semibold text-surface-700 dark:text-surface-300">
                    {t('reports.vehicle_info')}
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        {t('reports.vehicle_plate')}
                      </span>
                      <p className="font-mono text-lg font-bold text-surface-900 dark:text-white">
                        {report.vehiclePlate}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        {t('reports.vehicle_type')}
                      </span>
                      <p className="font-medium capitalize text-surface-900 dark:text-white">
                        {report.vehicleType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Infraction Info */}
                <div className="rounded-lg bg-surface-50 p-4 dark:bg-surface-700/50">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-surface-700 dark:text-surface-300">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    {t('reports.infraction')}
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        {t('reports.type')}
                      </span>
                      <p className="font-medium text-surface-900 dark:text-white">
                        {report.infraction}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        {t('reports.code')}
                      </span>
                      <p className="font-mono text-surface-900 dark:text-white">
                        {report.infractionCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Time */}
              <div className="rounded-lg bg-surface-50 p-4 dark:bg-surface-700/50">
                <h3 className="mb-3 text-sm font-semibold text-surface-700 dark:text-surface-300">
                  {t('reports.location_time')}
                </h3>
                <div className="mb-3 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-surface-400" />
                    <div>
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        {t('reports.location')}
                      </span>
                      <p className="font-medium text-surface-900 dark:text-white">
                        {report.location.city || t('reports.unknown_location')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-surface-400" />
                    <div>
                      <span className="text-xs text-surface-500 dark:text-surface-400">
                        {t('reports.date')}
                      </span>
                      <p className="font-medium text-surface-900 dark:text-white">
                        {formatDistanceToNow(report.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="h-48 overflow-hidden rounded-lg">
                  <DynamicReportMap
                    markers={[
                      {
                        id: report.id,
                        shortId: report.shortId,
                        latitude: report.location.latitude,
                        longitude: report.location.longitude,
                        infraction: report.infraction,
                        vehiclePlate: report.vehiclePlate,
                        status: report.status,
                        createdAt: report.createdAt,
                      },
                    ]}
                    center={[report.location.latitude, report.location.longitude]}
                    zoom={15}
                    className="h-full w-full"
                  />
                </div>
              </div>

              {/* Rejection reason input */}
              {showRejectInput && (
                <div className="rounded-lg border border-danger-200 bg-danger-50 p-4 dark:border-danger-900 dark:bg-danger-900/20">
                  <label className="mb-2 block text-sm font-semibold text-danger-700 dark:text-danger-300">
                    {t('verification.reason')}
                  </label>
                  <Input
                    value={rejectionReason}
                    onChange={(e) => {
                      setRejectionReason(e.target.value);
                      setReasonError('');
                    }}
                    placeholder={t('verification.reason_placeholder')}
                    className={cn(
                      'bg-white dark:bg-surface-800',
                      reasonError && 'border-danger-500'
                    )}
                  />
                  {reasonError && (
                    <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
                      {reasonError}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with action buttons */}
        <div className="border-t border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={isLoading}
            >
              <SkipForward className="mr-2 h-4 w-4" />
              {t('verification.skip')}
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={isLoading}
                className={cn(
                  'border-danger-300 text-danger-600 hover:bg-danger-50',
                  'dark:border-danger-700 dark:text-danger-400 dark:hover:bg-danger-900/20'
                )}
              >
                <XCircle className="mr-2 h-4 w-4" />
                {t('verification.reject')}
              </Button>
              <Button
                onClick={handleVerify}
                disabled={isLoading || showRejectInput}
                className="bg-success-600 hover:bg-success-700"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {t('verification.verify')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationModal;
