'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { X, Navigation, Gauge, Battery, Clock, MapPin, Loader2 } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import { TelemetryPoint } from '../types';
import { api } from '../lib/api-client';

// Dynamic Leaflet imports to avoid SSR issues
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
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

interface VehicleDetailModalProps {
  trackingNumber: string | null;
  isOpen: boolean;
  onClose: () => void;
  orderInfo?: any;
}

export default function VehicleDetailModal({
  trackingNumber,
  isOpen,
  onClose,
  orderInfo,
}: VehicleDetailModalProps) {
  const [history, setHistory] = useState<TelemetryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      import('leaflet').then((L) => {
        const icon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
        setCustomIcon(icon);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && trackingNumber) {
      setIsLoading(true);
      api.telemetry
        .getHistory(trackingNumber)
        .then((res) => {
          if (Array.isArray(res)) {
            setHistory(res);
          }
        })
        .catch((err) => console.warn('Error fetching telemetry history:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, trackingNumber]);

  if (!isOpen || !trackingNumber) return null;

  const validPoints = history.filter(
    (p) => !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude))
  );

  const polylineCoords = validPoints.map(
    (p) => [Number(p.latitude), Number(p.longitude)] as [number, number]
  );

  const latestPoint = validPoints.length > 0 ? validPoints[validPoints.length - 1] : null;
  const center: [number, number] = latestPoint
    ? [Number(latestPoint.latitude), Number(latestPoint.longitude)]
    : [-33.425, -70.605];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sky-950 border border-sky-800 rounded-lg text-sky-400">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-lg flex items-center">
                Vehículo <span className="font-mono text-sky-400 ml-2">{trackingNumber}</span>
              </h3>
              <p className="text-xs text-slate-400">Trazado de Ruta y Telemetría GPS en Tiempo Real</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Order Details Grid */}
          {orderInfo && (
            <div className="grid grid-cols-2 gap-4 bg-slate-950/50 p-3.5 rounded-lg border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Cliente / Merchant:</span>
                <span className="text-slate-200 font-semibold">{orderInfo.merchantId || 'Cliente General'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Estado Actual:</span>
                <div className="mt-0.5">
                  <OrderStatusBadge status={orderInfo.status} />
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Origen:</span>
                <span className="text-slate-300 truncate block">{orderInfo.originAddress || orderInfo.origin}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Destino:</span>
                <span className="text-slate-300 truncate block">{orderInfo.destinationAddress || orderInfo.destination}</span>
              </div>
            </div>
          )}

          {/* Telemetry Metrics */}
          {latestPoint && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-sky-950/40 border border-sky-800/60 p-3 rounded-lg flex items-center space-x-3">
                <Gauge className="w-5 h-5 text-sky-400" />
                <div>
                  <div className="text-[10px] uppercase text-sky-300 font-medium">Velocidad Actual</div>
                  <div className="text-sm font-bold text-sky-100">{latestPoint.speed || 50} km/h</div>
                </div>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-800/60 p-3 rounded-lg flex items-center space-x-3">
                <Battery className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-[10px] uppercase text-emerald-300 font-medium">Batería GPS</div>
                  <div className="text-sm font-bold text-emerald-100">{latestPoint.batteryLevel || 95}%</div>
                </div>
              </div>

              <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-lg flex items-center space-x-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-[10px] uppercase text-amber-300 font-medium">Último Evento</div>
                  <div className="text-xs font-mono font-semibold text-amber-100 truncate">
                    {new Date(latestPoint.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaflet Trajectory Map */}
          <div className="h-[260px] rounded-lg overflow-hidden border border-slate-800 relative">
            {isLoading ? (
              <div className="h-full bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
                <Loader2 className="w-5 h-5 animate-spin mr-2 text-sky-400" />
                Cargando trazado de ruta...
              </div>
            ) : (
              <MapContainer
                center={center}
                zoom={12}
                scrollWheelZoom={true}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Draw Polyline representing historical trajectory */}
                {polylineCoords.length > 1 && (
                  <Polyline
                    positions={polylineCoords}
                    pathOptions={{ color: '#0284c7', weight: 4, opacity: 0.8, dashArray: '8, 8' }}
                  />
                )}

                {/* Render markers for waypoints */}
                {validPoints.map((pt, idx) => (
                  <Marker
                    key={pt.id || idx}
                    position={[Number(pt.latitude), Number(pt.longitude)]}
                    icon={customIcon || undefined}
                  />
                ))}
              </MapContainer>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}
