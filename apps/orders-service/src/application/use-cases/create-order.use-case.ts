import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Order, OrderStatus } from '../../domain/entities/order.entity';
import { ORDER_REPOSITORY_PORT, OrderRepositoryPort } from '../../domain/ports/order-repository.port';
import { EVENT_PUBLISHER_PORT, EventPublisherPort } from '../../domain/ports/event-publisher.port';
import { CreateOrderDto } from '../dtos/create-order.dto';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY_PORT)
    private readonly orderRepository: OrderRepositoryPort,
    @Inject(EVENT_PUBLISHER_PORT)
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    const trackingNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();

    const order = new Order(
      uuidv4(),
      trackingNumber,
      dto.merchantId,
      dto.originAddress,
      dto.destinationAddress,
      dto.price,
      'CREATED',
      now,
      now,
    );

    await this.orderRepository.save(order);

    await this.eventPublisher.publish('order.created', {
      orderId: order.id,
      trackingNumber: order.trackingNumber,
      merchantId: order.merchantId,
      status: order.status,
      timestamp: order.createdAt,
    });

    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async seed5Orders(): Promise<Order[]> {
    const sampleOrders: {
      merchantId: string;
      originAddress: string;
      destinationAddress: string;
      price: number;
      status: OrderStatus;
    }[] = [
      { merchantId: 'merchant-alpha', originAddress: 'Av. Providencia 1234, Santiago', destinationAddress: 'Av. Apoquindo 5678, Las Condes', price: 15000, status: 'CREATED' },
      { merchantId: 'merchant-alpha', originAddress: 'Plaza de Armas, Santiago', destinationAddress: 'Av. Pajaritos 2300, Maipú', price: 28500, status: 'IN_TRANSIT' },
      { merchantId: 'merchant-beta', originAddress: 'Puerto de Valparaíso, Terminal 1', destinationAddress: 'Bodega Central, Quilicura', price: 42000, status: 'DELIVERED' },
      { merchantId: 'merchant-gamma', originAddress: 'Aeropuerto Pudahuel, Carga', destinationAddress: 'Av. Vitacura 9000, Vitacura', price: 19900, status: 'INCIDENT' },
      { merchantId: 'merchant-beta', originAddress: 'Centro Logístico, San Bernardo', destinationAddress: 'Av. Libertad 450, Viña del Mar', price: 33400, status: 'IN_TRANSIT' },
    ];

    const createdOrders: Order[] = [];

    for (const item of sampleOrders) {
      const trackingNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date();

      const order = new Order(
        uuidv4(),
        trackingNumber,
        item.merchantId,
        item.originAddress,
        item.destinationAddress,
        item.price,
        item.status,
        now,
        now,
      );

      await this.orderRepository.save(order);
      await this.eventPublisher.publish('order.created', {
        orderId: order.id,
        trackingNumber: order.trackingNumber,
        merchantId: order.merchantId,
        status: order.status,
        timestamp: order.createdAt,
      });

      createdOrders.push(order);
    }

    return createdOrders;
  }
}
