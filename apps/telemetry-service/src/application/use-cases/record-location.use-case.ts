import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { TelemetryPoint } from '../../domain/entities/telemetry-point.entity';
import { TELEMETRY_REPOSITORY_PORT, TelemetryRepositoryPort } from '../../domain/ports/telemetry-repository.port';
import { RecordLocationDto } from '../dtos/record-location.dto';

@Injectable()
export class RecordLocationUseCase {
  constructor(
    @Inject(TELEMETRY_REPOSITORY_PORT)
    private readonly repository: TelemetryRepositoryPort,
  ) {}

  async execute(dto: RecordLocationDto): Promise<TelemetryPoint> {
    const point = new TelemetryPoint(
      uuidv4(),
      dto.orderId,
      dto.trackingNumber,
      dto.driverId,
      dto.latitude,
      dto.longitude,
      dto.speedKmH,
      dto.batteryLevel ?? 100,
      new Date(),
    );

    await this.repository.save(point);
    return point;
  }
}
