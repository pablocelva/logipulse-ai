export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class OrderNotFoundException extends DomainException {
  constructor(orderId: string) {
    super(`La orden con ID ${orderId} no fue encontrada.`);
  }
}

export class InvalidOrderStateException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}