'use client';

import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { Package, PlusCircle, Play, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface OrdersListProps {
  orders: Order[];
  onSeedOrders: () => void;
  onSimulateTelemetry: (trackingNumber: string) => void;
  isLoading?: boolean;
}

export default function OrdersList({
  orders,
  onSeedOrders,
  onSimulateTelemetry,
  isLoading,
}: OrdersListProps) {
  const getStatusBadge = (status: OrderStatus | string) => {
    const s = String(status || '').toUpperCase();
    if (s.includes('CREATE') || s.includes('CREAD')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/40 text-blue-300 border border-blue-700/50">
          <Clock className="w-3 h-3 mr-1" /> Creada
        </span>
      );
    }
    if (s.includes('TRANSIT')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/40 text-amber-300 border border-amber-700/50 animate-pulse">
          <Play className="w-3 h-3 mr-1" /> En Tránsito
        </span>
      );
    }
    if (s.includes('DELIVER') || s.includes('ENTREGAD')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Entregada
        </span>
      );
    }
    if (s.includes('CANCEL')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/40 text-red-300 border border-red-700/50">
          <AlertTriangle className="w-3 h-3 mr-1" /> Cancelada
        </span>
      );
    }
    if (s.includes('INCIDENT')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950 text-red-400 border border-red-800 animate-pulse font-bold">
          <AlertTriangle className="w-3 h-3 mr-1 text-red-400" /> INCIDENTE VIA
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
        {status || 'Creada'}
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-sky-400" />
          <h2 className="font-semibold text-slate-100 text-lg">Órdenes de Despacho</h2>
        </div>
        <button
          onClick={onSeedOrders}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors disabled:opacity-50 shadow-sm"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          Sembrar 5 Órdenes
        </button>
      </div>

      <div className="overflow-x-auto flex-1 border border-slate-800 rounded-lg">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Tracking N°</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Dirección</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500 text-xs">
                  No hay órdenes registradas. Haz clic en &quot;Sembrar 5 Órdenes&quot; para iniciar.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id || order.trackingNumber} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-sky-400">{order.trackingNumber}</td>
                  <td className="px-4 py-3 font-medium text-slate-200">{order.customerName || order.merchantId || 'Cliente General'}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-[180px] truncate">{order.destinationAddress}</td>
                  <td className="px-4 py-3">{getStatusBadge(order.status || (order as any)._status)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSimulateTelemetry(order.trackingNumber)}
                      className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors"
                      title="Simular actualización GPS de camioneta"
                    >
                      <Play className="w-3 h-3 mr-1 fill-sky-300" /> Simular GPS
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
