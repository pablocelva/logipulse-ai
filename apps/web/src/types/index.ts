export type OrderStatus = 'CREATED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'INCIDENT';

export interface Order {
  id: string;
  trackingNumber: string;
  customerName?: string;
  merchantId?: string;
  destinationAddress: string;
  price?: number;
  status: OrderStatus;
  createdAt: string;
}

export interface TelemetryPoint {
  trackingNumber: string;
  latitude: number;
  longitude: number;
  speed: number;
  batteryLevel: number;
  timestamp: string;
}

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AiIncidentResponse {
  severity: SeverityLevel;
  summary: string;
  suggestedAction: string;
  location?: string;
  trackingNumber?: string;
}
