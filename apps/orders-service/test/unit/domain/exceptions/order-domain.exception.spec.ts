import {
  DomainException,
  InvalidOrderStateException,
  OrderNotFoundException,
} from '../../../../src/domain/exceptions/order-domain.exception';

describe('Order Domain Exceptions', () => {
  it('debe instanciar DomainException correctamente', () => {
    const exception = new DomainException('Error genérico de dominio');
    expect(exception.message).toBe('Error genérico de dominio');
    expect(exception.name).toBe('DomainException');
  });

  it('debe instanciar OrderNotFoundException con el mensaje formateado', () => {
    const exception = new OrderNotFoundException('order-uuid-999');
    expect(exception.message).toBe('La orden con ID order-uuid-999 no fue encontrada.');
    expect(exception.name).toBe('OrderNotFoundException');
  });

  it('debe instanciar InvalidOrderStateException con el mensaje adecuado', () => {
    const exception = new InvalidOrderStateException('Estado inválido');
    expect(exception.message).toBe('Estado inválido');
    expect(exception.name).toBe('InvalidOrderStateException');
  });
});
