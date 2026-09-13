import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TelemetryRepositoryPort } from '../../../domain/ports/telemetry-repository.port';
import { TelemetryPoint } from '../../../domain/entities/telemetry-point.entity';
import { TelemetryDocument, TelemetryMongoEntity } from '../schemas/telemetry.schema';

@Injectable()
export class MongooseTelemetryRepositoryAdapter implements TelemetryRepositoryPort {
  constructor(
    @InjectModel(TelemetryMongoEntity.name)
    private readonly model: Model<TelemetryDocument>,
  ) {}

  async save(point: TelemetryPoint): Promise<void> {
    await this.model.create({
      uuid: point.id,
      orderId: point.orderId,
      trackingNumber: point.trackingNumber,
      driverId: point.driverId,
      latitude: point.latitude,
      longitude: point.longitude,
      speedKmH: point.speedKmH,
      batteryLevel: point.batteryLevel,
      timestamp: point.timestamp,
    });
  }

  async findByTrackingNumber(trackingNumber: string): Promise<TelemetryPoint[]> {
    const docs = await this.model.find({ trackingNumber }).sort({ timestamp: 1 }).exec();
    return docs.map(
      (doc) =>
        new TelemetryPoint(
          doc.uuid,
          doc.orderId,
          doc.trackingNumber,
          doc.driverId,
          doc.latitude,
          doc.longitude,
          doc.speedKmH,
          doc.batteryLevel,
          doc.timestamp,
        ),
    );
  }

  async findLatestByTrackingNumber(trackingNumber: string): Promise<TelemetryPoint | null> {
    const doc = await this.model.findOne({ trackingNumber }).sort({ timestamp: -1 }).exec();
    if (!doc) return null;

    return new TelemetryPoint(
      doc.uuid,
      doc.orderId,
      doc.trackingNumber,
      doc.driverId,
      doc.latitude,
      doc.longitude,
      doc.speedKmH,
      doc.batteryLevel,
      doc.timestamp,
    );
  }
}
