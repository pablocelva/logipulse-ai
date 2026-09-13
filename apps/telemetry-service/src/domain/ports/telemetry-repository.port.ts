import { TelemetryPoint } from '../entities/telemetry-point.entity';

export const TELEMETRY_REPOSITORY_PORT = Symbol('TELEMETRY_REPOSITORY_PORT');

export interface TelemetryRepositoryPort {
  save(point: TelemetryPoint): Promise<void>;
  findByTrackingNumber(trackingNumber: string): Promise<TelemetryPoint[]>;
  findLatestByTrackingNumber(trackingNumber: string): Promise<TelemetryPoint | null>;
}
