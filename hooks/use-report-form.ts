'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Infraction, VehicleType } from '@/types/report';

export type VehicleCategory =
  | 'private'
  | 'public'
  | 'diplomatic'
  | 'government'
  | 'commercial'
  | 'taxi'
  | 'rental';

export interface VehicleTypeInfo {
  id: VehicleType;
  name: string;
  icon: string;
  requiresPlate: boolean;
}

export interface LocationData {
  lat: number;
  lng: number;
}

export interface EvidenceFile {
  id: string;
  file: File;
  previewUrl: string;
  type: 'image' | 'video';
}

export interface ReportFormState {
  // Current step (1-3)
  step: number;

  // Step 1: Capture — evidence + infraction selection
  evidences: EvidenceFile[];
  infraction: Infraction | null;

  // Step 2: Confirm — vehicle, location, datetime (pre-filled from AI/EXIF)
  vehicleType: VehicleTypeInfo | null;
  vehiclePlate: string;
  vehicleCategory: VehicleCategory | null;
  location: LocationData | null;
  locationAddress: string;
  incidentDateTime: Date | null;
  description: string;

  // Step 3: Submit
  termsAccepted: boolean;

  // AI detection flags
  aiDetectedPlate: string | null;
  aiDetectedVehicleType: string | null;
  aiDetectedLocation: LocationData | null;

  // Submission
  isSubmitting: boolean;
  submitError: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canProceed: () => boolean;

  setInfraction: (infraction: Infraction) => void;
  setVehicleType: (vehicleType: VehicleTypeInfo) => void;
  setVehiclePlate: (plate: string) => void;
  setVehicleCategory: (category: VehicleCategory) => void;
  setLocation: (location: LocationData) => void;
  setLocationAddress: (address: string) => void;
  setIncidentDateTime: (dateTime: Date) => void;
  addEvidence: (evidence: EvidenceFile) => void;
  removeEvidence: (id: string) => void;
  setDescription: (description: string) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setAiDetections: (detections: {
    plate?: string;
    vehicleType?: string;
    location?: LocationData;
  }) => void;

  setIsSubmitting: (isSubmitting: boolean) => void;
  setSubmitError: (error: string | null) => void;

  reset: () => void;
  getFormData: () => ReportFormData;
}

export interface ReportFormData {
  infractionCode: string;
  vehicleType: VehicleType;
  vehiclePlate: string;
  vehicleCategory: VehicleCategory;
  latitude: number;
  longitude: number;
  address?: string;
  incidentDateTime: string;
  evidenceIds: string[];
  description?: string;
}

const initialState = {
  step: 1,
  evidences: [],
  infraction: null,
  vehicleType: null,
  vehiclePlate: '',
  vehicleCategory: null,
  location: null,
  locationAddress: '',
  incidentDateTime: null,
  description: '',
  termsAccepted: false,
  aiDetectedPlate: null,
  aiDetectedVehicleType: null,
  aiDetectedLocation: null,
  isSubmitting: false,
  submitError: null,
};

export const TOTAL_STEPS = 3;

export const STEP_TITLES = [
  'Capture',
  'Confirm Details',
  'Submit',
];

export const STEP_DESCRIPTIONS = [
  'Add evidence and select the infraction type',
  'Review and confirm the infraction details',
  'Review summary and submit your report',
];

export const useReportForm = create<ReportFormState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step: number) => {
        if (step >= 1 && step <= TOTAL_STEPS) {
          set({ step });
        }
      },

      nextStep: () => {
        const { step } = get();
        if (step < TOTAL_STEPS) {
          set({ step: step + 1 });
        }
      },

      prevStep: () => {
        const { step } = get();
        if (step > 1) {
          set({ step: step - 1 });
        }
      },

      canProceed: () => {
        const state = get();
        switch (state.step) {
          case 1:
            // Need at least an infraction selected
            return state.infraction !== null;
          case 2:
            // Need location and datetime at minimum
            return state.location !== null && state.incidentDateTime !== null;
          case 3:
            return state.termsAccepted;
          default:
            return false;
        }
      },

      setInfraction: (infraction) => set({ infraction }),
      setVehicleType: (vehicleType) => set({ vehicleType }),
      setVehiclePlate: (plate) => set({ vehiclePlate: plate.toUpperCase() }),
      setVehicleCategory: (category) => set({ vehicleCategory: category }),
      setLocation: (location) => set({ location }),
      setLocationAddress: (address) => set({ locationAddress: address }),
      setIncidentDateTime: (dateTime) => set({ incidentDateTime: dateTime }),
      setDescription: (description) => set({ description }),
      setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),

      addEvidence: (evidence) =>
        set((state) => ({
          evidences: [...state.evidences, evidence],
        })),

      removeEvidence: (id) =>
        set((state) => ({
          evidences: state.evidences.filter((e) => e.id !== id),
        })),

      setAiDetections: (detections) =>
        set({
          aiDetectedPlate: detections.plate || null,
          aiDetectedVehicleType: detections.vehicleType || null,
          aiDetectedLocation: detections.location || null,
          // Auto-fill editable fields from AI
          ...(detections.plate ? { vehiclePlate: detections.plate.toUpperCase() } : {}),
          ...(detections.location ? { location: detections.location } : {}),
        }),

      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
      setSubmitError: (error) => set({ submitError: error }),

      reset: () => {
        const { evidences } = get();
        evidences.forEach((e) => URL.revokeObjectURL(e.previewUrl));
        set(initialState);
      },

      getFormData: (): ReportFormData => {
        const state = get();
        return {
          infractionCode: state.infraction?.code || '',
          vehicleType: state.vehicleType?.id || 'car',
          vehiclePlate: state.vehiclePlate,
          vehicleCategory: state.vehicleCategory || 'private',
          latitude: state.location?.lat || 0,
          longitude: state.location?.lng || 0,
          address: state.locationAddress || undefined,
          incidentDateTime: state.incidentDateTime?.toISOString() || '',
          evidenceIds: state.evidences.map((e) => e.id),
          description: state.description || undefined,
        };
      },
    }),
    {
      name: 'report-form-storage',
      partialize: (state) => ({
        step: state.step,
        infraction: state.infraction,
        vehicleType: state.vehicleType,
        vehiclePlate: state.vehiclePlate,
        vehicleCategory: state.vehicleCategory,
        location: state.location,
        locationAddress: state.locationAddress,
        incidentDateTime: state.incidentDateTime
          ? state.incidentDateTime.toISOString()
          : null,
        description: state.description,
        termsAccepted: state.termsAccepted,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof state.incidentDateTime === 'string') {
          state.incidentDateTime = new Date(state.incidentDateTime);
        }
      },
    }
  )
);
