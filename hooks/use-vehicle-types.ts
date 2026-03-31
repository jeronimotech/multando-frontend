'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { VehicleType } from '@/types/report';
import type { VehicleTypeInfo, VehicleCategory } from './use-report-form';

// Query keys
export const vehicleTypeKeys = {
  all: ['vehicle-types'] as const,
};

// Mock vehicle types data
const MOCK_VEHICLE_TYPES: VehicleTypeInfo[] = [
  {
    id: 'car',
    name: 'Car',
    icon: 'Car',
    requiresPlate: true,
  },
  {
    id: 'motorcycle',
    name: 'Motorcycle',
    icon: 'Bike',
    requiresPlate: true,
  },
  {
    id: 'truck',
    name: 'Truck',
    icon: 'Truck',
    requiresPlate: true,
  },
  {
    id: 'bus',
    name: 'Bus',
    icon: 'Bus',
    requiresPlate: true,
  },
  {
    id: 'van',
    name: 'Van',
    icon: 'CarTaxiFront',
    requiresPlate: true,
  },
  {
    id: 'bicycle',
    name: 'Bicycle',
    icon: 'Bike',
    requiresPlate: false,
  },
  {
    id: 'other',
    name: 'Other',
    icon: 'CircleHelp',
    requiresPlate: false,
  },
];

// Vehicle categories
export const VEHICLE_CATEGORIES: {
  id: VehicleCategory;
  name: string;
  description: string;
  platePrefix?: string;
}[] = [
  {
    id: 'private',
    name: 'Private',
    description: 'Personal vehicle for private use',
    platePrefix: 'A-Z',
  },
  {
    id: 'public',
    name: 'Public',
    description: 'Public transportation vehicles',
    platePrefix: 'P',
  },
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'Business or commercial vehicles',
    platePrefix: 'C',
  },
  {
    id: 'taxi',
    name: 'Taxi',
    description: 'Licensed taxi vehicles',
    platePrefix: 'T',
  },
  {
    id: 'rental',
    name: 'Rental',
    description: 'Rental company vehicles',
    platePrefix: 'R',
  },
  {
    id: 'government',
    name: 'Government',
    description: 'Government-owned vehicles',
    platePrefix: 'G',
  },
  {
    id: 'diplomatic',
    name: 'Diplomatic',
    description: 'Diplomatic mission vehicles',
    platePrefix: 'D',
  },
];

// Use mock data flag
import { USE_MOCK_DATA } from '@/lib/config';

/**
 * Hook to fetch all vehicle types
 */
export function useVehicleTypes() {
  return useQuery({
    queryKey: vehicleTypeKeys.all,
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return MOCK_VEHICLE_TYPES;
      }

      return api.get<VehicleTypeInfo[]>('/vehicle-types');
    },
    staleTime: 1000 * 60 * 60, // 1 hour (static data)
  });
}

// Plate validation patterns by category
export const PLATE_PATTERNS: Record<VehicleCategory, RegExp> = {
  private: /^[A-Z]\d{6}$/,
  public: /^P\d{6}$/,
  commercial: /^C\d{6}$/,
  taxi: /^T\d{6}$/,
  rental: /^R\d{6}$/,
  government: /^G\d{6}$/,
  diplomatic: /^D\d{5}$/,
};

// Format plate helper
export const PLATE_FORMAT_HINTS: Record<VehicleCategory, string> = {
  private: 'A123456 (Letter followed by 6 digits)',
  public: 'P123456 (P followed by 6 digits)',
  commercial: 'C123456 (C followed by 6 digits)',
  taxi: 'T123456 (T followed by 6 digits)',
  rental: 'R123456 (R followed by 6 digits)',
  government: 'G123456 (G followed by 6 digits)',
  diplomatic: 'D12345 (D followed by 5 digits)',
};

/**
 * Validate a license plate based on category
 */
export function validatePlate(plate: string, category: VehicleCategory): boolean {
  const pattern = PLATE_PATTERNS[category];
  return pattern.test(plate.toUpperCase());
}

/**
 * Get plate format hint for a category
 */
export function getPlateFormatHint(category: VehicleCategory): string {
  return PLATE_FORMAT_HINTS[category];
}

// Export mock data for testing
export const mockVehicleTypes = MOCK_VEHICLE_TYPES;
