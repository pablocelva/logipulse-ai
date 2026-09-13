import { Repository } from 'typeorm';
import { TypeOrmOrderRepositoryAdapter } from 'src/infrastructure/persistence/adapters/typeorm-order-repository.adapter';
import { OrderOrmEntity } from 'src/infrastructure/persistence/entities/order.orm-entity';
import { Order } from 'src/domain/entities/order.entity';

describe('TypeOrmOrderRepositoryAdapter', () => {
  let adapter: TypeOrmOrderRepositoryAdapter;
  let typeOrmRepoMock: jest.Mocked<Repository<OrderOrmEntity>>;

  beforeEach(() => {
    typeOrmRepoMock = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    } as any;

    adapter = new TypeOrmOrderRepositoryAdapter(typeOrmRepoMock);
  });

  const createSampleOrmEntity = (): OrderOrmEntity => {
    const entity = new OrderOrmEntity();
    entity.id = 'id-1';
    entity.trackingNumber = 'TRK-1';
    entity.merchantId = 'm-1';
    entity.originAddress = 'o';
    entity.destinationAddress = 'd';
    entity.price = 100;
    entity.status = 'CREATED';
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    return entity;
  };

  it('debe guardar una orden llamando a typeOrmRepo.save', async () => {
    const domainOrder = new Order('id-1', 'TRK-1', 'm-1', 'o', 'd', 100, 'CREATED', new Date(), new Date());

    await adapter.save(domainOrder);

    expect(typeOrmRepoMock.save).toHaveBeenCalledTimes(1);
  });

  it('debe buscar una orden por ID y mapearla a dominio', async () => {
    const ormEntity = createSampleOrmEntity();
    typeOrmRepoMock.findOne.mockResolvedValue(ormEntity);

    const result = await adapter.findById('id-1');

    expect(result).not.toBeNull();
    expect(result?.id).toBe('id-1');
    expect(typeOrmRepoMock.findOne).toHaveBeenCalledWith({ where: { id: 'id-1' } });
  });

  it('debe retornar null si la orden no existe por ID', async () => {
    typeOrmRepoMock.findOne.mockResolvedValue(null);

    const result = await adapter.findById('unknown-id');

    expect(result).toBeNull();
  });

  it('debe buscar una orden por trackingNumber', async () => {
    const ormEntity = createSampleOrmEntity();
    typeOrmRepoMock.findOne.mockResolvedValue(ormEntity);

    const result = await adapter.findByTrackingNumber('TRK-1');

    expect(result).not.toBeNull();
    expect(result?.trackingNumber).toBe('TRK-1');
  });

  it('debe listar todas las órdenes', async () => {
    const ormEntity = createSampleOrmEntity();
    typeOrmRepoMock.find.mockResolvedValue([ormEntity]);

    const results = await adapter.findAll();

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('id-1');
  });

  it('debe actualizar una orden llamando a update (save)', async () => {
    const domainOrder = new Order('id-1', 'TRK-1', 'm-1', 'o', 'd', 100, 'IN_TRANSIT', new Date(), new Date());

    await adapter.update(domainOrder);

    expect(typeOrmRepoMock.save).toHaveBeenCalledTimes(1);
  });
});
