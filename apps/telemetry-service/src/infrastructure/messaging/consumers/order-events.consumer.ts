import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrderEventsConsumer {
  @EventPattern('order.created')
  handleOrderCreated(@Payload() data: any) {
    console.log(`📦 [RabbitMQ Event Received] Orden creada recibida en Telemetry Service:`, data);
  }

  @EventPattern('order.status_updated')
  handleOrderStatusUpdated(@Payload() data: any) {
    console.log(`🔄 [RabbitMQ Event Received] Estado de orden actualizado en Telemetry Service:`, data);
  }
}
