import * as dotenv from 'dotenv';
import * as path from 'path';

// Cargar variables de entorno desde la raíz del monorepo y local
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { AiAnalyticsModule } from './ai-analytics.module';

async function bootstrap() {
  const app = await NestFactory.create(AiAnalyticsModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672'],
      queue: 'orders_queue',
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.AI_SERVICE_PORT || 3003;
  await app.listen(port);
  console.log(`🚀 ai-analytics-service corriendo en el puerto ${port}`);
  console.log(`🤖 Servicio de Inteligencia Artificial (Groq API + Tavily) activo y conectado a RabbitMQ`);
}
bootstrap();
