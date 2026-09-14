'use client';

import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { Package, PlusCircle, Play, CheckCircle2, Clock, AlertTriangle, Search, Filter, Eye, PackagePlus } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

interface OrdersListProps {
  orders: Order[];
  onSeedOrders?: () => void;
  onSimulateTelemetry: (trackingNumber: string) => void;
  onOpenCreateOrderModal?: () => void;
  onSelectVehicle?: (trackingNumber: string, order?: Order) => void;
  isLoading?: boolean;
}

export default function OrdersList({
  orders,
  onSeedOrders,
  onSimulateTelemetry,
  onOpenCreateOrderModal,
  onSelectVehicle,
  isLoading,
}: OrdersListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (order.trackingNumber || '').toLowerCase().includes(term) ||
      (order.merchantId || '').toLowerCase().includes(term) ||
      (order.destinationAddress || '').toLowerCase().includes(term) ||
      (order.originAddress || '').toLowerCase().includes(term);

    const st = String(order.status || (order as any)._status || '').toUpperCase();
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'CREATED' && (st.includes('CREATE') || st.includes('CREAD'))) ||
      (statusFilter === 'IN_TRANSIT' && st.includes('TRANSIT')) ||
      (statusFilter === 'DELIVERED' && (st.includes('DELIVER') || st.includes('ENTREGAD'))) ||
      (statusFilter === 'INCIDENT' && st.includes('INCIDENT'));

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col h-full space-y-4">
      {/* Header and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-sky-400" />
          <h2 className="font-semibold text-slate-100 text-lg">Órdenes de Despacho</h2>
          <span className="text-xs text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded-md">
            {filteredOrders.length} / {orders.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenCreateOrderModal && (
            <button
              onClick={onOpenCreateOrderModal}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
            >
              <PackagePlus className="w-4 h-4 mr-1.5" />
              + Nueva Orden
            </button>
          )}

          {onSeedOrders && (
            <button
              onClick={onSeedOrders}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors disabled:opacity-50 shadow-sm"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              Sembrar 5 Órdenes
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por tracking (ej. TRK-100001), cliente o dirección..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="relative flex items-center">
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 appearance-none cursor-pointer"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="CREATED">Creada</option>
            <option value="IN_TRANSIT">En Tránsito</option>
            <option value="DELIVERED">Entregada</option>
            <option value="INCIDENT">Incidente en Vía</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1 border border-slate-800 rounded-lg">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Tracking N°</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Dirección Destino</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500 text-xs">
                  {orders.length === 0
                    ? 'No hay órdenes registradas. Haz clic en "+ Nueva Orden" para iniciar.'
                    : 'No se encontraron órdenes que coincidan con la búsqueda o filtro.'}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id || order.trackingNumber} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-sky-400">{order.trackingNumber}</td>
                  <td className="px-4 py-3 font-medium text-slate-200">{order.customerName || order.merchantId || 'Cliente General'}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-[200px] truncate">{order.destinationAddress}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status || (order as any)._status} />
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {onSelectVehicle && (
                      <button
                        onClick={() => onSelectVehicle(order.trackingNumber, order)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 transition-colors"
                        title="Ver detalle del vehículo y mapa de ruta"
                      >
                        <Eye className="w-3 h-3 mr-1" /> Detalle
                      </button>
                    )}

                    <button
                      onClick={() => onSimulateTelemetry(order.trackingNumber)}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      title="Simular actualización GPS de camioneta"
                    >
                      <Play className="w-3 h-3 mr-1 fill-slate-300" /> GPS
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
