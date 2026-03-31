'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Infraction } from '@/types/report';

// Infraction categories
export type InfractionCategory = 'speed' | 'safety' | 'parking' | 'behavior';

// Extended infraction with icon
export interface InfractionWithIcon extends Infraction {
  icon: string;
}

// Query keys
export const infractionKeys = {
  all: ['infractions'] as const,
  byCategory: (category: InfractionCategory) =>
    [...infractionKeys.all, 'category', category] as const,
};

// Mock data for development
const MOCK_INFRACTIONS: InfractionWithIcon[] = [
  // Speed infractions
  {
    id: 'inf-001',
    code: 'SPD-001',
    name: 'Speeding',
    description: 'Exceeding the posted speed limit',
    fineAmount: 5000,
    points: 3,
    category: 'speed',
    icon: 'Gauge',
  },
  {
    id: 'inf-002',
    code: 'SPD-002',
    name: 'Reckless Driving',
    description: 'Driving in a manner that endangers others',
    fineAmount: 10000,
    points: 6,
    category: 'speed',
    icon: 'AlertTriangle',
  },
  {
    id: 'inf-003',
    code: 'SPD-003',
    name: 'Racing on Public Roads',
    description: 'Participating in unauthorized street racing',
    fineAmount: 25000,
    points: 8,
    category: 'speed',
    icon: 'Flame',
  },

  // Safety infractions
  {
    id: 'inf-004',
    code: 'SAF-001',
    name: 'Running Red Light',
    description: 'Failing to stop at a red traffic light',
    fineAmount: 8000,
    points: 4,
    category: 'safety',
    icon: 'CircleStop',
  },
  {
    id: 'inf-005',
    code: 'SAF-002',
    name: 'No Seat Belt',
    description: 'Driving or riding without wearing a seat belt',
    fineAmount: 3000,
    points: 2,
    category: 'safety',
    icon: 'ShieldX',
  },
  {
    id: 'inf-006',
    code: 'SAF-003',
    name: 'Using Phone While Driving',
    description: 'Operating a mobile device while driving',
    fineAmount: 5000,
    points: 3,
    category: 'safety',
    icon: 'Smartphone',
  },
  {
    id: 'inf-007',
    code: 'SAF-004',
    name: 'No Helmet',
    description: 'Riding a motorcycle without a helmet',
    fineAmount: 3000,
    points: 2,
    category: 'safety',
    icon: 'HardHat',
  },
  {
    id: 'inf-008',
    code: 'SAF-005',
    name: 'Drunk Driving',
    description: 'Driving under the influence of alcohol',
    fineAmount: 50000,
    points: 12,
    category: 'safety',
    icon: 'Wine',
  },
  {
    id: 'inf-009',
    code: 'SAF-006',
    name: 'Wrong Way Driving',
    description: 'Driving against the flow of traffic',
    fineAmount: 15000,
    points: 6,
    category: 'safety',
    icon: 'ArrowLeftRight',
  },

  // Parking infractions
  {
    id: 'inf-010',
    code: 'PRK-001',
    name: 'Illegal Parking',
    description: 'Parking in a prohibited area',
    fineAmount: 2000,
    points: 1,
    category: 'parking',
    icon: 'ParkingCircleOff',
  },
  {
    id: 'inf-011',
    code: 'PRK-002',
    name: 'Double Parking',
    description: 'Parking alongside another parked vehicle',
    fineAmount: 3000,
    points: 1,
    category: 'parking',
    icon: 'Square',
  },
  {
    id: 'inf-012',
    code: 'PRK-003',
    name: 'Blocking Driveway',
    description: 'Parking in front of a driveway entrance',
    fineAmount: 3500,
    points: 1,
    category: 'parking',
    icon: 'DoorClosed',
  },
  {
    id: 'inf-013',
    code: 'PRK-004',
    name: 'Handicap Zone Violation',
    description: 'Parking in a handicap space without permit',
    fineAmount: 10000,
    points: 3,
    category: 'parking',
    icon: 'Accessibility',
  },
  {
    id: 'inf-014',
    code: 'PRK-005',
    name: 'Fire Lane Violation',
    description: 'Parking in a designated fire lane',
    fineAmount: 8000,
    points: 2,
    category: 'parking',
    icon: 'Flame',
  },

  // Behavior infractions
  {
    id: 'inf-015',
    code: 'BHV-001',
    name: 'Aggressive Driving',
    description: 'Displaying aggressive behavior towards other drivers',
    fineAmount: 10000,
    points: 5,
    category: 'behavior',
    icon: 'Angry',
  },
  {
    id: 'inf-016',
    code: 'BHV-002',
    name: 'Failure to Yield',
    description: 'Not yielding right of way when required',
    fineAmount: 4000,
    points: 3,
    category: 'behavior',
    icon: 'Merge',
  },
  {
    id: 'inf-017',
    code: 'BHV-003',
    name: 'Illegal Turn',
    description: 'Making a turn where prohibited',
    fineAmount: 3000,
    points: 2,
    category: 'behavior',
    icon: 'CornerUpRight',
  },
  {
    id: 'inf-018',
    code: 'BHV-004',
    name: 'Improper Lane Change',
    description: 'Changing lanes without signaling or unsafely',
    fineAmount: 3500,
    points: 2,
    category: 'behavior',
    icon: 'ArrowLeftRight',
  },
  {
    id: 'inf-019',
    code: 'BHV-005',
    name: 'Tailgating',
    description: 'Following another vehicle too closely',
    fineAmount: 4000,
    points: 3,
    category: 'behavior',
    icon: 'CarFront',
  },
  {
    id: 'inf-020',
    code: 'BHV-006',
    name: 'Honking Excessively',
    description: 'Using horn unnecessarily or excessively',
    fineAmount: 2000,
    points: 1,
    category: 'behavior',
    icon: 'Volume2',
  },
];

// Use mock data flag
import { USE_MOCK_DATA } from '@/lib/config';

/**
 * Hook to fetch all infractions
 */
export function useInfractions() {
  return useQuery({
    queryKey: infractionKeys.all,
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return MOCK_INFRACTIONS;
      }

      return api.get<InfractionWithIcon[]>('/infractions');
    },
    staleTime: 1000 * 60 * 30, // 30 minutes (static data)
  });
}

/**
 * Hook to fetch infractions by category
 */
export function useInfractionsByCategory(category: InfractionCategory) {
  return useQuery({
    queryKey: infractionKeys.byCategory(category),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return MOCK_INFRACTIONS.filter((inf) => inf.category === category);
      }

      return api.get<InfractionWithIcon[]>(`/infractions?category=${category}`);
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Get category info
 */
export const INFRACTION_CATEGORIES: {
  id: InfractionCategory;
  name: string;
  icon: string;
  description: string;
}[] = [
  {
    id: 'speed',
    name: 'Speed',
    icon: 'Gauge',
    description: 'Speeding and reckless driving violations',
  },
  {
    id: 'safety',
    name: 'Safety',
    icon: 'ShieldAlert',
    description: 'Safety equipment and traffic signal violations',
  },
  {
    id: 'parking',
    name: 'Parking',
    icon: 'ParkingCircle',
    description: 'Illegal parking and obstruction violations',
  },
  {
    id: 'behavior',
    name: 'Behavior',
    icon: 'Users',
    description: 'Aggressive driving and improper behavior',
  },
];

// Export mock data for testing
export const mockInfractions = MOCK_INFRACTIONS;
