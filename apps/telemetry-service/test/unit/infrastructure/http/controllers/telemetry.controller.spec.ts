import { TelemetryController } from 'src/infrastructure/http/controllers/telemetry.controller';
import { RecordLocationUseCase } from 'src/application/use-cases/record-location.use-case';
import { GetLocationHistoryUseCase } from 'src/application/use-cases/get-location-history.use-case';
import { TelemetryPoint } from 'src/domain/entities/telemetry-point.entity';
import { RecordLocationDto } from 'src/application/dtos/record-location.dto';

describe('TelemetryController', () => {
  let controller: TelemetryController;
  let recordLocationUseCaseMock: jest.Mocked<RecordLocationUseCase>;
  let getLocationHistoryUseCaseMock: jest.Mocked<GetLocationHistoryUseCase>;

  beforeEach(() => {
    recordLocationUseCaseMock = {
      execute: jest.fn(),
    } as any;

    getLocationHistoryUseCaseMock = {
      execute: jest.fn(),
      seedRouteTelemetry: jest.fn(),
    } as any;

    controller = new TelemetryController(
      recordLocationUseCaseMock,
      getLocationHistoryUseCaseMock,
    );
  });

  const samplePoint = new TelemetryPoint('p-1', 'o-1', 'TRK-1', 'd-1', -33.4, -70.6, 50, 90, new Date());

  it('debe registrar ubicación en POST /telemetry', async () => {
    const dto: RecordLocationDto = { orderId: 'o-1', trackingNumber: 'TRK-1', driverId: 'd-1', latitude: -33.4, longitude: -70.6, speedKmH: 50 };
    recordLocationUseCaseMock.execute.mockResolvedValue(samplePoint);

    const result = await controller.recordLocation(dto);

    expect(result).toBe(samplePoint);
    expect(recordLocationUseCaseMock.execute).toHaveBeenCalledWith(dto);
  });

  it('debe obtener historial en GET /telemetry/tracking/:trackingNumber', async () => {
    getLocationHistoryUseCaseMock.execute.mockResolvedValue([samplePoint]);

    const results = await controller.getHistory('TRK-1');

    expect(results).toHaveLength(1);
    expect(getLocationHistoryUseCaseMock.execute).toHaveBeenCalledWith('TRK-1');
  });

  it('debe poblar seeder en POST /telemetry/seed/:trackingNumber', async () => {
    getLocationHistoryUseCaseMock.seedRouteTelemetry.mockResolvedValue([samplePoint]);

    const results = await controller.seedRoute('TRK-1');

    expect(results).toHaveLength(1);
    expect(getLocationHistoryUseCaseMock.seedRouteTelemetry).toHaveBeenCalledWith('TRK-1');
  });
});
