import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderOrmEntity } from './infrastructure/persistence/entities/order.orm-entity';
import { ORDER_REPOSITORY_PORT } from './domain/ports/order-repository.port';
import { TypeOrmOrderRepositoryAdapter } from './infrastructure/persistence/adapters/typeorm-order-repository.adapter';
import { EVENT_PUBLISHER_PORT } from './domain/ports/event-publisher.port';
import { RabbitMqEventPublisherAdapter } from './infrastructure/messaging/adapters/rabbitmq-event-publisher.adapter';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { GetOrderByIdUseCase } from './application/use-cases/get-order-by-id.use-case';
import { UpdateOrderStatusUseCase } from './application/use-cases/update-order-status.use-case';
import { OrderController } from './infrastructure/http/controllers/order.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5433', 10),
      username: process.env.POSTGRES_USER || 'logipulse_user',
      password: process.env.POSTGRES_PASSWORD || 'logipulse_secret',
      database: process.env.POSTGRES_DB || 'logipulse_db',
      entities: [OrderOrmEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([OrderOrmEntity]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672'],
          queue: 'orders_queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    {
      provide: ORDER_REPOSITORY_PORT,
      useClass: TypeOrmOrderRepositoryAdapter,
    },
    {
      provide: EVENT_PUBLISHER_PORT,
      useClass: RabbitMqEventPublisherAdapter,
    },
    CreateOrderUseCase,
    GetOrderByIdUseCase,
    UpdateOrderStatusUseCase,
  ],
})
export class OrdersModule {}