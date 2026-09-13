import { Test, TestingModule } from '@nestjs/testing';
import { UpdateOrderStatusUseCase } from '../../../../src/application/use-cases/update-order-status.use-case';
import { ORDER_REPOSITORY_PORT, OrderRepositoryPort } from '../../../../src/domain/ports/order-repository.port';
import { EVENT_PUBLISHER_PORT, EventPublisherPort } from '../../../../src/domain/ports/event-publisher.port';
import { Order } from '../../../../src/domain/entities/order.entity';
import { OrderNotFoundException } from '../../../../src/domain/exceptions/order-domain.exception';

describe('UpdateOrderStatusUseCase', () => {
  let useCase: UpdateOrderStatusUseCase;
  let repositoryMock: jest.Mocked<OrderRepositoryPort>;
  let eventPublisherMock: jest.Mocked<EventPublisherPort>;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn(),
      findById: jest.fn(),
      findByTrackingNumber: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
    };

    eventPublisherMock = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateOrderStatusUseCase,
        {
          provide: ORDER_REPOSITORY_PORT,
          useValue: repositoryMock,
        },
        {
          provide: EVENT_PUBLISHER_PORT,
          useValue: eventPublisherMock,
        },
      ],
    }).compile();

    useCase = module.get<UpdateOrderStatusUseCase>(UpdateOrderStatusUseCase);
  });

  it('debe actualizar el estado a IN_TRANSIT y publicar evento', async () => {
    const order = new Order('id-1', 'TRK-1', 'm-1', 'o', 'd', 100, 'CREATED', new Date(), new Date());
    repositoryMock.findById.mockResolvedValue(order);

    const updated = await useCase.execute('id-1', 'IN_TRANSIT');

    expect(updated.status).toBe('IN_TRANSIT');
    expect(repositoryMock.update).toHaveBeenCalledWith(order);
    expect(eventPublisherMock.publish).toHaveBeenCalledWith(
      'order.status_updated',
      expect.objectContaining({ orderId: 'id-1', status: 'IN_TRANSIT' }),
    );
  });

  it('debe actualizar el estado a DELIVERED y publicar evento', async () => {
    const order = new Order('id-1', 'TRK-1', 'm-1', 'o', 'd', 100, 'IN_TRANSIT', new Date(), new Date());
    repositoryMock.findById.mockResolvedValue(order);

    const updated = await useCase.execute('id-1', 'DELIVERED');

    expect(updated.status).toBe('DELIVERED');
  });

  it('debe actualizar el estado a INCIDENT y publicar evento', async () => {
    const order = new Order('id-1', 'TRK-1', 'm-1', 'o', 'd', 100, 'IN_TRANSIT', new Date(), new Date());
    repositoryMock.findById.mockResolvedValue(order);

    const updated = await useCase.execute('id-1', 'INCIDENT');

    expect(updated.status).toBe('INCIDENT');
  });

  it('debe lanzar OrderNotFoundException si la orden no existe', async () => {
    repositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute('unknown-id', 'IN_TRANSIT')).rejects.toThrow(OrderNotFoundException);
  });
});
