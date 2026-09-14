'use client';

import React from 'react';
import { Clock, Play, CheckCircle2, AlertTriangle } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus | string;
  className?: string;
}

export default function OrderStatusBadge({ status, className = '' }: OrderStatusBadgeProps) {
  const s = String(status || '').toUpperCase();

  if (s.includes('CREATE') || s.includes('CREAD')) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/40 text-blue-300 border border-blue-700/50 ${className}`}>
        <Clock className="w-3 h-3 mr-1" /> Creada
      </span>
    );
  }

  if (s.includes('TRANSIT') || s.includes('EN_RUTA') || s.includes('RUTA')) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-900/40 text-amber-300 border border-amber-700/50 animate-pulse ${className}`}>
        <Play className="w-3 h-3 mr-1" /> En Tránsito
      </span>
    );
  }

  if (s.includes('DELIVER') || s.includes('ENTREGAD')) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 ${className}`}>
        <CheckCircle2 className="w-3 h-3 mr-1" /> Entregada
      </span>
    );
  }

  if (s.includes('CANCEL')) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/40 text-red-300 border border-red-700/50 ${className}`}>
        <AlertTriangle className="w-3 h-3 mr-1" /> Cancelada
      </span>
    );
  }

  if (s.includes('INCIDENT')) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950 text-red-400 border border-red-800 animate-pulse font-bold ${className}`}>
        <AlertTriangle className="w-3 h-3 mr-1 text-red-400" /> Incidente en Vía
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 ${className}`}>
      {status || 'Creada'}
    </span>
  );
}
