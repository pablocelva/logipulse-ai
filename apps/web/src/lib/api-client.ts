const ORDERS_SERVICE_URL = process.env.NEXT_PUBLIC_ORDERS_URL || 'http://localhost:3001';
const TELEMETRY_SERVICE_URL = process.env.NEXT_PUBLIC_TELEMETRY_URL || 'http://localhost:3002';
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:3003';

export async function apiClient<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Error de conexión');
    throw new Error(`[API Error ${response.status}]: ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  orders: {
    getAll: () => apiClient<any[]>(`${ORDERS_SERVICE_URL}/orders`),
    create: (data: { merchantId: string; originAddress: string; destinationAddress: string; price: number }) =>
      apiClient<any>(`${ORDERS_SERVICE_URL}/orders`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    seed: () => apiClient<any[]>(`${ORDERS_SERVICE_URL}/orders/seed`, { method: 'POST' }),
  },
  telemetry: {
    getHistory: (trackingNumber: string) =>
      apiClient<any[]>(`${TELEMETRY_SERVICE_URL}/telemetry/tracking/${trackingNumber}`),
    seed: (trackingNumber: string) =>
      apiClient<any>(`${TELEMETRY_SERVICE_URL}/telemetry/seed/${trackingNumber}`, {
        method: 'POST',
      }),
    recordLocation: (data: { trackingNumber: string; driverId: string; latitude: number; longitude: number; speed: number; batteryLevel?: number }) =>
      apiClient<any>(`${TELEMETRY_SERVICE_URL}/telemetry`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
  ai: {
    seedDemo: () => apiClient<any>(`${AI_SERVICE_URL}/ai/seed-demo`, { method: 'POST' }),
    analyze: (data: { trackingNumber: string; location: string; description: string }) =>
      apiClient<any>(`${AI_SERVICE_URL}/ai/analyze-incident`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
};
