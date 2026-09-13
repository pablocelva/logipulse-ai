'use client';

import React, { useEffect, useState } from 'react';
import FleetMap from '../components/FleetMap';
import OrdersList from '../components/OrdersList';
import AiIncidentCard from '../components/AiIncidentCard';
import { Order, TelemetryPoint, AiIncidentResponse } from '../types';
import { api } from '../lib/api-client';
import { io } from 'socket.io-client';

const TELEMETRY_WS_URL = process.env.NEXT_PUBLIC_TELEMETRY_WS || 'http://localhost:3002';

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryPoint[]>([]);
  const [aiDiagnosis, setAiDiagnosis] = useState<AiIncidentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Fetch initial orders and their telemetry
  const fetchOrders = async () => {
    try {
      const data = await api.orders.getAll();
      if (Array.isArray(data)) {
        setOrders(data);

        // Cargar última posición GPS de cada orden registrada
        const pointsList: TelemetryPoint[] = [];
        for (const order of data) {
          try {
            const history = await api.telemetry.getHistory(order.trackingNumber);
            if (Array.isArray(history) && history.length > 0) {
              const rawPoint = history[history.length - 1];
              pointsList.push({
                ...rawPoint,
                trackingNumber: rawPoint.trackingNumber || order.trackingNumber,
                latitude: Number(rawPoint.latitude),
                longitude: Number(rawPoint.longitude),
                speed: Number(rawPoint.speed ?? rawPoint.speedKmH ?? 50),
                batteryLevel: Number(rawPoint.batteryLevel ?? 100),
                timestamp: rawPoint.timestamp || new Date().toISOString(),
              });
            }
          } catch {
            // No telemetry yet
          }
        }
        if (pointsList.length > 0) {
          setTelemetry(pointsList);
        }
      }
    } catch (err) {
      console.warn('Backend orders-service no responde aún:', err);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Connect to WebSocket Gateway on telemetry-service
    const socket = io(TELEMETRY_WS_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('⚡ Conectado al Gateway de Telemetría WebSockets');
    });

    socket.on('telemetry_updated', (data: TelemetryPoint) => {
      console.log('📍 Evento GPS recibido:', data);
      setTelemetry((prev) => {
        const index = prev.findIndex((t) => t.trackingNumber === data.trackingNumber);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = data;
          return updated;
        }
        return [...prev, data];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSeedOrders = async () => {
    setIsLoading(true);
    try {
      const seededOrders = await api.orders.seed();
      const updatedOrders = await api.orders.getAll();
      setOrders(updatedOrders);

      const targetOrders = Array.isArray(seededOrders) && seededOrders.length > 0
        ? seededOrders
        : updatedOrders;

      const pointsList: TelemetryPoint[] = [];
      for (const order of targetOrders) {
        if (!order?.trackingNumber) continue;
        try {
          const res = await api.telemetry.seed(order.trackingNumber);
          const points = Array.isArray(res) ? res : [res];
          if (points.length > 0) {
            const rawPoint = points[points.length - 1];
            pointsList.push({
              ...rawPoint,
              trackingNumber: rawPoint.trackingNumber || order.trackingNumber,
              latitude: Number(rawPoint.latitude),
              longitude: Number(rawPoint.longitude),
              speed: Number(rawPoint.speed ?? rawPoint.speedKmH ?? 50),
              batteryLevel: Number(rawPoint.batteryLevel ?? 100),
              timestamp: rawPoint.timestamp || new Date().toISOString(),
            });
          }
        } catch (e) {
          console.warn(`Error al sembrar telemetría para ${order.trackingNumber}:`, e);
        }
      }

      if (pointsList.length > 0) {
        setTelemetry(pointsList);
      }

      showNotification('✅ 5 Órdenes sembradas exitosamente con telemetría GPS para las 5 camionetas');
    } catch (err: any) {
      showNotification(`❌ Error al sembrar órdenes: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateTelemetry = async (trackingNumber: string) => {
    setIsLoading(true);
    try {
      const res = await api.telemetry.seed(trackingNumber);
      const points = Array.isArray(res) ? res : [res];

      if (points.length > 0) {
        setTelemetry((prev) => {
          let updated = [...prev];
          for (const rawPoint of points) {
            if (!rawPoint) continue;
            const point: TelemetryPoint = {
              ...rawPoint,
              trackingNumber: rawPoint.trackingNumber || trackingNumber,
              latitude: Number(rawPoint.latitude),
              longitude: Number(rawPoint.longitude),
              speed: Number(rawPoint.speed ?? rawPoint.speedKmH ?? 50),
              batteryLevel: Number(rawPoint.batteryLevel ?? 100),
              timestamp: rawPoint.timestamp || new Date().toISOString(),
            };

            if (isNaN(point.latitude) || isNaN(point.longitude)) continue;

            const index = updated.findIndex((t) => t.trackingNumber === point.trackingNumber);
            if (index >= 0) {
              updated[index] = point;
            } else {
              updated.push(point);
            }
          }
          return updated;
        });
      }
      showNotification(`📍 Ruta GPS de 5 puntos generada en MongoDB para ${trackingNumber}`);
    } catch (err: any) {
      showNotification(`❌ Error al simular GPS: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAiDemo = async () => {
    setIsLoading(true);
    try {
      const res = await api.ai.seedDemo();
      const analysis = res?.aiAnalysis || res;
      if (analysis && (analysis.severity || analysis.summary)) {
        setAiDiagnosis({
          severity: analysis.severity || 'HIGH',
          summary: analysis.summary || analysis.incidentDescription || 'Análisis de incidente completado.',
          suggestedAction: analysis.suggestedAction || 'Evaluar ruta de desvío.',
        });
        showNotification('🤖 Diagnóstico de IA (Groq Cloud + Tavily) generado exitosamente');
      }
    } catch (err: any) {
      showNotification(`❌ Error en inferencia IA: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="bg-sky-950 border border-sky-800 text-sky-200 px-4 py-3 rounded-xl shadow-lg flex items-center justify-between text-sm animate-bounce">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-sky-400 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Grid Superior: Mapa de Flotas e Incidentes de IA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <FleetMap telemetryData={telemetry} />
        </div>
        <div>
          <AiIncidentCard
            diagnosis={aiDiagnosis}
            onRunDemo={handleRunAiDemo}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Grid Inferior: Tabla de Órdenes */}
      <div>
        <OrdersList
          orders={orders}
          onSeedOrders={handleSeedOrders}
          onSimulateTelemetry={handleSimulateTelemetry}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
