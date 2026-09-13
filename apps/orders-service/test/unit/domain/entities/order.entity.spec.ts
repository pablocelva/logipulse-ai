import { Order } from '../../../../src/domain/entities/order.entity';
import { InvalidOrderStateException } from '../../../../src/domain/exceptions/order-domain.exception';

describe('Order Entity (Domain Rules)', () => {
  const createSampleOrder = () =>
    new Order(
      'uuid-123',
      'TRK-100200',
      'merchant-1',
      'Origen 123',
      'Destino 456',
      15000,
      'CREATED',
      new Date(),
      new Date(),
    );

  it('debe crear una entidad Order con estado inicial CREATED', () => {
    const order = createSampleOrder();

    expect(order.id).toBe('uuid-123');
    expect(order.trackingNumber).toBe('TRK-100200');
    expect(order.status).toBe('CREATED');
    expect(order.price).toBe(15000);
  });

  it('debe permitir cambiar de estado CREATED a IN_TRANSIT', () => {
    const order = createSampleOrder();

    order.markAsInTransit();

    expect(order.status).toBe('IN_TRANSIT');
  });

  it('debe lanzar InvalidOrderStateException si se intenta poner IN_TRANSIT una orden entregada', () => {
    const order = createSampleOrder();
    order.markAsInTransit();
    order.markAsDelivered();

    expect(() => order.markAsInTransit()).toThrow(InvalidOrderStateException);
  });

  it('debe permitir cambiar de estado IN_TRANSIT a DELIVERED', () => {
    const order = createSampleOrder();
    order.markAsInTransit();

    order.markAsDelivered();

    expect(order.status).toBe('DELIVERED');
  });

  it('debe cambiar de estado a INCIDENT en cualquier momento', () => {
    const order = createSampleOrder();

    order.reportIncident();

    expect(order.status).toBe('INCIDENT');
  });
});
