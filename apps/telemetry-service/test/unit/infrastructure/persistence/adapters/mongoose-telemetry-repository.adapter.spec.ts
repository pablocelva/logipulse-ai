import { MongooseTelemetryRepositoryAdapter } from 'src/infrastructure/persistence/adapters/mongoose-telemetry-repository.adapter';
import { TelemetryPoint } from 'src/domain/entities/telemetry-point.entity';

describe('MongooseTelemetryRepositoryAdapter', () => {
  let adapter: MongooseTelemetryRepositoryAdapter;
  let mongooseModelMock: any;

  beforeEach(() => {
    mongooseModelMock = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    };

    adapter = new MongooseTelemetryRepositoryAdapter(mongooseModelMock);
  });

  const createSampleDoc = () => ({
    uuid: 'uuid-1',
    orderId: 'order-1',
    trackingNumber: 'TRK-1',
    driverId: 'driver-1',
    latitude: -33.4,
    longitude: -70.6,
    speedKmH: 50,
    batteryLevel: 90,
    timestamp: new Date(),
  });

  it('debe guardar un TelemetryPoint en MongoDB mediante model.create', async () => {
    const point = new TelemetryPoint('uuid-1', 'order-1', 'TRK-1', 'driver-1', -33.4, -70.6, 50, 90, new Date());
    mongooseModelMock.create.mockResolvedValue(createSampleDoc() as any);

    await adapter.save(point);

    expect(mongooseModelMock.create).toHaveBeenCalledTimes(1);
  });

  it('debe retornar lista de TelemetryPoint en findByTrackingNumber', async () => {
    const doc = createSampleDoc();
    const execMock = jest.fn().mockResolvedValue([doc]);
    const sortMock = jest.fn().mockReturnValue({ exec: execMock });
    mongooseModelMock.find.mockReturnValue({ sort: sortMock } as any);

    const results = await adapter.findByTrackingNumber('TRK-1');

    expect(results).toHaveLength(1);
    expect(results[0].trackingNumber).toBe('TRK-1');
  });

  it('debe retornar el punto más reciente en findLatestByTrackingNumber', async () => {
    const doc = createSampleDoc();
    const execMock = jest.fn().mockResolvedValue(doc);
    const sortMock = jest.fn().mockReturnValue({ exec: execMock });
    mongooseModelMock.findOne.mockReturnValue({ sort: sortMock } as any);

    const result = await adapter.findLatestByTrackingNumber('TRK-1');

    expect(result).not.toBeNull();
    expect(result?.trackingNumber).toBe('TRK-1');
  });

  it('debe retornar null si findLatestByTrackingNumber no encuentra documento', async () => {
    const execMock = jest.fn().mockResolvedValue(null);
    const sortMock = jest.fn().mockReturnValue({ exec: execMock });
    mongooseModelMock.findOne.mockReturnValue({ sort: sortMock } as any);

    const result = await adapter.findLatestByTrackingNumber('TRK-UNKNOWN');

    expect(result).toBeNull();
  });
});
