import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepositoryPort } from '../../../domain/ports/order-repository.port';
import { Order } from '../../../domain/entities/order.entity';
import { OrderOrmEntity } from '../entities/order.orm-entity';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable()
export class TypeOrmOrderRepositoryAdapter implements OrderRepositoryPort {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly repository: Repository<OrderOrmEntity>,
  ) {}

  async save(order: Order): Promise<void> {
    const ormEntity = OrderMapper.toOrm(order);
    await this.repository.save(ormEntity);
  }

  async findById(id: string): Promise<Order | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? OrderMapper.toDomain(ormEntity) : null;
  }

  async findByTrackingNumber(trackingNumber: string): Promise<Order | null> {
    const ormEntity = await this.repository.findOne({ where: { trackingNumber } });
    return ormEntity ? OrderMapper.toDomain(ormEntity) : null;
  }

  async findAll(): Promise<Order[]> {
    const ormEntities = await this.repository.find();
    return ormEntities.map(OrderMapper.toDomain);
  }

  async update(order: Order): Promise<void> {
    const ormEntity = OrderMapper.toOrm(order);
    await this.repository.save(ormEntity);
  }
}