'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useReportForm, type VehicleCategory } from '@/hooks/use-report-form';
import {
  MapPin,
  Clock,
  Car,
  Bike,
  Truck,
  Bus,
  AlertCircle,
  Sparkles,
  Navigation,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';

const VEHICLE_TYPES = [
  { id: 'car', name: 'Car', icon: Car },
  { id: 'motorcycle', name: 'Motorcycle', icon: Bike },
  { id: 'truck', name: 'Truck', icon: Truck },
  { id: 'bus', name: 'Bus', icon: Bus },
  { id: 'van', name: 'Van', icon: Truck },
  { id: 'bicycle', name: 'Bicycle', icon: Bike },
  { id: 'other', name: 'Other', icon: Car },
];

const CATEGORIES: { id: VehicleCategory; label: string }[] = [
  { id: 'private', label: 'Private' },
  { id: 'public', label: 'Public' },
  { id: 'taxi', label: 'Taxi' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'government', label: 'Government' },
  { id: 'diplomatic', label: 'Diplomatic' },
  { id: 'rental', label: 'Rental' },
];

export function ConfirmStep() {
  const { t } = useTranslation();
  const {
    vehicleType,
    setVehicleType,
    vehiclePlate,
    setVehiclePlate,
    vehicleCategory,
    setVehicleCategory,
    location,
    setLocation,
    locationAddress,
    setLocationAddress,
    incidentDateTime,
    setIncidentDateTime,
    aiDetectedPlate,
    aiDetectedLocation,
  } = useReportForm();

  // Auto-set current time if not set
  useEffect(() => {
    if (!incidentDateTime) {
      setIncidentDateTime(new Date());
    }
  }, [incidentDateTime, setIncidentDateTime]);

  // Auto-get current location if not set
  useEffect(() => {
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // Silently fail — user can set manually
        }
      );
    }
  }, [location, setLocation]);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.error('Location error:', err);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleSetNow = () => {
    setIncidentDateTime(new Date());
  };

  const missingFields: string[] = [];
  if (!location) missingFields.push(t('report_confirm.location'));
  if (!incidentDateTime) missingFields.push(t('report_submit.date_time'));

  return (
    <div className="space-y-6">
      {/* Missing fields warning */}
      {missingFields.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-warning-200 bg-warning-50 p-4 dark:border-warning-800 dark:bg-warning-950">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning-600" />
          <div>
            <p className="text-sm font-medium text-warning-800 dark:text-warning-200">
              {t('report_confirm.missing_fields')}: {missingFields.join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Vehicle Type */}
      <div>
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">
          {t('report_confirm.vehicle_type')}
        </h3>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
          {VEHICLE_TYPES.map((vt) => {
            const Icon = vt.icon;
            const isSelected = vehicleType?.id === vt.id;
            return (
              <button
                key={vt.id}
                onClick={() =>
                  setVehicleType({
                    id: vt.id as any,
                    name: vt.name,
                    icon: vt.id,
                    requiresPlate: vt.id !== 'bicycle',
                  })
                }
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-all',
                  isSelected
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/30 dark:text-brand-300'
                    : 'border-surface-200 text-surface-600 hover:border-brand-300 dark:border-surface-700 dark:text-surface-400'
                )}
              >
                <Icon className="h-5 w-5" />
                {vt.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* License Plate + Category */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Input
            label={t('report_confirm.license_plate')}
            placeholder="e.g. A123456"
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value)}
            rightIcon={
              aiDetectedPlate ? (
                <span className="flex items-center gap-1 text-xs text-brand-500">
                  <Sparkles className="h-3 w-3" /> {t('report_confirm.ai_detected')}
                </span>
              ) : undefined
            }
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-200">
            {t('report_confirm.vehicle_category')}
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setVehicleCategory(cat.id)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  vehicleCategory === cat.id
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">
          {t('report_confirm.location')}
        </h3>
        {location ? (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-950/30">
                  <MapPin className="h-5 w-5 text-brand-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">
                    {locationAddress || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}
                  </p>
                  {locationAddress && (
                    <p className="text-xs font-mono text-surface-400">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUseCurrentLocation}
              >
                <Navigation className="h-4 w-4" />
              </Button>
            </div>
            {aiDetectedLocation && (
              <div className="mt-2 flex items-center gap-1 text-xs text-brand-500">
                <Sparkles className="h-3 w-3" />
                {t('report_confirm.location_exif')}
              </div>
            )}
          </Card>
        ) : (
          <Button
            variant="outline"
            size="lg"
            fullWidth
            leftIcon={<Navigation className="h-5 w-5" />}
            onClick={handleUseCurrentLocation}
          >
            {t('report_confirm.use_current_location')}
          </Button>
        )}
        <div className="mt-3">
          <Input
            placeholder={t('report_confirm.enter_address')}
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
            leftIcon={<MapPin className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Date & Time */}
      <div>
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-3">
          {t('report_confirm.when_happened')}
        </h3>
        <div className="flex items-center gap-3">
          <Button
            variant={incidentDateTime ? 'secondary' : 'primary'}
            size="md"
            leftIcon={<Clock className="h-4 w-4" />}
            onClick={handleSetNow}
          >
            {t('report_confirm.just_now')}
          </Button>
          <input
            type="datetime-local"
            className="flex h-10 rounded border border-surface-200 bg-white px-3 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100"
            value={
              incidentDateTime
                ? new Date(
                    incidentDateTime.getTime() -
                      incidentDateTime.getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, 16)
                : ''
            }
            max={new Date().toISOString().slice(0, 16)}
            onChange={(e) => {
              if (e.target.value) {
                setIncidentDateTime(new Date(e.target.value));
              }
            }}
          />
        </div>
        {incidentDateTime && (
          <p className="mt-2 text-xs text-surface-500">
            {incidentDateTime.toLocaleString()}
          </p>
        )}
      </div>

      {/* Description (optional) */}
      <div>
        <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-200">
          {t('report_confirm.additional_details')} <span className="text-surface-400">({t('report_confirm.optional')})</span>
        </label>
        <textarea
          className="flex min-h-[80px] w-full rounded-lg border border-surface-200 bg-white px-3.5 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:placeholder:text-surface-500"
          placeholder={t('report_confirm.describe')}
          value={useReportForm.getState().description}
          onChange={(e) => useReportForm.getState().setDescription(e.target.value)}
        />
      </div>
    </div>
  );
}
