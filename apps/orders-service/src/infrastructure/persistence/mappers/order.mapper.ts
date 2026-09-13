import { Order, OrderStatus } from '../../../domain/entities/order.entity';
import { OrderOrmEntity } from '../entities/order.orm-entity';

export class OrderMapper {
  public static toDomain(ormEntity: OrderOrmEntity): Order {
    return new Order(
      ormEntity.id,
      ormEntity.trackingNumber,
      ormEntity.merchantId,
      ormEntity.originAddress,
      ormEntity.destinationAddress,
      Number(ormEntity.price),
      ormEntity.status as OrderStatus,
      ormEntity.createdAt,
      ormEntity.updatedAt,
    );
  }

  public static toOrm(domainEntity: Order): OrderOrmEntity {
    const ormEntity = new OrderOrmEntity();
    ormEntity.id = domainEntity.id;
    ormEntity.trackingNumber = domainEntity.trackingNumber;
    ormEntity.merchantId = domainEntity.merchantId;
    ormEntity.originAddress = domainEntity.originAddress;
    ormEntity.destinationAddress = domainEntity.destinationAddress;
    ormEntity.price = domainEntity.price;
    ormEntity.status = domainEntity.status;
    ormEntity.createdAt = domainEntity.createdAt;
    ormEntity.updatedAt = domainEntity.updatedAt;
    return ormEntity;
  }
}