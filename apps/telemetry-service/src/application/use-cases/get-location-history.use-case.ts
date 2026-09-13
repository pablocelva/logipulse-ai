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
    // Determinar la ruta adecuada según trackingNumber o su hash
    let routeIndex = 0;
    if (trackingNumber.endsWith('1') || trackingNumber.endsWith('01')) routeIndex = 0;
    else if (trackingNumber.endsWith('2') || trackingNumber.endsWith('02')) routeIndex = 1;
    else if (trackingNumber.endsWith('3') || trackingNumber.endsWith('03')) routeIndex = 2;
    else if (trackingNumber.endsWith('4') || trackingNumber.endsWith('04')) routeIndex = 3;
    else if (trackingNumber.endsWith('5') || trackingNumber.endsWith('05')) routeIndex = 4;
    else {
      let hash = 0;
      for (let j = 0; j < trackingNumber.length; j++) {
        hash += trackingNumber.charCodeAt(j);
      }
      routeIndex = Math.abs(hash) % 5;
    }

    const routes: { lat: number; lng: number; speed: number }[][] = [
      // Ruta 0: Providencia -> Av. Apoquindo 5678, Las Condes
      [
        { lat: -33.4255, lng: -70.6148, speed: 40 },
        { lat: -33.4201, lng: -70.5995, speed: 55 },
        { lat: -33.4150, lng: -70.5840, speed: 60 },
        { lat: -33.4090, lng: -70.5690, speed: 45 },
        { lat: -33.4020, lng: -70.5530, speed: 30 },
      ],
      // Ruta 1: Plaza de Armas, Santiago -> Av. Pajaritos 2300, Maipú
      [
        { lat: -33.4378, lng: -70.6504, speed: 35 },
        { lat: -33.4650, lng: -70.6900, speed: 50 },
        { lat: -33.4800, lng: -70.7150, speed: 65 },
        { lat: -33.4950, lng: -70.7380, speed: 50 },
        { lat: -33.5100, lng: -70.7570, speed: 25 },
      ],
      // Ruta 2: Puerto de Valparaíso -> Bodega Central, Quilicura
      [
        { lat: -33.0360, lng: -71.6290, speed: 45 },
        { lat: -33.1500, lng: -71.2500, speed: 85 },
        { lat: -33.2800, lng: -70.9000, speed: 90 },
        { lat: -33.3400, lng: -70.7800, speed: 70 },
        { lat: -33.3600, lng: -70.7300, speed: 35 },
      ],
      // Ruta 3: Aeropuerto Pudahuel -> Av. Vitacura 9000, Vitacura
      [
        { lat: -33.3930, lng: -70.7850, speed: 40 },
        { lat: -33.3880, lng: -70.7100, speed: 75 },
        { lat: -33.3850, lng: -70.6400, speed: 80 },
        { lat: -33.3820, lng: -70.5700, speed: 50 },
        { lat: -33.3810, lng: -70.5400, speed: 20 },
      ],
      // Ruta 4: Centro Logístico San Bernardo -> Av. Libertad 450, Viña del Mar
      [
        { lat: -33.5900, lng: -70.7000, speed: 40 },
        { lat: -33.4500, lng: -70.7200, speed: 70 },
        { lat: -33.3000, lng: -71.1000, speed: 90 },
        { lat: -33.1500, lng: -71.4500, speed: 80 },
        { lat: -33.0245, lng: -71.5518, speed: 30 },
      ],
    ];

    const selectedRoute = routes[routeIndex];
    const seededPoints: TelemetryPoint[] = [];
    const baseTime = new Date();

    for (let i = 0; i < selectedRoute.length; i++) {
      const wp = selectedRoute[i];
      const pointTime = new Date(baseTime.getTime() + i * 300000);

      const point = new TelemetryPoint(
        uuidv4(),
        'sample-order-id',
        trackingNumber,
        `driver-${trackingNumber}`,
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
