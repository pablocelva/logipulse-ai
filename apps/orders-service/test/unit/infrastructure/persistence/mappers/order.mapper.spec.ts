import { OrderMapper } from 'src/infrastructure/persistence/mappers/order.mapper';
import { OrderOrmEntity } from 'src/infrastructure/persistence/entities/order.orm-entity';
import { Order } from 'src/domain/entities/order.entity';

describe('OrderMapper', () => {
  it('debe mapear de OrderOrmEntity a la Entidad de Dominio Order (toDomain)', () => {
    const ormEntity = new OrderOrmEntity();
    ormEntity.id = 'uuid-orm-1';
    ormEntity.trackingNumber = 'TRK-123';
    ormEntity.merchantId = 'merchant-1';
    ormEntity.originAddress = 'Origen';
    ormEntity.destinationAddress = 'Destino';
    ormEntity.price = 15000;
    ormEntity.status = 'CREATED';
    ormEntity.createdAt = new Date();
    ormEntity.updatedAt = new Date();

    const domainEntity = OrderMapper.toDomain(ormEntity);

    expect(domainEntity).toBeInstanceOf(Order);
    expect(domainEntity.id).toBe('uuid-orm-1');
    expect(domainEntity.trackingNumber).toBe('TRK-123');
    expect(domainEntity.price).toBe(15000);
    expect(domainEntity.status).toBe('CREATED');
  });

  it('debe mapear de Entidad de Dominio Order a OrderOrmEntity (toOrm)', () => {
    const domainEntity = new Order(
      'uuid-domain-1',
      'TRK-456',
      'merchant-2',
      'Origen B',
      'Destino B',
      25000,
      'IN_TRANSIT',
      new Date(),
      new Date(),
    );

    const ormEntity = OrderMapper.toOrm(domainEntity);

    expect(ormEntity).toBeInstanceOf(OrderOrmEntity);
    expect(ormEntity.id).toBe('uuid-domain-1');
    expect(ormEntity.trackingNumber).toBe('TRK-456');
    expect(ormEntity.price).toBe(25000);
    expect(ormEntity.status).toBe('IN_TRANSIT');
  });
});
