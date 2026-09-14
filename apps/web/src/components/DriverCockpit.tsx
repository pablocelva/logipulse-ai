'use client';

import React, { useState, useEffect } from 'react';
import { Truck, MapPin, CheckCircle2, Navigation, Radio, Battery, ShieldCheck } from 'lucide-react';
import FleetMap from './FleetMap';
import OrderStatusBadge from './OrderStatusBadge';
import { Order, TelemetryPoint } from '../types';
import { api } from '../lib/api-client';

interface DriverCockpitProps {
  driverName: string;
  driverId: string;
}

export default function DriverCockpit({ driverName, driverId }: DriverCockpitProps) {
  const [assignedOrder, setAssignedOrder] = useState<Order | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [status, setStatus] = useState<string>('IN_TRANSIT');
  const [isSendingGps, setIsSendingGps] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load driver order from orders-service
  useEffect(() => {
    const loadDriverData = async () => {
      try {
        const orders = await api.orders.getAll();
        if (Array.isArray(orders) && orders.length > 0) {
          const driverOrd = orders.find((o) => o.assignedDriverId === driverId) || orders[0];
          setAssignedOrder(driverOrd);
          setStatus(driverOrd.status || 'IN_TRANSIT');

          if (driverOrd?.trackingNumber) {
            const history = await api.telemetry.getHistory(driverOrd.trackingNumber);
            if (Array.isArray(history) && history.length > 0) {
              const raw = history[history.length - 1];
              setTelemetry([
                {
                  trackingNumber: driverOrd.trackingNumber,
                  latitude: Number(raw.latitude),
                  longitude: Number(raw.longitude),
                  speed: Number(raw.speed || raw.speedKmH || 65),
                  batteryLevel: Number(raw.batteryLevel || 92),
                  timestamp: raw.timestamp || new Date().toISOString(),
                },
              ]);
            } else {
              setTelemetry([
                {
                  trackingNumber: driverOrd.trackingNumber,
                  latitude: -33.4489,
                  longitude: -70.6693,
                  speed: 65,
                  batteryLevel: 95,
                  timestamp: new Date().toISOString(),
                },
              ]);
            }
          }
        }
      } catch (err) {
        console.warn('Error cargando datos de conductor:', err);
      }
    };

    loadDriverData();
  }, [driverId]);

  const handleEmitGpsLocation = async () => {
    if (!assignedOrder) return;
    setIsSendingGps(true);
    try {
      const currentLat = telemetry[0]?.latitude || -33.4489;
      const currentLng = telemetry[0]?.longitude || -70.6693;
      const newLat = currentLat + (Math.random() - 0.5) * 0.01;
      const newLng = currentLng + (Math.random() - 0.5) * 0.01;

      const newPoint: TelemetryPoint = {
        trackingNumber: assignedOrder.trackingNumber,
        latitude: newLat,
        longitude: newLng,
        speed: Math.floor(60 + Math.random() * 30),
        batteryLevel: Math.max(10, (telemetry[0]?.batteryLevel || 90) - 1),
        timestamp: new Date().toISOString(),
      };

      await api.telemetry.recordLocation({
        trackingNumber: assignedOrder.trackingNumber,
        driverId: driverId || 'driver-123',
        latitude: newLat,
        longitude: newLng,
        speed: newPoint.speed,
        batteryLevel: newPoint.batteryLevel,
      });

      setTelemetry([newPoint]);
      showNotification(`📍 Coordenada GPS emitida: ${newLat.toFixed(4)}, ${newLng.toFixed(4)}`);
    } catch (e: any) {
      showNotification(`❌ Error transmitiendo GPS: ${e.message}`);
    } finally {
      setIsSendingGps(false);
    }
  };

  const handleUpdateStatus = async (uiStatus: string) => {
    if (!assignedOrder) return;
    setIsUpdatingStatus(true);

    let backendStatus = 'IN_TRANSIT';
    if (uiStatus === 'ENTREGADO' || uiStatus === 'DELIVERED') {
      backendStatus = 'DELIVERED';
    } else if (uiStatus === 'EN_RUTA' || uiStatus === 'IN_TRANSIT') {
      backendStatus = 'IN_TRANSIT';
    }

    try {
      await api.orders.updateStatus(assignedOrder.id, backendStatus);
      setStatus(backendStatus);
      setAssignedOrder((prev) => (prev ? { ...prev, status: backendStatus } : null));
      showNotification(`✅ Estado de la orden ${assignedOrder.trackingNumber} actualizado a: ${backendStatus}`);
    } catch (err: any) {
      showNotification(`❌ Error al actualizar estado: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-emerald-950 border border-emerald-800 text-emerald-200 px-4 py-3 rounded-xl shadow-lg flex items-center justify-between text-sm animate-bounce">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-emerald-400 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Header Conductor */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Truck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">Cabina del Conductor</h2>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                DRIVER ROLE
              </span>
            </div>
            <p className="text-sm text-slate-400">Conductor: <strong className="text-slate-200">{driverName}</strong></p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={handleEmitGpsLocation}
            disabled={isSendingGps || !assignedOrder}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/20 disabled:opacity-50"
          >
            <Radio className={`w-4 h-4 ${isSendingGps ? 'animate-spin' : 'animate-pulse'}`} />
            <span>{isSendingGps ? 'Transmitiendo GPS...' : 'Transmitir Ubicación GPS'}</span>
          </button>
        </div>
      </div>

      {/* Grid Principal Conductor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa Centrado en su Camión */}
        <div className="lg:col-span-2">
          <FleetMap
            telemetryData={telemetry}
            isSimulating={false}
            onToggleSimulation={() => {}}
          />
        </div>

        {/* Detalles de la Orden Asignada */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-sky-400" />
              <span>Envío Asignado Actual</span>
            </h3>

            {assignedOrder ? (
              <div className="space-y-4">
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Tracking:</span>
                    <span className="text-sm font-mono font-bold text-sky-400">{assignedOrder.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Origen:</span>
                    <span className="text-sm text-slate-200">{assignedOrder.origin || assignedOrder.originAddress}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Destino:</span>
                    <span className="text-sm text-slate-200">{assignedOrder.destination || assignedOrder.destinationAddress}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-400">Estado Actual:</span>
                    <OrderStatusBadge status={status} />
                  </div>
                </div>

                {/* Telemetría actual del vehículo */}
                {telemetry[0] && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 text-center">
                      <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                        <Navigation className="w-3.5 h-3.5 text-sky-400" /> Velocidad
                      </p>
                      <p className="text-lg font-bold text-white mt-1">{telemetry[0].speed} km/h</p>
                    </div>
                    <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 text-center">
                      <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                        <Battery className="w-3.5 h-3.5 text-emerald-400" /> Batería GPS
                      </p>
                      <p className="text-lg font-bold text-white mt-1">{telemetry[0].batteryLevel}%</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Cargando datos del envío asignado...</p>
            )}
          </div>

          {/* Botones de Actualización de Estado */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <label className="text-xs text-slate-400 font-medium">Actualizar Estado de la Entrega:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleUpdateStatus('EN_RUTA')}
                disabled={isUpdatingStatus || !assignedOrder}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  status === 'IN_TRANSIT' || status === 'EN_RUTA'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                🚚 En Ruta
              </button>
              <button
                onClick={() => handleUpdateStatus('ENTREGADO')}
                disabled={isUpdatingStatus || !assignedOrder}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
                  status === 'DELIVERED' || status === 'ENTREGADO'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" /> Entregado
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
