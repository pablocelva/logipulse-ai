import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:3001/orders', () => {
    return HttpResponse.json([
      {
        id: 'ord-1',
        trackingNumber: 'TRK-100200',
        customerName: 'Juan Pérez',
        destinationAddress: 'Av. Vitacura 9000, Vitacura',
        status: 'IN_TRANSIT',
        createdAt: new Date().toISOString(),
      },
    ]);
  }),

  http.post('http://localhost:3001/orders/seed', () => {
    return HttpResponse.json([
      {
        id: 'ord-seed-1',
        trackingNumber: 'TRK-SEED-01',
        customerName: 'Cliente Prueba 1',
        destinationAddress: 'Alameda 100, Santiago',
        status: 'CREATED',
        createdAt: new Date().toISOString(),
      },
    ]);
  }),

  http.post('http://localhost:3003/ai/seed-demo', () => {
    return HttpResponse.json({
      success: true,
      aiAnalysis: {
        severity: 'HIGH',
        summary: 'Congestión vehicular alta detectada en Av. Vitacura.',
        suggestedAction: 'Desviar transporte por Costanera Norte.',
      },
    });
  }),
];
