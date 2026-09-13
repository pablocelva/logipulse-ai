export class TelemetryPoint {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly trackingNumber: string,
    public readonly driverId: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly speedKmH: number,
    public readonly batteryLevel: number,
    public readonly timestamp: Date,
  ) {}

  public isHighSpeed(thresholdKmH: number = 100): boolean {
    return this.speedKmH > thresholdKmH;
  }
}
