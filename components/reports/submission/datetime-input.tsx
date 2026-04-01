'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useReportForm } from '@/hooks/use-report-form';
import { formatDateTime, toISODateString } from '@/lib/date-utils';
import {
  Clock,
  Calendar,
  Check,
  AlertCircle,
} from 'lucide-react';

interface DateTimeInputProps {
  className?: string;
}

// Quick options
interface QuickOption {
  id: string;
  label: string;
  getDate: () => Date;
}

export function DateTimeInput({ className }: DateTimeInputProps) {
  const { incidentDateTime, setIncidentDateTime } = useReportForm();

  // Quick options
  const quickOptions: QuickOption[] = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    return [
      {
        id: 'just-now',
        label: 'Just now',
        getDate: () => new Date(),
      },
      {
        id: 'today-morning',
        label: 'This morning',
        getDate: () => new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM
      },
      {
        id: 'today-afternoon',
        label: 'This afternoon',
        getDate: () => new Date(today.getTime() + 14 * 60 * 60 * 1000), // 2 PM
      },
      {
        id: 'yesterday',
        label: 'Yesterday',
        getDate: () => new Date(yesterday.getTime() + 12 * 60 * 60 * 1000), // Yesterday noon
      },
    ];
  }, []);

  // Get max date (today)
  const maxDate = useMemo(() => toISODateString(new Date()), []);

  // Check if a quick option is currently selected
  const isQuickOptionSelected = (option: QuickOption): boolean => {
    if (!incidentDateTime) return false;

    const optionDate = option.getDate();
    const diff = Math.abs(incidentDateTime.getTime() - optionDate.getTime());
    // Consider it selected if within 5 minutes
    return diff < 5 * 60 * 1000;
  };

  // Handle quick option selection
  const handleQuickOption = (option: QuickOption) => {
    setIncidentDateTime(option.getDate());
  };

  // Handle manual date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (!dateValue) return;

    const currentTime = incidentDateTime || new Date();
    const [year, month, day] = dateValue.split('-').map(Number);

    const newDate = new Date(
      year,
      month - 1,
      day,
      currentTime.getHours(),
      currentTime.getMinutes()
    );

    // Don't allow future dates
    if (newDate.getTime() > Date.now()) {
      return;
    }

    setIncidentDateTime(newDate);
  };

  // Handle manual time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    if (!timeValue) return;

    const currentDate = incidentDateTime || new Date();
    const [hours, minutes] = timeValue.split(':').map(Number);

    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hours,
      minutes
    );

    // Don't allow future times on today
    if (newDate.getTime() > Date.now()) {
      return;
    }

    setIncidentDateTime(newDate);
  };

  // Get date input value
  const dateInputValue = useMemo(() => {
    if (!incidentDateTime) return '';
    return toISODateString(incidentDateTime);
  }, [incidentDateTime]);

  // Get time input value
  const timeInputValue = useMemo(() => {
    if (!incidentDateTime) return '';
    const hours = String(incidentDateTime.getHours()).padStart(2, '0');
    const minutes = String(incidentDateTime.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }, [incidentDateTime]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <h3 className="font-medium text-blue-900 dark:text-blue-100">
            When did the incident occur?
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
            Select the date and time when you witnessed the traffic infraction.
            You cannot select a future date or time.
          </p>
        </div>
      </div>

      {/* Quick options */}
      <div>
        <label className="mb-3 block text-sm font-medium text-surface-700 dark:text-surface-200">
          Quick Selection
        </label>
        <div className="flex flex-wrap gap-3">
          {quickOptions.map((option) => {
            const isSelected = isQuickOptionSelected(option);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleQuickOption(option)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isSelected
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700'
                )}
              >
                {isSelected && <Check className="h-4 w-4" />}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date and time inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Date input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-200">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <input
              type="date"
              value={dateInputValue}
              onChange={handleDateChange}
              max={maxDate}
              className={cn(
                'flex h-10 w-full rounded-lg border bg-white py-2 pl-10 pr-3 text-sm text-surface-900',
                'placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'dark:bg-surface-800 dark:text-surface-100 dark:placeholder:text-surface-500',
                'border-surface-200 focus:border-brand-500 focus:ring-brand-500/20',
                'dark:border-surface-700 dark:focus:border-brand-500'
              )}
            />
          </div>
        </div>

        {/* Time input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-200">
            Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <input
              type="time"
              value={timeInputValue}
              onChange={handleTimeChange}
              className={cn(
                'flex h-10 w-full rounded-lg border bg-white py-2 pl-10 pr-3 text-sm text-surface-900',
                'placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-offset-0',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'dark:bg-surface-800 dark:text-surface-100 dark:placeholder:text-surface-500',
                'border-surface-200 focus:border-brand-500 focus:ring-brand-500/20',
                'dark:border-surface-700 dark:focus:border-brand-500'
              )}
            />
          </div>
        </div>
      </div>

      {/* Selected datetime display */}
      {incidentDateTime && (
        <div className="flex items-start gap-3 rounded-xl border border-success-200 bg-success-50 p-4 dark:border-success-900 dark:bg-success-900/20">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-success-600 dark:text-success-400" />
          <div>
            <h3 className="font-medium text-success-900 dark:text-success-100">
              Selected Date & Time
            </h3>
            <p className="mt-1 text-sm text-success-700 dark:text-success-300">
              {formatDateTime(incidentDateTime, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      )}

      {/* Warning for old dates */}
      {incidentDateTime && (
        (() => {
          const hoursDiff = (Date.now() - incidentDateTime.getTime()) / (1000 * 60 * 60);
          if (hoursDiff > 48) {
            return (
              <div className="flex items-start gap-3 rounded-xl border border-warning-200 bg-warning-50 p-4 dark:border-warning-900 dark:bg-warning-900/20">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning-600 dark:text-warning-400" />
                <div>
                  <h3 className="font-medium text-warning-900 dark:text-warning-100">
                    Reporting an older incident
                  </h3>
                  <p className="mt-1 text-sm text-warning-700 dark:text-warning-300">
                    This incident occurred more than 48 hours ago. Reports are most effective
                    when submitted promptly. Older reports may be subject to additional review.
                  </p>
                </div>
              </div>
            );
          }
          return null;
        })()
      )}
    </div>
  );
}

export default DateTimeInput;
