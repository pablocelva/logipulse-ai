import { Order } from '../entities/order.entity';

export const ORDER_REPOSITORY_PORT = Symbol('ORDER_REPOSITORY_PORT');

export interface OrderRepositoryPort {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByTrackingNumber(trackingNumber: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  update(order: Order): Promise<void>;
}