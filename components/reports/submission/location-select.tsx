'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DynamicReportMap } from '@/components/map';
import { useReportForm } from '@/hooks/use-report-form';
import {
  MapPin,
  Navigation,
  Loader2,
  AlertCircle,
  Check,
} from 'lucide-react';

interface LocationSelectProps {
  className?: string;
}

export function LocationSelect({ className }: LocationSelectProps) {
  const { location, locationAddress, setLocation, setLocationAddress } = useReportForm();

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Handle location selection from map
  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setLocation({ lat, lng });
      setLocationError(null);

      // Optionally reverse geocode to get address
      reverseGeocode(lat, lng);
    },
    [setLocation]
  );

  // Get current location
  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('An unknown error occurred while getting your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [setLocation]);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      // Using OpenStreetMap Nominatim for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.display_name) {
          setLocationAddress(data.display_name);
        }
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <h3 className="font-medium text-blue-900 dark:text-blue-100">
            Select the incident location
          </h3>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
            Click on the map to select the exact location where the infraction occurred,
            or use the &quot;Use my location&quot; button to use your current position.
          </p>
        </div>
      </div>

      {/* Location error */}
      {locationError && (
        <div className="flex items-start gap-3 rounded-xl border border-danger-200 bg-danger-50 p-4 dark:border-danger-900 dark:bg-danger-900/20">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger-600 dark:text-danger-400" />
          <div>
            <h3 className="font-medium text-danger-900 dark:text-danger-100">
              Location Error
            </h3>
            <p className="mt-1 text-sm text-danger-700 dark:text-danger-300">
              {locationError}
            </p>
          </div>
        </div>
      )}

      {/* Use my location button */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
        >
          {isGettingLocation ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting location...
            </>
          ) : (
            <>
              <Navigation className="mr-2 h-4 w-4" />
              Use my location
            </>
          )}
        </Button>

        {location && (
          <span className="flex items-center gap-2 text-sm text-success-600 dark:text-success-400">
            <Check className="h-4 w-4" />
            Location selected
          </span>
        )}
      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700">
        <div className="h-[400px] w-full">
          <DynamicReportMap
            center={location ? [location.lat, location.lng] : undefined}
            zoom={location ? 15 : 8}
            onLocationSelect={handleLocationSelect}
            interactive={true}
            showCurrentLocation={true}
          />
        </div>
      </div>

      {/* Selected location info */}
      {location && (
        <div className="rounded-xl border border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800/50">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
              <MapPin className="h-5 w-5 text-brand-500" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-surface-900 dark:text-white">
                Selected Location
              </h4>
              <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
                {isGeocoding ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading address...
                  </span>
                ) : locationAddress ? (
                  locationAddress
                ) : (
                  `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                )}
              </p>
              <p className="mt-1 font-mono text-xs text-surface-500 dark:text-surface-400">
                Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Manual address input (optional) */}
      <div>
        <label className="mb-2 block text-sm font-medium text-surface-700 dark:text-surface-200">
          Address (optional)
        </label>
        <Input
          type="text"
          placeholder="Enter address or landmark description"
          value={locationAddress}
          onChange={(e) => setLocationAddress(e.target.value)}
          helperText="You can add additional details about the location if needed"
        />
      </div>
    </div>
  );
}

export default LocationSelect;
