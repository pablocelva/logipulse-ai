import { Inject, Injectable } from '@nestjs/common';
import { TelemetryPoint } from '../../domain/entities/telemetry-point.entity';
import { TELEMETRY_REPOSITORY_PORT, TelemetryRepositoryPort } from '../../domain/ports/telemetry-repository.port';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GetLocationHistoryUseCase {
  constructor(
    @Inject(TELEMETRY_REPOSITORY_PORT)
    private readonly repository: TelemetryRepositoryPort,
  ) {}

  async execute(trackingNumber: string): Promise<TelemetryPoint[]> {
    return this.repository.findByTrackingNumber(trackingNumber);
  }

  async seedRouteTelemetry(trackingNumber: string): Promise<TelemetryPoint[]> {
    // Coordenadas simuladas de una ruta en Santiago (de Providencia a Las Condes)
    const waypoints = [
      { lat: -33.4255, lng: -70.6148, speed: 40 }, // Providencia
      { lat: -33.4201, lng: -70.5995, speed: 55 }, // Tobalaba
      { lat: -33.4150, lng: -70.5840, speed: 60 }, // Escuela Militar
      { lat: -33.4090, lng: -70.5690, speed: 45 }, // Manquehue
      { lat: -33.4020, lng: -70.5530, speed: 30 }, // Apoquindo
    ];

    const seededPoints: TelemetryPoint[] = [];
    const baseTime = new Date();

    for (let i = 0; i < waypoints.length; i++) {
      const wp = waypoints[i];
      const pointTime = new Date(baseTime.getTime() + i * 300000); // 5 minutos entre puntos

      const point = new TelemetryPoint(
        uuidv4(),
        'sample-order-id',
        trackingNumber,
        'driver-chofer-1',
        wp.lat,
        wp.lng,
        wp.speed,
        95 - i * 2,
        pointTime,
      );

      await this.repository.save(point);
      seededPoints.push(point);
    }

    return seededPoints;
  }
}
