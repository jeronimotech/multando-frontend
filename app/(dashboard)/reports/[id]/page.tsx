'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DynamicReportMap } from '@/components/map/dynamic-map';
import { ReportActions } from '@/components/reports/report-actions';
import { useReport } from '@/hooks/use-reports';
import { useTranslation } from '@/hooks/use-translation';
import { formatDistanceToNow, formatDateTime } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import type { ReportStatus, VehicleType, Evidence } from '@/types/report';
import {
  ArrowLeft,
  Car,
  Bike,
  Truck,
  Bus,
  CircleParking,
  HelpCircle,
  MapPin,
  Clock,
  AlertTriangle,
  Shield,
  User,
  Calendar,
  Image as ImageIcon,
  Video,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Award,
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

// Status badge component
const StatusBadge = ({ status }: { status: ReportStatus }) => {
  const { t } = useTranslation();
  const statusConfig = {
    pending: {
      label: t('reports.pending'),
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      dotClassName: 'bg-blue-500',
    },
    verified: {
      label: t('reports.verified'),
      className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
      dotClassName: 'bg-green-500',
    },
    rejected: {
      label: t('reports.rejected'),
      className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
      dotClassName: 'bg-red-500',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
        config.className
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', config.dotClassName)} />
      {config.label}
    </span>
  );
};

// Evidence lightbox component
interface LightboxProps {
  evidence: Evidence[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function EvidenceLightbox({ evidence, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const current = evidence[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {evidence.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      <div className="max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        {current.type === 'image' ? (
          <img
            src={current.url}
            alt={`Evidence ${currentIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        ) : (
          <video
            src={current.url}
            controls
            autoPlay
            className="max-h-[90vh] max-w-[90vw]"
          />
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-white">
        {currentIndex + 1} / {evidence.length}
      </div>
    </div>
  );
}

// Evidence gallery component
interface EvidenceGalleryProps {
  evidence: Evidence[];
}

function EvidenceGallery({ evidence }: EvidenceGalleryProps) {
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + evidence.length) % evidence.length : null));
  }, [evidence.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % evidence.length : null));
  }, [evidence.length]);

  if (!evidence.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-surface-400">
        <ImageIcon className="mb-2 h-12 w-12" />
        <p>{t('reports.no_evidence')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {evidence.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-surface-100 dark:bg-surface-700"
          >
            {item.type === 'image' ? (
              <img
                src={item.thumbnailUrl || item.url}
                alt={`Evidence ${index + 1}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="relative h-full w-full">
                <img
                  src={item.thumbnailUrl || '/video-placeholder.jpg'}
                  alt={`Video ${index + 1}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="rounded-full bg-white/90 p-3">
                    <Play className="h-6 w-6 text-surface-900" />
                  </div>
                </div>
              </div>
            )}
            <div className="absolute bottom-2 right-2 rounded bg-black/50 p-1">
              {item.type === 'image' ? (
                <ImageIcon className="h-4 w-4 text-white" />
              ) : (
                <Video className="h-4 w-4 text-white" />
              )}
            </div>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <EvidenceLightbox
          evidence={evidence}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}

// Loading skeleton
function ReportDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-lg bg-surface-200 dark:bg-surface-700" />
        <div className="flex-1">
          <div className="h-6 w-32 rounded bg-surface-200 dark:bg-surface-700" />
          <div className="mt-2 h-4 w-48 rounded bg-surface-200 dark:bg-surface-700" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 rounded-xl bg-surface-200 dark:bg-surface-700" />
        <div className="h-64 rounded-xl bg-surface-200 dark:bg-surface-700" />
      </div>
      <div className="h-48 rounded-xl bg-surface-200 dark:bg-surface-700" />
    </div>
  );
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const reportId = params.id as string;
  const { data: report, isLoading, error } = useReport(reportId);

  // Mock user data - in real app this would come from auth context
  const currentUserId = 'user-1';
  const isOwner = report?.reporter.id === currentUserId;
  const isVerifier = true; // In real app, check if user has verifier role
  const isPending = report?.status === 'pending';

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <ReportDetailSkeleton />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="mb-4 h-12 w-12 text-red-500" />
            <h2 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">
              {t('common.error')}
            </h2>
            <p className="mb-4 text-surface-500 dark:text-surface-400">
              {t('reports.not_found')}
            </p>
            <Button onClick={() => router.push('/reports')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const VehicleIcon = vehicleIcons[report.vehicleType] || vehicleIcons.other;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back button and header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/reports"
            className="mb-2 inline-flex items-center text-sm text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t('common.back')}
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              {t('reports.report_detail')}
            </h1>
            <span className="font-mono text-lg text-surface-500 dark:text-surface-400">
              #{report.shortId}
            </span>
            <StatusBadge status={report.status} />
          </div>
        </div>

        <ReportActions
          report={report}
          isOwner={isOwner}
          isVerifier={isVerifier}
          isPending={isPending}
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Vehicle Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <VehicleIcon className="h-5 w-5" />
              {t('reports.vehicle_info')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-surface-500 dark:text-surface-400">
                {t('reports.vehicle_plate')}
              </label>
              <p className="font-mono text-xl font-bold text-surface-900 dark:text-white">
                {report.vehiclePlate}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-surface-500 dark:text-surface-400">
                  {t('reports.vehicle_type')}
                </label>
                <p className="font-medium text-surface-900 capitalize dark:text-white">
                  {report.vehicleType}
                </p>
              </div>
              {report.vehicleColor && (
                <div>
                  <label className="text-sm text-surface-500 dark:text-surface-400">
                    {t('reports.color')}
                  </label>
                  <p className="font-medium text-surface-900 dark:text-white">
                    {report.vehicleColor}
                  </p>
                </div>
              )}
            </div>
            {(report.vehicleMake || report.vehicleModel) && (
              <div>
                <label className="text-sm text-surface-500 dark:text-surface-400">
                  {t('reports.make_model')}
                </label>
                <p className="font-medium text-surface-900 dark:text-white">
                  {[report.vehicleMake, report.vehicleModel].filter(Boolean).join(' ')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Infraction Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {t('reports.infraction')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-surface-500 dark:text-surface-400">
                {t('reports.infraction_type')}
              </label>
              <p className="text-lg font-semibold text-surface-900 dark:text-white">
                {report.infraction.name}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-surface-500 dark:text-surface-400">
                  {t('reports.code')}
                </label>
                <p className="font-mono font-medium text-surface-900 dark:text-white">
                  {report.infraction.code}
                </p>
              </div>
              <div>
                <label className="text-sm text-surface-500 dark:text-surface-400">
                  {t('reports.severity')}
                </label>
                <p className="font-medium text-surface-900 dark:text-white">
                  {report.infraction.points} {t('reports.points')}
                </p>
              </div>
            </div>
            {report.description && (
              <div>
                <label className="text-sm text-surface-500 dark:text-surface-400">
                  {t('reports.description')}
                </label>
                <p className="text-surface-700 dark:text-surface-300">
                  {report.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Location Card with Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('reports.location')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-surface-500 dark:text-surface-400">
                {t('reports.address')}
              </label>
              <p className="font-medium text-surface-900 dark:text-white">
                {report.location.address || t('reports.address_unavailable')}
              </p>
            </div>
            <div>
              <label className="text-sm text-surface-500 dark:text-surface-400">
                {t('reports.city_state')}
              </label>
              <p className="font-medium text-surface-900 dark:text-white">
                {[report.location.city, report.location.state].filter(Boolean).join(', ') ||
                  t('reports.location_unavailable')}
              </p>
            </div>
          </div>
          <div className="h-64 overflow-hidden rounded-lg">
            <DynamicReportMap
              markers={[
                {
                  id: report.id,
                  shortId: report.shortId,
                  latitude: report.location.latitude,
                  longitude: report.location.longitude,
                  infraction: report.infraction.name,
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
        </CardContent>
      </Card>

      {/* Date/Time Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('reports.date_time')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm text-surface-500 dark:text-surface-400">
                {t('reports.reported_at')}
              </label>
              <p className="font-medium text-surface-900 dark:text-white">
                {formatDateTime(report.createdAt)}
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {formatDistanceToNow(report.createdAt)}
              </p>
            </div>
            {report.verifiedAt && (
              <div>
                <label className="text-sm text-surface-500 dark:text-surface-400">
                  {t('reports.verified_at')}
                </label>
                <p className="font-medium text-surface-900 dark:text-white">
                  {formatDateTime(report.verifiedAt)}
                </p>
              </div>
            )}
            {report.rejectedAt && (
              <div>
                <label className="text-sm text-surface-500 dark:text-surface-400">
                  {t('reports.rejected_at')}
                </label>
                <p className="font-medium text-surface-900 dark:text-white">
                  {formatDateTime(report.rejectedAt)}
                </p>
                {report.rejectionReason && (
                  <p className="mt-1 text-sm text-red-500">
                    {t('reports.reason')}: {report.rejectionReason}
                  </p>
                )}
              </div>
            )}
            <div>
              <label className="text-sm text-surface-500 dark:text-surface-400">
                {t('reports.last_updated')}
              </label>
              <p className="font-medium text-surface-900 dark:text-white">
                {formatDateTime(report.updatedAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            {t('reports.evidence')}
            <span className="ml-2 rounded-full bg-surface-100 px-2 py-0.5 text-sm font-normal text-surface-600 dark:bg-surface-700 dark:text-surface-300">
              {report.evidence.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EvidenceGallery evidence={report.evidence} />
        </CardContent>
      </Card>

      {/* Reporter Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('reports.reporter')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
              {report.reporter.avatar ? (
                <img
                  src={report.reporter.avatar}
                  alt={report.reporter.displayName}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-brand-500" />
              )}
            </div>
            <div>
              <p className="font-semibold text-surface-900 dark:text-white">
                {report.reporter.displayName}
              </p>
              <div className="flex items-center gap-4 text-sm text-surface-500 dark:text-surface-400">
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  {report.reporter.totalReports} {t('reports.total_reports')}
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-500" />
                  {report.reporter.verifiedReports} {t('reports.verified')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t('reports.verification_status')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
                <span className="text-lg font-bold">{report.verifications.upvotes}</span>
              </div>
              <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                {t('verification.upvotes')}
              </p>
            </div>
            <div className="text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
                <span className="text-lg font-bold">{report.verifications.downvotes}</span>
              </div>
              <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
                {t('verification.downvotes')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Info (if applicable) */}
      {report.reward && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              {t('reports.reward')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm text-surface-500 dark:text-surface-400">
                  {t('reports.amount')}
                </label>
                <p className="text-xl font-bold text-surface-900 dark:text-white">
                  {report.reward.amount} {report.reward.currency}
                </p>
              </div>
              <div>
                <label className="text-sm text-surface-500 dark:text-surface-400">
                  {t('reports.status')}
                </label>
                <p className={cn(
                  'font-medium capitalize',
                  report.reward.status === 'paid' && 'text-green-600',
                  report.reward.status === 'pending' && 'text-yellow-600',
                  report.reward.status === 'cancelled' && 'text-red-600'
                )}>
                  {report.reward.status}
                </p>
              </div>
              {report.reward.paidAt && (
                <div>
                  <label className="text-sm text-surface-500 dark:text-surface-400">
                    {t('reports.paid_at')}
                  </label>
                  <p className="font-medium text-surface-900 dark:text-white">
                    {formatDateTime(report.reward.paidAt)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
