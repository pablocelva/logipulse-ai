'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { TelemetryPoint } from '../types';
import { MapPin, Navigation, Play, Pause, Activity } from 'lucide-react';

// Dynamic import for Leaflet components to prevent SSR errors
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

const MapAutoRecenter = dynamic(
  () => import('./MapAutoRecenter'),
  { ssr: false }
);

interface FleetMapProps {
  telemetryData: TelemetryPoint[];
  onSelectVehicle?: (trackingNumber: string) => void;
  isSimulating?: boolean;
  onToggleSimulation?: () => void;
}

export default function FleetMap({
  telemetryData,
  onSelectVehicle,
  isSimulating,
  onToggleSimulation,
}: FleetMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    // Fix default Leaflet icon paths in client side
    import('leaflet').then((L) => {
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setCustomIcon(icon);
    });
  }, []);

  // Center on Santiago Metropolitan Region
  const defaultCenter: [number, number] = [-33.425, -70.605];

  if (!isMounted) {
    return (
      <div className="h-[420px] bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 border border-slate-800">
        <Navigation className="w-8 h-8 animate-spin text-sky-400 mr-2" />
        <span>Cargando Mapa de Flota...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col h-full">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-sky-400" />
          <h2 className="font-semibold text-slate-100 text-lg">Monitoreo GPS en Tiempo Real</h2>
          {isSimulating && (
            <span className="flex items-center text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold animate-pulse">
              <Activity className="w-3 h-3 mr-1 animate-spin" /> EN VIVO
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onToggleSimulation && (
            <button
              onClick={onToggleSimulation}
              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg transition-colors shadow-sm border ${
                isSimulating
                  ? 'bg-amber-950 border-amber-800 text-amber-300 hover:bg-amber-900'
                  : 'bg-emerald-950 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5 mr-1 fill-amber-300" /> Pausar Simulador
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-1 fill-emerald-300" /> Simulador en Vivo
                </>
              )}
            </button>
          )}

          <span className="text-xs bg-sky-950 text-sky-300 border border-sky-800 px-2.5 py-1 rounded-md font-mono">
            {telemetryData.length} Vehículo(s)
          </span>
        </div>
      </div>

      <div className="relative flex-1 min-h-[380px] rounded-lg overflow-hidden border border-slate-800">
        <MapContainer
          center={defaultCenter}
          zoom={11}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapAutoRecenter points={telemetryData} />

          {telemetryData.map((item) => {
            const lat = Number(item.latitude);
            const lng = Number(item.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker
                key={item.trackingNumber}
                position={[lat, lng]}
                icon={customIcon || undefined}
                eventHandlers={{
                  click: () => onSelectVehicle && onSelectVehicle(item.trackingNumber),
                }}
              >
                <Popup>
                  <div className="p-1 text-slate-900 font-sans">
                    <div className="font-bold text-sm text-sky-700">{item.trackingNumber}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      🚀 Velocidad: <span className="font-semibold">{item.speed} km/h</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      🔋 Batería GPS: <span className="font-semibold">{item.batteryLevel}%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                    {onSelectVehicle && (
                      <button
                        onClick={() => onSelectVehicle(item.trackingNumber)}
                        className="mt-2 w-full text-center px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-medium transition-colors"
                      >
                        Ver Trazado de Ruta
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
