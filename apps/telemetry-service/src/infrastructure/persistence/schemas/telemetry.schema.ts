import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TelemetryDocument = TelemetryMongoEntity & Document;

@Schema({ collection: 'gps_telemetry', timestamps: true })
export class TelemetryMongoEntity {
  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true, index: true })
  trackingNumber: string;

  @Prop({ required: true })
  driverId: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  speedKmH: number;

  @Prop({ required: true, default: 100 })
  batteryLevel: number;

  @Prop({ required: true, default: Date.now })
  timestamp: Date;
}

export const TelemetrySchema = SchemaFactory.createForClass(TelemetryMongoEntity);
TelemetrySchema.index({ trackingNumber: 1, timestamp: -1 });
