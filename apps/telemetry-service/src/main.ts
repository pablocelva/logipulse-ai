import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { TelemetryModule } from './telemetry.module';

async function bootstrap() {
  const app = await NestFactory.create(TelemetryModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Habilitar CORS restrictivo para el origen del Dashboard Web
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Conectar como microservicio Consumidor de RabbitMQ
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672'],
      queue: 'orders_queue',
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.TELEMETRY_SERVICE_PORT || 3002;
  await app.listen(port);
  console.log(`🚀 telemetry-service corriendo en el puerto ${port} (HTTP & WebSockets)`);
  console.log(`📡 Escuchando eventos RabbitMQ en la cola 'orders_queue'`);
}
bootstrap();
