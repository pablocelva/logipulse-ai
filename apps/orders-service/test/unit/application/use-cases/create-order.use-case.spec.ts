import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderUseCase } from '../../../../src/application/use-cases/create-order.use-case';
import { ORDER_REPOSITORY_PORT, OrderRepositoryPort } from '../../../../src/domain/ports/order-repository.port';
import { EVENT_PUBLISHER_PORT, EventPublisherPort } from '../../../../src/domain/ports/event-publisher.port';
import { CreateOrderDto } from '../../../../src/application/dtos/create-order.dto';
import { Order } from '../../../../src/domain/entities/order.entity';

describe('CreateOrderUseCase (Application Layer)', () => {
  let useCase: CreateOrderUseCase;
  let repositoryMock: jest.Mocked<OrderRepositoryPort>;
  let eventPublisherMock: jest.Mocked<EventPublisherPort>;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findByTrackingNumber: jest.fn(),
      findAll: jest.fn().mockResolvedValue([]),
      update: jest.fn(),
    };

    eventPublisherMock = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrderUseCase,
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

    useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
  });

  it('debe crear una orden exitosamente y publicar el evento order.created', async () => {
    const dto: CreateOrderDto = {
      merchantId: 'merchant-test',
      originAddress: 'Av. Providencia 100',
      destinationAddress: 'Av. Apoquindo 500',
      price: 20000,
    };

    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(result.merchantId).toBe('merchant-test');
    expect(result.status).toBe('CREATED');
    expect(result.trackingNumber).toMatch(/^TRK-\d{6}$/);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(result);

    expect(eventPublisherMock.publish).toHaveBeenCalledTimes(1);
  });

  it('debe retornar todas las órdenes registradas en getAllOrders', async () => {
    const sampleOrder = new Order('id-1', 'TRK-1', 'm-1', 'o', 'd', 100, 'CREATED', new Date(), new Date());
    repositoryMock.findAll.mockResolvedValue([sampleOrder]);

    const result = await useCase.getAllOrders();

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(sampleOrder);
    expect(repositoryMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('debe generar 5 órdenes de demostración en seed5Orders', async () => {
    const result = await useCase.seed5Orders();

    expect(result).toHaveLength(5);
    expect(repositoryMock.save).toHaveBeenCalledTimes(5);
    expect(eventPublisherMock.publish).toHaveBeenCalledTimes(5);
  });
});
