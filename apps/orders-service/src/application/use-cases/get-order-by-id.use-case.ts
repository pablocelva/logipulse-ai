import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { ORDER_REPOSITORY_PORT, OrderRepositoryPort } from '../../domain/ports/order-repository.port';
import { OrderNotFoundException } from '../../domain/exceptions/order-domain.exception';

@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new OrderNotFoundException(id);
    }
    return order;
  }
}
