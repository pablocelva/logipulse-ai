import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { RabbitMqEventPublisherAdapter } from 'src/infrastructure/messaging/adapters/rabbitmq-event-publisher.adapter';

describe('RabbitMqEventPublisherAdapter', () => {
  let adapter: RabbitMqEventPublisherAdapter;
  let clientProxyMock: jest.Mocked<ClientProxy>;

  beforeEach(() => {
    clientProxyMock = {
      emit: jest.fn().mockReturnValue(of(true)),
    } as any;

    adapter = new RabbitMqEventPublisherAdapter(clientProxyMock);
  });

  it('debe emitir un evento llamando a client.emit', async () => {
    await adapter.publish('order.created', { orderId: 'id-1' });

    expect(clientProxyMock.emit).toHaveBeenCalledTimes(1);
    expect(clientProxyMock.emit).toHaveBeenCalledWith('order.created', { orderId: 'id-1' });
  });
});
