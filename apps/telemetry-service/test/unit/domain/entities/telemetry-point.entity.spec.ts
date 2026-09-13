import { TelemetryPoint } from '../../../../src/domain/entities/telemetry-point.entity';

describe('TelemetryPoint Entity (Domain Rules)', () => {
  it('debe crear un punto de telemetría GPS válido', () => {
    const point = new TelemetryPoint(
      'uuid-point-1',
      'order-123',
      'TRK-777888',
      'driver-1',
      -33.4255,
      -70.6148,
      60,
      85,
      new Date(),
    );

    expect(point.id).toBe('uuid-point-1');
    expect(point.trackingNumber).toBe('TRK-777888');
    expect(point.speedKmH).toBe(60);
  });

  it('debe detectar exceso de velocidad si supera el umbral predeterminado (100 km/h)', () => {
    const normalPoint = new TelemetryPoint(
      'id-1', 'order-1', 'TRK-1', 'driver-1', -33.4, -70.6, 80, 90, new Date(),
    );
    const fastPoint = new TelemetryPoint(
      'id-2', 'order-1', 'TRK-1', 'driver-1', -33.4, -70.6, 125, 90, new Date(),
    );

    expect(normalPoint.isHighSpeed()).toBe(false);
    expect(fastPoint.isHighSpeed()).toBe(true);
  });
});
