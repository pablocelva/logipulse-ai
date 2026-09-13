import { Test, TestingModule } from '@nestjs/testing';
import { GetOrderByIdUseCase } from '../../../../src/application/use-cases/get-order-by-id.use-case';
import { ORDER_REPOSITORY_PORT, OrderRepositoryPort } from '../../../../src/domain/ports/order-repository.port';
import { Order } from '../../../../src/domain/entities/order.entity';
import { OrderNotFoundException } from '../../../../src/domain/exceptions/order-domain.exception';

describe('GetOrderByIdUseCase', () => {
  let useCase: GetOrderByIdUseCase;
  let repositoryMock: jest.Mocked<OrderRepositoryPort>;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn(),
      findById: jest.fn(),
      findByTrackingNumber: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrderByIdUseCase,
        {
          provide: ORDER_REPOSITORY_PORT,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<GetOrderByIdUseCase>(GetOrderByIdUseCase);
  });

  it('debe retornar una orden si existe en el repositorio', async () => {
    const sampleOrder = new Order(
      'order-1', 'TRK-1', 'merchant-1', 'Origen', 'Destino', 10000, 'CREATED', new Date(), new Date(),
    );
    repositoryMock.findById.mockResolvedValue(sampleOrder);

    const result = await useCase.execute('order-1');

    expect(result).toBe(sampleOrder);
    expect(repositoryMock.findById).toHaveBeenCalledWith('order-1');
  });

  it('debe lanzar OrderNotFoundException si la orden no existe', async () => {
    repositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute('non-existent-id')).rejects.toThrow(OrderNotFoundException);
  });
});
