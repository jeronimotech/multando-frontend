'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  Car,
  FileText,
  MapPin,
  Clock,
  Camera,
  CheckCircle,
  Check,
} from 'lucide-react';

// Icon mapping
const STEP_ICONS = {
  AlertTriangle,
  Car,
  FileText,
  MapPin,
  Clock,
  Camera,
  CheckCircle,
};

type IconName = keyof typeof STEP_ICONS;

export interface StepperProps {
  steps: {
    title: string;
    icon?: IconName;
    description?: string;
  }[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export interface StepProps {
  step: number;
  title: string;
  icon?: IconName;
  description?: string;
  isActive: boolean;
  isCompleted: boolean;
  isClickable: boolean;
  onClick?: () => void;
  isLast?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const Step = forwardRef<HTMLDivElement, StepProps>(
  (
    {
      step,
      title,
      icon,
      description,
      isActive,
      isCompleted,
      isClickable,
      onClick,
      isLast,
      orientation = 'horizontal',
    },
    ref
  ) => {
    const IconComponent = icon ? STEP_ICONS[icon] : null;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          orientation === 'horizontal' ? 'flex-1' : 'flex-col items-start'
        )}
      >
        <div
          className={cn(
            'flex items-center',
            orientation === 'vertical' && 'w-full'
          )}
        >
          {/* Step indicator */}
          <button
            type="button"
            onClick={isClickable ? onClick : undefined}
            disabled={!isClickable}
            className={cn(
              'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200',
              isCompleted
                ? 'border-brand-500 bg-brand-500 text-white'
                : isActive
                  ? 'border-brand-500 bg-brand-50 text-brand-500 dark:bg-brand-900/30'
                  : 'border-surface-300 bg-white text-surface-400 dark:border-surface-600 dark:bg-surface-800',
              isClickable && !isActive && !isCompleted
                ? 'cursor-pointer hover:border-brand-300 hover:bg-surface-50 dark:hover:border-brand-700 dark:hover:bg-surface-700'
                : '',
              !isClickable && !isActive && !isCompleted && 'cursor-not-allowed opacity-60'
            )}
            aria-current={isActive ? 'step' : undefined}
          >
            {isCompleted ? (
              <Check className="h-5 w-5" />
            ) : IconComponent ? (
              <IconComponent className="h-5 w-5" />
            ) : (
              <span className="text-sm font-semibold">{step}</span>
            )}
          </button>

          {/* Step content (for horizontal) */}
          {orientation === 'horizontal' && (
            <div className="ml-3 hidden min-w-0 sm:block">
              <p
                className={cn(
                  'text-sm font-medium',
                  isActive || isCompleted
                    ? 'text-surface-900 dark:text-white'
                    : 'text-surface-500 dark:text-surface-400'
                )}
              >
                {title}
              </p>
              {description && (
                <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Step content (for vertical) */}
        {orientation === 'vertical' && (
          <div className="ml-4 mt-0 pb-8">
            <p
              className={cn(
                'text-sm font-medium',
                isActive || isCompleted
                  ? 'text-surface-900 dark:text-white'
                  : 'text-surface-500 dark:text-surface-400'
              )}
            >
              {title}
            </p>
            {description && (
              <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Connector line (horizontal) */}
        {orientation === 'horizontal' && !isLast && (
          <div
            className={cn(
              'mx-2 h-0.5 flex-1 transition-colors duration-200 sm:mx-4',
              isCompleted ? 'bg-brand-500' : 'bg-surface-200 dark:bg-surface-700'
            )}
          />
        )}
      </div>
    );
  }
);

Step.displayName = 'Step';

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, currentStep, onStepClick, className, orientation = 'horizontal' }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
          className
        )}
        role="navigation"
        aria-label="Progress steps"
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          // Can click on completed steps or the current step
          const isClickable = isCompleted && !!onStepClick;

          return (
            <Step
              key={index}
              step={stepNumber}
              title={step.title}
              icon={step.icon as IconName}
              description={step.description}
              isActive={isActive}
              isCompleted={isCompleted}
              isClickable={isClickable}
              onClick={() => onStepClick?.(stepNumber)}
              isLast={index === steps.length - 1}
              orientation={orientation}
            />
          );
        })}
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';

// Compact stepper for mobile
export interface CompactStepperProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  className?: string;
}

export const CompactStepper = forwardRef<HTMLDivElement, CompactStepperProps>(
  ({ currentStep, totalSteps, stepTitle, className }, ref) => {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {/* Step indicator text */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-surface-900 dark:text-white">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-surface-500 dark:text-surface-400">
            {stepTitle}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-200 dark:bg-surface-700">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }
);

CompactStepper.displayName = 'CompactStepper';

export default Stepper;
