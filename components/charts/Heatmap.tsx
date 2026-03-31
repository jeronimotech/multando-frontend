"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

interface LocationHeatmapProps {
  data: HeatmapPoint[];
  center?: [number, number];
  zoom?: number;
}

// Simple heatmap implementation using circle markers
// For production, consider using leaflet.heat plugin
function HeatmapLayer({ data }: { data: HeatmapPoint[] }) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.clearLayers();
    } else {
      layerRef.current = L.layerGroup().addTo(map);
    }

    // Add circle markers for each point
    data.forEach((point) => {
      const color = getHeatColor(point.intensity);
      const radius = 15 + point.intensity * 20;

      L.circleMarker([point.lat, point.lng], {
        radius,
        fillColor: color,
        color: "transparent",
        fillOpacity: 0.4,
        weight: 0,
      }).addTo(layerRef.current!);
    });

    // Fit bounds to show all points
    if (data.length > 0) {
      const bounds = L.latLngBounds(data.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (layerRef.current) {
        layerRef.current.clearLayers();
      }
    };
  }, [data, map]);

  return null;
}

function getHeatColor(intensity: number): string {
  // Gradient from green to yellow to red
  if (intensity < 0.33) {
    return `rgb(${Math.round(255 * intensity * 3)}, 255, 0)`;
  } else if (intensity < 0.66) {
    return `rgb(255, ${Math.round(255 * (1 - (intensity - 0.33) * 3))}, 0)`;
  } else {
    return `rgb(255, 0, 0)`;
  }
}

export function LocationHeatmap({
  data,
  center = [18.4861, -69.9312], // Santo Domingo
  zoom = 12,
}: LocationHeatmapProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-800">
        <p className="text-surface-500">No location data available</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full rounded-lg"
      scrollWheelZoom={true}
      style={{ minHeight: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatmapLayer data={data} />
    </MapContainer>
  );
}

// Alternative: Canvas-based heatmap for better performance with many points
export function CanvasHeatmap({
  data,
  width = 800,
  height = 400,
}: {
  data: HeatmapPoint[];
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find bounds
    const lats = data.map((p) => p.lat);
    const lngs = data.map((p) => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latRange = maxLat - minLat || 0.1;
    const lngRange = maxLng - minLng || 0.1;

    // Draw points
    data.forEach((point) => {
      const x = ((point.lng - minLng) / lngRange) * width;
      const y = height - ((point.lat - minLat) / latRange) * height;
      const radius = 20 + point.intensity * 30;

      // Create radial gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(99, 102, 241, ${point.intensity * 0.8})`);
      gradient.addColorStop(1, "rgba(99, 102, 241, 0)");

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  }, [data, width, height]);

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-800"
        style={{ width, height }}
      >
        <p className="text-surface-500">No location data available</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg bg-surface-100 dark:bg-surface-800">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block"
      />
      <div className="absolute bottom-2 right-2 rounded bg-white/80 px-2 py-1 text-xs text-surface-600 dark:bg-surface-800/80 dark:text-surface-300">
        {data.length} data points
      </div>
    </div>
  );
}
