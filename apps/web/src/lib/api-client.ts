const ORDERS_SERVICE_URL = process.env.NEXT_PUBLIC_ORDERS_URL || 'http://localhost:3001';
const TELEMETRY_SERVICE_URL = process.env.NEXT_PUBLIC_TELEMETRY_URL || 'http://localhost:3002';
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:3003';
const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3004';

export async function apiClient<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('logipulse_jwt_token') : null;
  if (storedToken) {
    defaultHeaders['Authorization'] = `Bearer ${storedToken}`;
  }

  const response = await fetch(url, {
    credentials: 'include', // OWASP Cookie Transmittal
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    let parsedMessage = '';

    try {
      const json = JSON.parse(errorText);
      parsedMessage = json.message || json.error || errorText;
    } catch {
      parsedMessage = errorText;
    }

    if (response.status === 401) {
      const isBadCredentials =
        !parsedMessage ||
        parsedMessage === 'Unauthorized' ||
        parsedMessage === 'Credenciales inválidas' ||
        parsedMessage.includes('Unauthorized');

      throw new Error(
        isBadCredentials
          ? 'Correo electrónico o contraseña incorrectos. Por favor, verifica tus datos.'
          : parsedMessage
      );
    }

    if (response.status === 403) {
      throw new Error('No tienes permisos suficientes para realizar esta acción.');
    }

    throw new Error(
      typeof parsedMessage === 'string' && parsedMessage.length > 0 && !parsedMessage.startsWith('{')
        ? parsedMessage
        : `Error al procesar la solicitud (${response.status})`
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const res = await apiClient<{ accessToken: string; user: any }>(`${AUTH_SERVICE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.accessToken && typeof window !== 'undefined') {
        localStorage.setItem('logipulse_jwt_token', res.accessToken);
        localStorage.setItem('logipulse_user', JSON.stringify(res.user));
      }
      return res;
    },
    logout: async () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('logipulse_jwt_token');
        localStorage.removeItem('logipulse_user');
      }
      try {
        await apiClient<{ message: string }>(`${AUTH_SERVICE_URL}/auth/logout`, { method: 'POST' });
      } catch {
        // Ignore logout network errors if server unreached
      }
    },
    me: async () => {
      return apiClient<{ user: any }>(`${AUTH_SERVICE_URL}/auth/me`, { method: 'GET' });
    },
  },
  orders: {
    getAll: () => apiClient<any[]>(`${ORDERS_SERVICE_URL}/orders`),
    create: (data: { merchantId: string; originAddress: string; destinationAddress: string; price: number }) =>
      apiClient<any>(`${ORDERS_SERVICE_URL}/orders`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    seed: () => apiClient<any[]>(`${ORDERS_SERVICE_URL}/orders/seed`, { method: 'POST' }),
    updateStatus: (id: string, status: string) =>
      apiClient<any>(`${ORDERS_SERVICE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
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
