'use client';
export const dynamic = "force-dynamic";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VerificationModal } from '@/components/verification/verification-modal';
import { usePendingVerification, useVerificationVote } from '@/hooks/use-reports';
import { useTranslation } from '@/hooks/use-translation';
import { formatDistanceToNow } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import type { ReportSummary, VehicleType } from '@/types/report';
import {
  Shield,
  Award,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Car,
  Bike,
  Truck,
  Bus,
  CircleParking,
  HelpCircle,
  AlertTriangle,
  Inbox,
  ChevronLeft,
  ChevronRight,
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

// Stats card component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  className?: string;
}

function StatCard({ icon, label, value, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/50">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-surface-900 dark:text-white">{value}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Verification queue card component
interface VerificationCardProps {
  report: ReportSummary;
  onVerify: () => void;
  onReject: () => void;
  onViewDetails: () => void;
}

function VerificationCard({ report, onVerify, onReject, onViewDetails }: VerificationCardProps) {
  const { t } = useTranslation();
  const VehicleIcon = vehicleIcons[report.vehicleType] || vehicleIcons.other;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <button
          onClick={onViewDetails}
          className="relative aspect-video w-full flex-shrink-0 bg-surface-100 dark:bg-surface-700 sm:aspect-square sm:w-32"
        >
          {report.thumbnailUrl ? (
            <img
              src={report.thumbnailUrl}
              alt={`Report ${report.shortId}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-surface-400" />
            </div>
          )}
        </button>

        {/* Content */}
        <CardContent className="flex flex-1 flex-col justify-between p-4">
          <div>
            <div className="mb-2 flex items-start justify-between gap-2">
              <button onClick={onViewDetails} className="text-left">
                <div className="flex items-center gap-2">
                  <VehicleIcon className="h-4 w-4 text-surface-500 dark:text-surface-400" />
                  <span className="font-mono text-base font-bold text-surface-900 dark:text-white">
                    {report.vehiclePlate}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-surface-700 dark:text-surface-300">
                  {report.infraction}
                </p>
              </button>
              <span className="flex-shrink-0 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                +10 {t('verification.points')}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-surface-500 dark:text-surface-400">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {report.location.city || t('reports.unknown_location')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDistanceToNow(report.createdAt)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onVerify}
              className="flex-1 bg-success-600 hover:bg-success-700"
            >
              <CheckCircle className="mr-1.5 h-4 w-4" />
              {t('verification.verify')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReject}
              className="flex-1 border-danger-300 text-danger-600 hover:bg-danger-50 dark:border-danger-700 dark:text-danger-400 dark:hover:bg-danger-900/20"
            >
              <XCircle className="mr-1.5 h-4 w-4" />
              {t('verification.reject')}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// Empty state component
function EmptyState() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-700">
          <Inbox className="h-10 w-10 text-surface-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-surface-900 dark:text-white">
          {t('verification.no_reports')}
        </h3>
        <p className="max-w-sm text-center text-surface-500 dark:text-surface-400">
          {t('verification.no_reports_description')}
        </p>
      </CardContent>
    </Card>
  );
}

// Loading skeleton
function VerificationCardSkeleton() {
  return (
    <Card className="animate-pulse overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="aspect-video w-full bg-surface-200 dark:bg-surface-700 sm:aspect-square sm:w-32" />
        <CardContent className="flex-1 p-4">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <div className="h-5 w-24 rounded bg-surface-200 dark:bg-surface-700" />
              <div className="mt-2 h-4 w-32 rounded bg-surface-200 dark:bg-surface-700" />
            </div>
            <div className="h-5 w-16 rounded bg-surface-200 dark:bg-surface-700" />
          </div>
          <div className="mt-2 flex gap-3">
            <div className="h-4 w-20 rounded bg-surface-200 dark:bg-surface-700" />
            <div className="h-4 w-16 rounded bg-surface-200 dark:bg-surface-700" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-8 flex-1 rounded bg-surface-200 dark:bg-surface-700" />
            <div className="h-8 flex-1 rounded bg-surface-200 dark:bg-surface-700" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        {t('common.previous')}
      </Button>
      <span className="px-4 text-sm text-surface-600 dark:text-surface-400">
        {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {t('common.next')}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function VerificationQueuePage() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<ReportSummary | null>(null);
  const [modalAction, setModalAction] = useState<'verify' | 'reject' | null>(null);

  const { data: pendingReports, isLoading, refetch } = usePendingVerification();
  const verifyMutation = useVerificationVote();

  // Mock stats - in real app these would come from API
  const todayStats = {
    verified: 5,
    pointsEarned: 50,
  };

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil((pendingReports?.length || 0) / ITEMS_PER_PAGE);
  const paginatedReports = pendingReports?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleVerify = async (reportId: string, reason?: string) => {
    await verifyMutation.mutateAsync({
      reportId,
      vote: 'up',
      reason,
    });
    setSelectedReport(null);
    setModalAction(null);
    refetch();
  };

  const handleReject = async (reportId: string, reason: string) => {
    await verifyMutation.mutateAsync({
      reportId,
      vote: 'down',
      reason,
    });
    setSelectedReport(null);
    setModalAction(null);
    refetch();
  };

  const openVerifyModal = (report: ReportSummary) => {
    setSelectedReport(report);
    setModalAction('verify');
  };

  const openRejectModal = (report: ReportSummary) => {
    setSelectedReport(report);
    setModalAction('reject');
  };

  const openDetailsModal = (report: ReportSummary) => {
    setSelectedReport(report);
    setModalAction(null);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          {t('verification.title')}
        </h1>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          {t('verification.subtitle')}
        </p>
      </div>

      {/* Stats header */}
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={<Shield className="h-6 w-6 text-brand-500" />}
          label={t('verification.verified_today')}
          value={todayStats.verified}
        />
        <StatCard
          icon={<Award className="h-6 w-6 text-yellow-500" />}
          label={t('verification.points_earned')}
          value={todayStats.pointsEarned}
        />
      </div>

      {/* Queue list */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
            {t('verification.pending_queue')}
          </h2>
          {pendingReports && pendingReports.length > 0 && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              {pendingReports.length} {t('verification.pending')}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <VerificationCardSkeleton key={i} />
            ))}
          </div>
        ) : !paginatedReports || paginatedReports.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="space-y-4">
              {paginatedReports.map((report) => (
                <VerificationCard
                  key={report.id}
                  report={report}
                  onVerify={() => openVerifyModal(report)}
                  onReject={() => openRejectModal(report)}
                  onViewDetails={() => openDetailsModal(report)}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      {/* Verification Modal */}
      {selectedReport && (
        <VerificationModal
          report={selectedReport}
          isOpen={!!selectedReport}
          initialAction={modalAction}
          onClose={() => {
            setSelectedReport(null);
            setModalAction(null);
          }}
          onVerify={(reason) => handleVerify(selectedReport.id, reason)}
          onReject={(reason) => handleReject(selectedReport.id, reason)}
          isLoading={verifyMutation.isPending}
        />
      )}
    </div>
  );
}
