import { OrderController } from 'src/infrastructure/http/controllers/order.controller';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.use-case';
import { GetOrderByIdUseCase } from 'src/application/use-cases/get-order-by-id.use-case';
import { UpdateOrderStatusUseCase } from 'src/application/use-cases/update-order-status.use-case';
import { Order } from 'src/domain/entities/order.entity';
import { CreateOrderDto } from 'src/application/dtos/create-order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let createOrderUseCaseMock: jest.Mocked<CreateOrderUseCase>;
  let getOrderByIdUseCaseMock: jest.Mocked<GetOrderByIdUseCase>;
  let updateOrderStatusUseCaseMock: jest.Mocked<UpdateOrderStatusUseCase>;

  beforeEach(() => {
    createOrderUseCaseMock = {
      execute: jest.fn(),
      getAllOrders: jest.fn(),
      seed5Orders: jest.fn(),
    } as any;

    getOrderByIdUseCaseMock = {
      execute: jest.fn(),
    } as any;

    updateOrderStatusUseCaseMock = {
      execute: jest.fn(),
    } as any;

    controller = new OrderController(
      createOrderUseCaseMock,
      getOrderByIdUseCaseMock,
      updateOrderStatusUseCaseMock,
    );
  });

  const sampleOrder = new Order('id-1', 'TRK-1', 'm-1', 'o', 'd', 100, 'CREATED', new Date(), new Date());

  it('debe ejecutar createOrderUseCase al llamar a POST /orders', async () => {
    const dto: CreateOrderDto = { merchantId: 'm-1', originAddress: 'o', destinationAddress: 'd', price: 100 };
    createOrderUseCaseMock.execute.mockResolvedValue(sampleOrder);

    const result = await controller.createOrder(dto);

    expect(result).toBe(sampleOrder);
    expect(createOrderUseCaseMock.execute).toHaveBeenCalledWith(dto);
  });

  it('debe llamar a getAllOrders en GET /orders', async () => {
    createOrderUseCaseMock.getAllOrders.mockResolvedValue([sampleOrder]);

    const results = await controller.getAllOrders();

    expect(results).toHaveLength(1);
    expect(createOrderUseCaseMock.getAllOrders).toHaveBeenCalledTimes(1);
  });

  it('debe llamar a seed5Orders en POST /orders/seed', async () => {
    createOrderUseCaseMock.seed5Orders.mockResolvedValue([sampleOrder]);

    const results = await controller.seedOrders();

    expect(results).toHaveLength(1);
    expect(createOrderUseCaseMock.seed5Orders).toHaveBeenCalledTimes(1);
  });

  it('debe llamar a getOrderByIdUseCase en GET /orders/:id', async () => {
    getOrderByIdUseCaseMock.execute.mockResolvedValue(sampleOrder);

    const result = await controller.getOrderById('id-1');

    expect(result).toBe(sampleOrder);
    expect(getOrderByIdUseCaseMock.execute).toHaveBeenCalledWith('id-1');
  });

  it('debe llamar a updateOrderStatusUseCase en PATCH /orders/:id/status', async () => {
    updateOrderStatusUseCaseMock.execute.mockResolvedValue(sampleOrder);

    const result = await controller.updateStatus('id-1', { status: 'IN_TRANSIT' });

    expect(result).toBe(sampleOrder);
    expect(updateOrderStatusUseCaseMock.execute).toHaveBeenCalledWith('id-1', 'IN_TRANSIT');
  });
});
