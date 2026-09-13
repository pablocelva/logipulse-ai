import { OrderEventsConsumer } from 'src/infrastructure/messaging/consumers/order-events.consumer';

describe('OrderEventsConsumer', () => {
  let consumer: OrderEventsConsumer;

  beforeEach(() => {
    consumer = new OrderEventsConsumer();
  });

  it('debe recibir el evento order.created sin fallos', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    consumer.handleOrderCreated({ trackingNumber: 'TRK-TEST' });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[RabbitMQ Event Received] Orden creada recibida en Telemetry Service:'),
      { trackingNumber: 'TRK-TEST' },
    );

    consoleSpy.mockRestore();
  });

  it('debe recibir el evento order.status_updated sin fallos', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    consumer.handleOrderStatusUpdated({ trackingNumber: 'TRK-TEST', status: 'IN_TRANSIT' });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[RabbitMQ Event Received] Estado de orden actualizado en Telemetry Service:'),
      { trackingNumber: 'TRK-TEST', status: 'IN_TRANSIT' },
    );

    consoleSpy.mockRestore();
  });
});
