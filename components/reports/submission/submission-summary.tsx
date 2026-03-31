'use client';

import { cn } from '@/lib/utils';
import { useReportForm } from '@/hooks/use-report-form';
import { VEHICLE_CATEGORIES } from '@/hooks/use-vehicle-types';
import { formatDateTime } from '@/lib/date-utils';
import {
  AlertTriangle,
  Car,
  FileText,
  MapPin,
  Clock,
  Camera,
  Check,
  Edit2,
  Image as ImageIcon,
  Video,
} from 'lucide-react';

interface SubmissionSummaryProps {
  className?: string;
  onEditStep: (step: number) => void;
}

export function SubmissionSummary({ className, onEditStep }: SubmissionSummaryProps) {
  const {
    infraction,
    vehicleType,
    vehiclePlate,
    vehicleCategory,
    location,
    locationAddress,
    incidentDateTime,
    evidences,
    description,
    termsAccepted,
    setTermsAccepted,
  } = useReportForm();

  const categoryInfo = vehicleCategory
    ? VEHICLE_CATEGORIES.find((c) => c.id === vehicleCategory)
    : null;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
        <Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <h3 className="font-medium text-blue-900 dark:text-blue-100">
            Review your report
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
            Please review all the information before submitting. You can click the edit
            button on any section to make changes.
          </p>
        </div>
      </div>

      {/* Summary sections */}
      <div className="space-y-4">
        {/* Infraction */}
        <SummarySection
          icon={AlertTriangle}
          title="Infraction"
          step={1}
          onEdit={onEditStep}
        >
          {infraction ? (
            <div className="space-y-2">
              <p className="font-medium text-surface-900 dark:text-white">
                {infraction.name}
              </p>
              <p className="text-sm text-surface-600 dark:text-surface-300">
                {infraction.description}
              </p>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-danger-100 px-2 py-0.5 text-xs font-medium text-danger-700 dark:bg-danger-900/30 dark:text-danger-400">
                  ${infraction.fineAmount.toLocaleString()} fine
                </span>
                <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-900/30 dark:text-accent-400">
                  {infraction.points} points
                </span>
              </div>
            </div>
          ) : (
            <p className="italic text-surface-500">Not selected</p>
          )}
        </SummarySection>

        {/* Vehicle */}
        <SummarySection
          icon={Car}
          title="Vehicle"
          step={2}
          onEdit={onEditStep}
        >
          {vehicleType ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-surface-900 dark:text-white">
                  {vehicleType.name}
                </span>
                {categoryInfo && (
                  <span className="rounded-full bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-600 dark:bg-surface-700 dark:text-surface-300">
                    {categoryInfo.name}
                  </span>
                )}
              </div>
              {vehiclePlate && (
                <div className="inline-block rounded-lg border-2 border-surface-900 bg-white px-3 py-1 shadow-sm dark:border-white dark:bg-surface-900">
                  <span className="font-mono text-lg font-bold tracking-wider text-surface-900 dark:text-white">
                    {vehiclePlate}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="italic text-surface-500">Not selected</p>
          )}
        </SummarySection>

        {/* Location */}
        <SummarySection
          icon={MapPin}
          title="Location"
          step={4}
          onEdit={onEditStep}
        >
          {location ? (
            <div className="space-y-1">
              {locationAddress && (
                <p className="text-surface-900 dark:text-white">
                  {locationAddress}
                </p>
              )}
              <p className="font-mono text-sm text-surface-500 dark:text-surface-400">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
          ) : (
            <p className="italic text-surface-500">Not selected</p>
          )}
        </SummarySection>

        {/* Date & Time */}
        <SummarySection
          icon={Clock}
          title="Date & Time"
          step={5}
          onEdit={onEditStep}
        >
          {incidentDateTime ? (
            <p className="text-surface-900 dark:text-white">
              {formatDateTime(incidentDateTime, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          ) : (
            <p className="italic text-surface-500">Not selected</p>
          )}
        </SummarySection>

        {/* Evidence */}
        <SummarySection
          icon={Camera}
          title="Evidence"
          step={6}
          onEdit={onEditStep}
        >
          {evidences.length > 0 ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {evidences.map((evidence) => (
                  <div
                    key={evidence.id}
                    className="relative h-16 w-16 overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700"
                  >
                    {evidence.type === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={evidence.previewUrl}
                        alt="Evidence"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-surface-100 dark:bg-surface-700">
                        <Video className="h-6 w-6 text-surface-400" />
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-0.5 text-center">
                      {evidence.type === 'image' ? (
                        <ImageIcon className="mx-auto h-3 w-3 text-white" />
                      ) : (
                        <Video className="mx-auto h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-surface-600 dark:text-surface-300">
                {evidences.length} {evidences.length === 1 ? 'file' : 'files'} uploaded
              </p>
              {description && (
                <div className="rounded-lg bg-surface-100 p-3 dark:bg-surface-700">
                  <p className="text-sm text-surface-700 dark:text-surface-200">
                    {description}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-surface-500">
              No evidence uploaded (optional)
            </p>
          )}
        </SummarySection>
      </div>

      {/* Terms and conditions */}
      <div className="rounded-xl border border-surface-200 bg-white p-6 dark:border-surface-700 dark:bg-surface-800">
        <label className="flex cursor-pointer items-start gap-4">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-surface-300 text-brand-500 focus:ring-brand-500 dark:border-surface-600"
          />
          <div>
            <p className="font-medium text-surface-900 dark:text-white">
              I confirm that this report is accurate and truthful
            </p>
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
              By submitting this report, I agree to the{' '}
              <a href="/terms" className="text-brand-500 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-brand-500 hover:underline">
                Privacy Policy
              </a>
              . I understand that submitting false reports may result in account
              suspension and legal consequences.
            </p>
          </div>
        </label>
      </div>

      {/* Warning if not all fields are complete */}
      {(!infraction || !vehicleType || !location || !incidentDateTime) && (
        <div className="flex items-start gap-3 rounded-xl border border-warning-200 bg-warning-50 p-4 dark:border-warning-900 dark:bg-warning-900/20">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning-600 dark:text-warning-400" />
          <div>
            <h3 className="font-medium text-warning-900 dark:text-warning-100">
              Missing information
            </h3>
            <p className="mt-1 text-sm text-warning-700 dark:text-warning-300">
              Please complete all required fields before submitting:
              {!infraction && ' Infraction,'}
              {!vehicleType && ' Vehicle Type,'}
              {!location && ' Location,'}
              {!incidentDateTime && ' Date & Time'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Summary section component
interface SummarySectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}

function SummarySection({ icon: Icon, title, step, onEdit, children }: SummarySectionProps) {
  return (
    <div className="rounded-xl border border-surface-200 bg-white p-4 dark:border-surface-700 dark:bg-surface-800">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
            <Icon className="h-5 w-5 text-brand-500" />
          </div>
          <h3 className="font-medium text-surface-900 dark:text-white">{title}</h3>
        </div>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20"
        >
          <Edit2 className="h-4 w-4" />
          Edit
        </button>
      </div>
      <div className="mt-3 pl-13">{children}</div>
    </div>
  );
}

export default SubmissionSummary;
