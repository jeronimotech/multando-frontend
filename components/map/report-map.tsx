'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { formatDistanceToNow } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import type { ReportMarker } from '@/types/report';
import './map.css';

// Default center (Bogota, Colombia)
const DEFAULT_CENTER: [number, number] = [4.7110, -74.0721];
const DEFAULT_ZOOM = 12;

export interface ReportMapProps {
  markers?: ReportMarker[];
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
  className?: string;
  showCurrentLocation?: boolean;
}

// Custom marker icons by status
const createMarkerIcon = (status: ReportMarker['status']): L.DivIcon => {
  const colors = {
    pending: { bg: '#3b82f6', border: '#2563eb' }, // Blue
    verified: { bg: '#22c55e', border: '#16a34a' }, // Green
    rejected: { bg: '#ef4444', border: '#dc2626' }, // Red
  };

  const { bg, border } = colors[status];

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-pin" style="background-color: ${bg}; border-color: ${border};">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
};

// Selection marker icon (for clicking to select location)
const selectionMarkerIcon = L.divIcon({
  className: 'selection-marker',
  html: `
    <div class="marker-pin selection" style="background-color: #f59e0b; border-color: #d97706;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
  popupAnchor: [0, -42],
});

// Current location marker
const currentLocationIcon = L.divIcon({
  className: 'current-location-marker',
  html: `
    <div class="current-location-dot">
      <div class="pulse"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Status badge component
const StatusBadge = ({ status }: { status: ReportMarker['status'] }) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    verified: {
      label: 'Verified',
      className: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  );
};

// Map click handler component
interface MapClickHandlerProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  setSelectedLocation: (location: [number, number] | null) => void;
}

function MapClickHandler({
  onLocationSelect,
  setSelectedLocation,
}: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        const { lat, lng } = e.latlng;
        setSelectedLocation([lat, lng]);
        onLocationSelect(lat, lng);
      }
    },
  });

  return null;
}

// Component to handle flying to location
interface FlyToLocationProps {
  center: [number, number];
  zoom: number;
}

function FlyToLocation({ center, zoom }: FlyToLocationProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
    });
  }, [map, center, zoom]);

  return null;
}

// Main component
export function ReportMap({
  markers = [],
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  onLocationSelect,
  interactive = true,
  className,
  showCurrentLocation = false,
}: ReportMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Get current location
  useEffect(() => {
    if (showCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn('Could not get current location:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    }
  }, [showCurrentLocation]);

  // Create cluster custom icon
  const createClusterCustomIcon = useCallback((cluster: any) => {
    const count = cluster.getChildCount();
    let size = 'small';
    let diameter = 30;

    if (count >= 100) {
      size = 'large';
      diameter = 50;
    } else if (count >= 10) {
      size = 'medium';
      diameter = 40;
    }

    return L.divIcon({
      html: `<div class="cluster-marker cluster-${size}"><span>${count}</span></div>`,
      className: 'custom-cluster',
      iconSize: L.point(diameter, diameter, true),
    });
  }, []);

  // Memoize markers to prevent unnecessary re-renders
  const markerElements = useMemo(() => {
    return markers.map((marker) => (
      <Marker
        key={marker.id}
        position={[marker.latitude, marker.longitude]}
        icon={createMarkerIcon(marker.status)}
      >
        <Popup className="report-popup">
          <div className="p-1">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-sm font-semibold text-surface-900">
                {marker.vehiclePlate}
              </span>
              <StatusBadge status={marker.status} />
            </div>
            <p className="mb-2 text-sm text-surface-600">{marker.infraction}</p>
            <div className="flex items-center justify-between text-xs text-surface-500">
              <span>ID: {marker.shortId}</span>
              <span>{formatDistanceToNow(marker.createdAt)}</span>
            </div>
            <a
              href={`/reports/${marker.id}`}
              className="mt-2 block text-center text-sm font-medium text-brand-500 hover:text-brand-700"
            >
              View Details
            </a>
          </div>
        </Popup>
      </Marker>
    ));
  }, [markers]);

  return (
    <div className={cn('relative h-full w-full', className)}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={interactive}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Click handler for location selection */}
        {onLocationSelect && (
          <MapClickHandler
            onLocationSelect={onLocationSelect}
            setSelectedLocation={setSelectedLocation}
          />
        )}

        {/* Selected location marker */}
        {selectedLocation && (
          <Marker position={selectedLocation} icon={selectionMarkerIcon}>
            <Popup>
              <div className="p-1 text-center">
                <p className="text-sm font-medium text-surface-900">Selected Location</p>
                <p className="text-xs text-surface-500">
                  {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Current location marker */}
        {currentLocation && (
          <Marker position={currentLocation} icon={currentLocationIcon}>
            <Popup>
              <div className="p-1 text-center">
                <p className="text-sm font-medium text-surface-900">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Report markers with clustering */}
        {markers.length > 0 && (
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={50}
            spiderfyOnMaxZoom
            showCoverageOnHover={false}
            zoomToBoundsOnClick
          >
            {markerElements}
          </MarkerClusterGroup>
        )}
      </MapContainer>

      {/* Map controls overlay */}
      {showCurrentLocation && currentLocation && (
        <button
          onClick={() => {
            if (mapRef.current && currentLocation) {
              mapRef.current.flyTo(currentLocation, 15);
            }
          }}
          className="absolute bottom-20 right-2 z-[1000] rounded-lg bg-white p-2 shadow-md hover:bg-surface-50 dark:bg-surface-800 dark:hover:bg-surface-700"
          title="Go to my location"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-brand-500"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default ReportMap;
