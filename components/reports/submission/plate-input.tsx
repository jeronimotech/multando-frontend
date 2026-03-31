'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useReportForm, type VehicleCategory } from '@/hooks/use-report-form';
import {
  VEHICLE_CATEGORIES,
  validatePlate,
  getPlateFormatHint,
} from '@/hooks/use-vehicle-types';
import {
  AlertCircle,
  Check,
  User,
  Bus,
  Building2,
  Car,
  CarTaxiFront,
  Building,
  Globe,
} from 'lucide-react';

// Icon mapping for categories
const CATEGORY_ICONS: Record<VehicleCategory, React.ComponentType<{ className?: string }>> = {
  private: User,
  public: Bus,
  commercial: Building2,
  taxi: CarTaxiFront,
  rental: Car,
  government: Building,
  diplomatic: Globe,
};

interface PlateInputProps {
  className?: string;
}

export function PlateInput({ className }: PlateInputProps) {
  const {
    vehicleType,
    vehiclePlate,
    vehicleCategory,
    setVehiclePlate,
    setVehicleCategory,
  } = useReportForm();

  const [plateError, setPlateError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);

  // Validate plate when it changes
  useEffect(() => {
    if (!isTouched || !vehicleCategory || vehiclePlate.length === 0) {
      setPlateError(null);
      return;
    }

    if (vehiclePlate.length < 3) {
      setPlateError('Plate number is too short');
      return;
    }

    const isValid = validatePlate(vehiclePlate, vehicleCategory);
    if (!isValid) {
      setPlateError(`Invalid format. Expected: ${getPlateFormatHint(vehicleCategory)}`);
    } else {
      setPlateError(null);
    }
  }, [vehiclePlate, vehicleCategory, isTouched]);

  // If plate is not required, show a simpler interface
  if (vehicleType && !vehicleType.requiresPlate) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-start gap-3 rounded-xl border border-success-200 bg-success-50 p-4 dark:border-success-900 dark:bg-success-900/20">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-success-600 dark:text-success-400" />
          <div>
            <h3 className="font-medium text-success-900 dark:text-success-100">
              License plate not required
            </h3>
            <p className="mt-1 text-sm text-success-700 dark:text-success-300">
              {vehicleType.name} vehicles typically don&apos;t have license plates. You can
              proceed to the next step, or optionally enter any identifying information below.
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-200">
            Optional: Any identifying information
          </label>
          <Input
            type="text"
            placeholder="e.g., Blue bicycle with basket"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            className="max-w-md"
          />
          <p className="mt-1.5 text-sm text-surface-500 dark:text-surface-400">
            This field is optional for {vehicleType.name.toLowerCase()}s.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <h3 className="font-medium text-blue-900 dark:text-blue-100">
            Enter the vehicle&apos;s license plate
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
            First select the vehicle category, then enter the plate number. The format will be
            validated automatically.
          </p>
        </div>
      </div>

      {/* Category selection */}
      <div>
        <label className="mb-3 block text-sm font-medium text-surface-700 dark:text-surface-200">
          Vehicle Category
        </label>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {VEHICLE_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            const isSelected = vehicleCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setVehicleCategory(cat.id)}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200',
                  isSelected
                    ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500 dark:bg-brand-900/20'
                    : 'border-surface-200 bg-white hover:border-brand-300 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:hover:border-brand-700 dark:hover:bg-surface-700'
                )}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-white">
                    <svg
                      className="h-2.5 w-2.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                    isSelected
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h4 className="font-medium text-surface-900 dark:text-white">
                    {cat.name}
                  </h4>
                  <p className="truncate text-sm text-surface-500 dark:text-surface-400">
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Plate input */}
      <div className="max-w-md">
        <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-200">
          License Plate Number
        </label>
        <div className="relative">
          <Input
            type="text"
            placeholder={
              vehicleCategory
                ? getPlateFormatHint(vehicleCategory).split(' ')[0]
                : 'Select category first'
            }
            value={vehiclePlate}
            onChange={(e) => {
              setVehiclePlate(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
              setIsTouched(true);
            }}
            onBlur={() => setIsTouched(true)}
            disabled={!vehicleCategory}
            error={plateError || undefined}
            className="font-mono text-lg tracking-wider"
            maxLength={7}
          />
          {!plateError && vehiclePlate.length > 0 && vehicleCategory && validatePlate(vehiclePlate, vehicleCategory) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="h-5 w-5 text-success-500" />
            </div>
          )}
        </div>
        {vehicleCategory && (
          <p className="mt-1.5 text-sm text-surface-500 dark:text-surface-400">
            Format: {getPlateFormatHint(vehicleCategory)}
          </p>
        )}
      </div>

      {/* Valid plate preview */}
      {vehiclePlate.length > 0 && vehicleCategory && !plateError && validatePlate(vehiclePlate, vehicleCategory) && (
        <div className="flex items-center gap-4 rounded-xl border border-success-200 bg-success-50 p-4 dark:border-success-900 dark:bg-success-900/20">
          <div className="rounded-lg border-2 border-surface-900 bg-white px-4 py-2 shadow-sm dark:border-white dark:bg-surface-900">
            <span className="font-mono text-2xl font-bold tracking-wider text-surface-900 dark:text-white">
              {vehiclePlate}
            </span>
          </div>
          <div>
            <p className="font-medium text-success-900 dark:text-success-100">
              Valid plate format
            </p>
            <p className="text-sm text-success-700 dark:text-success-300">
              {VEHICLE_CATEGORIES.find((c) => c.id === vehicleCategory)?.name} vehicle
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlateInput;
