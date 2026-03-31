'use client';

import { cn } from '@/lib/utils';
import { useVehicleTypes } from '@/hooks/use-vehicle-types';
import { useReportForm, type VehicleTypeInfo } from '@/hooks/use-report-form';
import {
  Car,
  Bike,
  Truck,
  Bus,
  CarTaxiFront,
  CircleHelp,
  AlertCircle,
} from 'lucide-react';

// Icon mapping for vehicle types
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Car,
  Bike,
  Truck,
  Bus,
  CarTaxiFront,
  CircleHelp,
};

interface VehicleTypeSelectProps {
  className?: string;
}

export function VehicleTypeSelect({ className }: VehicleTypeSelectProps) {
  const { data: vehicleTypes, isLoading } = useVehicleTypes();
  const { vehicleType: selectedType, setVehicleType } = useReportForm();

  const handleSelect = (type: VehicleTypeInfo) => {
    setVehicleType(type);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <h3 className="font-medium text-blue-900 dark:text-blue-100">
            Select the type of vehicle
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
            Choose the vehicle type that best matches what you observed. Some vehicle types
            may not require a license plate number.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-xl border border-surface-200 bg-surface-100 dark:border-surface-700 dark:bg-surface-800"
            />
          ))}
        </div>
      )}

      {/* Vehicle type grid */}
      {!isLoading && vehicleTypes && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicleTypes.map((type) => {
            const Icon = ICON_MAP[type.icon] || CircleHelp;
            const isSelected = selectedType?.id === type.id;

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleSelect(type)}
                className={cn(
                  'relative flex flex-col items-center rounded-xl border p-6 text-center transition-all duration-200',
                  isSelected
                    ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500 dark:bg-brand-900/20'
                    : 'border-surface-200 bg-white hover:border-brand-300 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-800 dark:hover:border-brand-700 dark:hover:bg-surface-700'
                )}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white">
                    <svg
                      className="h-3 w-3"
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

                {/* Icon */}
                <div
                  className={cn(
                    'flex h-16 w-16 items-center justify-center rounded-full',
                    isSelected
                      ? 'bg-brand-500 text-white'
                      : 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300'
                  )}
                >
                  <Icon className="h-8 w-8" />
                </div>

                {/* Name */}
                <h4 className="mt-4 font-medium text-surface-900 dark:text-white">
                  {type.name}
                </h4>

                {/* Plate requirement indicator */}
                <div className="mt-2">
                  {type.requiresPlate ? (
                    <span className="inline-flex items-center rounded-full bg-surface-100 px-2.5 py-0.5 text-xs font-medium text-surface-600 dark:bg-surface-700 dark:text-surface-300">
                      Plate required
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-700 dark:bg-success-900/30 dark:text-success-400">
                      No plate needed
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Additional info */}
      {selectedType && !selectedType.requiresPlate && (
        <div className="flex items-start gap-3 rounded-xl border border-success-200 bg-success-50 p-4 dark:border-success-900 dark:bg-success-900/20">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-success-600 dark:text-success-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-medium text-success-900 dark:text-success-100">
              No license plate required
            </h3>
            <p className="mt-1 text-sm text-success-700 dark:text-success-300">
              {selectedType.name === 'bicycle'
                ? 'Bicycles typically do not have license plates. You can proceed to the next step.'
                : 'This vehicle type may not have a standard license plate. You can proceed or enter any identifying information.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleTypeSelect;
