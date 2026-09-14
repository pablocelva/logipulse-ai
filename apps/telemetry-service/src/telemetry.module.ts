import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelemetryMongoEntity, TelemetrySchema } from './infrastructure/persistence/schemas/telemetry.schema';
import { TELEMETRY_REPOSITORY_PORT } from './domain/ports/telemetry-repository.port';
import { MongooseTelemetryRepositoryAdapter } from './infrastructure/persistence/adapters/mongoose-telemetry-repository.adapter';
import { RecordLocationUseCase } from './application/use-cases/record-location.use-case';
import { GetLocationHistoryUseCase } from './application/use-cases/get-location-history.use-case';
import { TelemetryController } from './infrastructure/http/controllers/telemetry.controller';
import { HealthController } from './infrastructure/http/controllers/health.controller';
import { TelemetryGateway } from './infrastructure/websockets/telemetry.gateway';
import { OrderEventsConsumer } from './infrastructure/messaging/consumers/order-events.consumer';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb://root:mongo_secret@localhost:27017/logipulse_telemetry?authSource=admin',
    ),
    MongooseModule.forFeature([
      { name: TelemetryMongoEntity.name, schema: TelemetrySchema },
    ]),
  ],
  controllers: [TelemetryController, HealthController, OrderEventsConsumer],
  providers: [
    {
      provide: TELEMETRY_REPOSITORY_PORT,
      useClass: MongooseTelemetryRepositoryAdapter,
    },
    RecordLocationUseCase,
    GetLocationHistoryUseCase,
    TelemetryGateway,
  ],
})
export class TelemetryModule {}
