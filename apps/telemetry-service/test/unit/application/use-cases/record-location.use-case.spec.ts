import { Test, TestingModule } from '@nestjs/testing';
import { RecordLocationUseCase } from '../../../../src/application/use-cases/record-location.use-case';
import { TELEMETRY_REPOSITORY_PORT, TelemetryRepositoryPort } from '../../../../src/domain/ports/telemetry-repository.port';
import { RecordLocationDto } from '../../../../src/application/dtos/record-location.dto';

describe('RecordLocationUseCase (Application Layer)', () => {
  let useCase: RecordLocationUseCase;
  let repositoryMock: jest.Mocked<TelemetryRepositoryPort>;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn().mockResolvedValue(undefined),
      findByTrackingNumber: jest.fn(),
      findLatestByTrackingNumber: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordLocationUseCase,
        {
          provide: TELEMETRY_REPOSITORY_PORT,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<RecordLocationUseCase>(RecordLocationUseCase);
  });

  it('debe registrar un punto GPS exitosamente y guardarlo en la base de datos', async () => {
    const dto: RecordLocationDto = {
      orderId: 'order-uuid-1',
      trackingNumber: 'TRK-999000',
      driverId: 'driver-chofer-x',
      latitude: -33.4255,
      longitude: -70.6148,
      speedKmH: 45,
      batteryLevel: 95,
    };

    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(result.trackingNumber).toBe('TRK-999000');
    expect(result.latitude).toBe(-33.4255);
    expect(result.batteryLevel).toBe(95);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(result);
  });
});
