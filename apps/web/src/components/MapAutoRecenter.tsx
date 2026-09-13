'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { TelemetryPoint } from '../types';

interface MapAutoRecenterProps {
  points: TelemetryPoint[];
}

export default function MapAutoRecenter({ points }: MapAutoRecenterProps) {
  const map = useMap();

  useEffect(() => {
    const validPoints = points.filter(
      (p) => !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude))
    );
    if (validPoints.length > 0) {
      const bounds = validPoints.map(
        (p) => [Number(p.latitude), Number(p.longitude)] as [number, number]
      );
      if (bounds.length === 1) {
        map.setView(bounds[0], 12);
      } else {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      }
    }
  }, [points, map]);

  return null;
}
