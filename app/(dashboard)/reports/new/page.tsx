'use client';
export const dynamic = "force-dynamic";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CaptureStep } from '@/components/reports/submission/capture-step';
import { ConfirmStep } from '@/components/reports/submission/confirm-step';
import { SubmitStep } from '@/components/reports/submission/submit-step';
import { useReportForm, TOTAL_STEPS } from '@/hooks/use-report-form';
import { useCreateReport } from '@/hooks/use-reports';
import { useTranslation } from '@/hooks/use-translation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
  X,
  Camera,
  ClipboardCheck,
  Send,
} from 'lucide-react';

const STEP_ICONS = [Camera, ClipboardCheck, Send];

export default function NewReportPage() {
  const router = useRouter();
  const { t, tParams } = useTranslation();
  const {
    step,
    setStep,
    nextStep,
    prevStep,
    canProceed,
    reset,
    getFormData,
    isSubmitting,
    setIsSubmitting,
    submitError,
    setSubmitError,
    termsAccepted,
    infraction,
    location,
    incidentDateTime,
  } = useReportForm();

  const createReport = useCreateReport();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const STEP_TITLES = [
    t('report_form.step_capture'),
    t('report_form.step_confirm'),
    t('report_form.step_submit'),
  ];

  const STEP_DESCRIPTIONS = [
    t('report_form.step_capture_desc'),
    t('report_form.step_confirm_desc'),
    t('report_form.step_submit_desc'),
  ];

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = getFormData();
      await createReport.mutateAsync({
        vehiclePlate: formData.vehiclePlate,
        vehicleType: formData.vehicleType,
        infractionCode: formData.infractionCode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        address: formData.address,
        description: formData.description,
        evidenceIds: formData.evidenceIds,
      });

      reset();
      router.push('/reports?submitted=true');
    } catch (error) {
      console.error('Failed to submit report:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Failed to submit report. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    if (step > 1 || infraction || location) {
      setShowExitConfirm(true);
    } else {
      router.push('/reports');
    }
  };

  const confirmExit = () => {
    reset();
    router.push('/reports');
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <CaptureStep />;
      case 2:
        return <ConfirmStep />;
      case 3:
        return <SubmitStep />;
      default:
        return null;
    }
  };

  const isComplete = Boolean(
    infraction && location && incidentDateTime && termsAccepted
  );

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('report_form.back_to_reports')}
        </button>
        <h1 className="mt-3 text-2xl font-bold text-surface-900 dark:text-white">
          {t('report_form.title')}
        </h1>
        <p className="mt-1 text-surface-500 dark:text-surface-400">
          {STEP_DESCRIPTIONS[step - 1]}
        </p>
      </div>

      {/* 3-Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEP_TITLES.map((title, index) => {
            const stepNum = index + 1;
            const Icon = STEP_ICONS[index];
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;

            return (
              <div key={index} className="flex flex-1 items-center">
                <button
                  onClick={() => {
                    if (isCompleted) setStep(stepNum);
                  }}
                  className={cn(
                    'flex items-center gap-2 transition-all',
                    isCompleted && 'cursor-pointer'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                      isActive
                        ? 'border-brand-500 bg-brand-500 text-white shadow-glow-brand'
                        : isCompleted
                          ? 'border-success-500 bg-success-500 text-white'
                          : 'border-surface-200 bg-white text-surface-400 dark:border-surface-600 dark:bg-surface-800'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isActive
                          ? 'text-brand-600 dark:text-brand-400'
                          : isCompleted
                            ? 'text-success-600 dark:text-success-400'
                            : 'text-surface-400'
                      )}
                    >
                      {title}
                    </p>
                  </div>
                </button>
                {index < TOTAL_STEPS - 1 && (
                  <div
                    className={cn(
                      'mx-3 h-0.5 flex-1 rounded-full transition-colors',
                      step > stepNum + 1
                        ? 'bg-success-500'
                        : step > stepNum
                          ? 'bg-brand-500'
                          : 'bg-surface-200 dark:bg-surface-700'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        {/* Mobile step title */}
        <p className="mt-3 text-center text-sm font-medium text-brand-600 sm:hidden">
          {tParams('report_form.step_label', { step: String(step) })}: {STEP_TITLES[step - 1]}
        </p>
      </div>

      {/* Submit error */}
      {submitError && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-danger-200 bg-danger-50 p-4 dark:border-danger-900 dark:bg-danger-900/20">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger-600 dark:text-danger-400" />
          <div>
            <h3 className="font-medium text-danger-900 dark:text-danger-100">
              {t('report_form.submission_error')}
            </h3>
            <p className="mt-1 text-sm text-danger-700 dark:text-danger-300">
              {submitError}
            </p>
          </div>
        </div>
      )}

      {/* Step content */}
      <Card className="p-6 lg:p-8">
        {renderStepContent()}
      </Card>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-surface-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-surface-700 dark:bg-surface-900/95 lg:left-64">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            {t('report_form.back')}
          </Button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  step === i + 1
                    ? 'w-6 bg-brand-500'
                    : step > i + 1
                      ? 'w-1.5 bg-success-500'
                      : 'w-1.5 bg-surface-200 dark:bg-surface-600'
                )}
              />
            ))}
          </div>

          {step < TOTAL_STEPS ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {t('report_form.continue')}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isComplete || isSubmitting}
              isLoading={isSubmitting}
              leftIcon={!isSubmitting ? <Check className="h-4 w-4" /> : undefined}
            >
              {isSubmitting ? t('report_form.submitting') : t('report_form.submit_report')}
            </Button>
          )}
        </div>
      </div>

      {/* Exit confirmation dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-xl dark:bg-surface-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                {t('report_form.discard_title')}
              </h3>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="rounded-lg p-1 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-sm text-surface-600 dark:text-surface-300">
              {t('report_form.discard_message')}
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowExitConfirm(false)}
              >
                {t('report_form.keep_editing')}
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={confirmExit}
              >
                {t('report_form.discard')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
