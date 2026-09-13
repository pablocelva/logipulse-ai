import { Inject, Injectable } from '@nestjs/common';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { ORDER_REPOSITORY_PORT, OrderRepositoryPort } from '../../domain/ports/order-repository.port';
import { EVENT_PUBLISHER_PORT, EventPublisherPort } from '../../domain/ports/event-publisher.port';
import { OrderNotFoundException } from '../../domain/exceptions/order-domain.exception';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(EVENT_PUBLISHER_PORT)
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(id: string, newStatus: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new OrderNotFoundException(id);
    }

    switch (newStatus) {
      case 'IN_TRANSIT':
        order.markAsInTransit();
        break;
      case 'DELIVERED':
        order.markAsDelivered();
        break;
      case 'INCIDENT':
        order.reportIncident();
        break;
    }

    await this.orderRepository.update(order);

    await this.eventPublisher.publish('order.status_updated', {
      orderId: order.id,
      trackingNumber: order.trackingNumber,
      status: order.status,
      updatedAt: order.updatedAt,
    });

    return order;
  }
}
