import { InvalidOrderStateException } from '../exceptions/order-domain.exception';

export type OrderStatus = 'CREATED' | 'IN_TRANSIT' | 'DELIVERED' | 'INCIDENT';

export class Order {
  private _status: OrderStatus;
  public updatedAt: Date;

  constructor(
    public readonly id: string,
    public readonly trackingNumber: string,
    public readonly merchantId: string,
    public readonly originAddress: string,
    public readonly destinationAddress: string,
    public readonly price: number,
    status: OrderStatus,
    public readonly createdAt: Date,
    updatedAt?: Date,
  ) {
    this._status = status;
    this.updatedAt = updatedAt || createdAt;
  }

  public get status(): OrderStatus {
    return this._status;
  }

  public markAsInTransit(): void {
    if (this._status !== 'CREATED') {
      throw new InvalidOrderStateException(
        `No se puede cambiar a IN_TRANSIT desde el estado actual: ${this._status}`,
      );
    }
    this._status = 'IN_TRANSIT';
    this.touch();
  }

  public markAsDelivered(): void {
    if (this._status !== 'IN_TRANSIT') {
      throw new InvalidOrderStateException(
        `No se puede entregar una orden que no está en tránsito (Estado actual: ${this._status})`,
      );
    }
    this._status = 'DELIVERED';
    this.touch();
  }

  public reportIncident(): void {
    this._status = 'INCIDENT';
    this.touch();
  }

  private touch(): void {
    this.updatedAt = new Date();
  }

  public toJSON() {
    return {
      id: this.id,
      trackingNumber: this.trackingNumber,
      merchantId: this.merchantId,
      originAddress: this.originAddress,
      destinationAddress: this.destinationAddress,
      price: this.price,
      status: this._status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
