'use client';

import React, { useState } from 'react';
import { X, PackagePlus, Building2, MapPin, DollarSign, Loader2 } from 'lucide-react';
import { api } from '../lib/api-client';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (newOrder: any) => void;
}

export default function CreateOrderModal({ isOpen, onClose, onOrderCreated }: CreateOrderModalProps) {
  const [merchantId, setMerchantId] = useState('merchant-chile');
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [price, setPrice] = useState('18500');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!originAddress.trim() || !destinationAddress.trim()) {
      setError('Por favor ingresa la dirección de origen y destino.');
      return;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Por favor ingresa un precio válido mayor a 0.');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdOrder = await api.orders.create({
        merchantId,
        originAddress: originAddress.trim(),
        destinationAddress: destinationAddress.trim(),
        price: priceNum,
      });

      // Auto seed telemetry for new tracking number
      if (createdOrder?.trackingNumber) {
        try {
          await api.telemetry.seed(createdOrder.trackingNumber);
        } catch (seedErr) {
          console.warn('Auto telemetry seed notice:', seedErr);
        }
      }

      onOrderCreated(createdOrder);
      onClose();
      // Reset form
      setOriginAddress('');
      setDestinationAddress('');
    } catch (err: any) {
      setError(`Error al crear la orden: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2">
            <PackagePlus className="w-5 h-5 text-sky-400" />
            <h3 className="font-semibold text-slate-100 text-lg">Nueva Orden de Despacho</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-lg text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
              <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" /> Cliente / Merchant
            </label>
            <input
              type="text"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              placeholder="ej. merchant-chile"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Dirección de Origen
            </label>
            <input
              type="text"
              value={originAddress}
              onChange={(e) => setOriginAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              placeholder="ej. Av. Providencia 1234, Santiago"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-sky-400" /> Dirección de Destino
            </label>
            <input
              type="text"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              placeholder="ej. Av. Apoquindo 5678, Las Condes"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center">
              <DollarSign className="w-3.5 h-3.5 mr-1 text-amber-400" /> Precio / Costo Despacho ($)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              placeholder="15000"
              required
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors disabled:opacity-50 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creando...
                </>
              ) : (
                'Crear Orden'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
