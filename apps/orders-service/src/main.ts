import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { OrdersModule } from './orders.module';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.ORDERS_SERVICE_PORT || 3001;
  await app.listen(port);
  console.log(`🚀 orders-service corriendo en el puerto ${port}`);
}
bootstrap();