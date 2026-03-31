'use client';

import { useReportForm } from '@/hooks/use-report-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Car,
  MapPin,
  Clock,
  Camera,
  FileText,
  ChevronRight,
  Coins,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

export function SubmitStep() {
  const { t, tParams } = useTranslation();
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
    setStep,
  } = useReportForm();

  const summaryItems = [
    {
      icon: AlertTriangle,
      label: t('report_submit.infraction'),
      value: infraction?.name || t('report_submit.not_selected'),
      step: 1,
      filled: !!infraction,
    },
    {
      icon: Car,
      label: t('report_submit.vehicle'),
      value: vehicleType
        ? `${vehicleType.name}${vehiclePlate ? ` • ${vehiclePlate}` : ''}${vehicleCategory ? ` (${vehicleCategory})` : ''}`
        : t('report_submit.not_specified'),
      step: 2,
      filled: !!vehicleType,
    },
    {
      icon: MapPin,
      label: t('report_submit.location'),
      value: locationAddress || (location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : t('report_submit.not_set')),
      step: 2,
      filled: !!location,
    },
    {
      icon: Clock,
      label: t('report_submit.date_time'),
      value: incidentDateTime ? incidentDateTime.toLocaleString() : t('report_submit.not_set'),
      step: 2,
      filled: !!incidentDateTime,
    },
    {
      icon: Camera,
      label: t('report_submit.evidence'),
      value: evidences.length > 0 ? `${evidences.length} ${t('report_submit.files_attached')}` : t('report_submit.no_evidence'),
      step: 1,
      filled: evidences.length > 0,
    },
    {
      icon: FileText,
      label: t('report_submit.description'),
      value: description || t('report_submit.no_description'),
      step: 2,
      filled: !!description,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
          {t('report_submit.review_title')}
        </h3>

        <div className="divide-y divide-surface-100 rounded-xl border border-surface-200 bg-white dark:divide-surface-700 dark:border-surface-700 dark:bg-surface-800">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-lg',
                      item.filled
                        ? 'bg-brand-50 text-brand-500 dark:bg-brand-950/30'
                        : 'bg-surface-100 text-surface-400 dark:bg-surface-700'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-surface-500 dark:text-surface-400">
                      {item.label}
                    </p>
                    <p
                      className={cn(
                        'text-sm',
                        item.filled
                          ? 'text-surface-900 dark:text-white'
                          : 'text-surface-400 italic'
                      )}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(item.step)}
                  className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-700"
                  aria-label={`Edit ${item.label}`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evidence thumbnails */}
      {evidences.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            {t('report_submit.evidence_preview')}
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {evidences.map((ev) => (
              <div
                key={ev.id}
                className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700"
              >
                {ev.type === 'image' ? (
                  <img
                    src={ev.previewUrl}
                    alt="Evidence"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={ev.previewUrl}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reward preview */}
      <Card variant="glass" className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-950">
            <Coins className="h-5 w-5 text-accent-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-surface-900 dark:text-white">
              {t('report_submit.potential_reward')}
            </p>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              {tParams('report_submit.reward_desc', { tokens: String(infraction?.tokens || 10), points: String(infraction?.points || 15) })}
            </p>
          </div>
        </div>
      </Card>

      {/* Terms & Conditions */}
      <div className="flex items-start gap-3 rounded-xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
        <input
          type="checkbox"
          id="terms"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500"
        />
        <label
          htmlFor="terms"
          className="text-sm text-surface-600 dark:text-surface-300"
        >
          {t('report_submit.terms_text')}
        </label>
      </div>

      {/* Trust badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-surface-400">
        <Shield className="h-3.5 w-3.5" />
        {t('report_submit.trust_badge')}
      </div>
    </div>
  );
}
