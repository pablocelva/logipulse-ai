import { Test, TestingModule } from '@nestjs/testing';
import { GetLocationHistoryUseCase } from '../../../../src/application/use-cases/get-location-history.use-case';
import { TELEMETRY_REPOSITORY_PORT, TelemetryRepositoryPort } from '../../../../src/domain/ports/telemetry-repository.port';
import { TelemetryPoint } from '../../../../src/domain/entities/telemetry-point.entity';

describe('GetLocationHistoryUseCase', () => {
  let useCase: GetLocationHistoryUseCase;
  let repositoryMock: jest.Mocked<TelemetryRepositoryPort>;

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn().mockResolvedValue(undefined),
      findByTrackingNumber: jest.fn(),
      findLatestByTrackingNumber: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetLocationHistoryUseCase,
        {
          provide: TELEMETRY_REPOSITORY_PORT,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    useCase = module.get<GetLocationHistoryUseCase>(GetLocationHistoryUseCase);
  });

  it('debe retornar el historial de puntos GPS por trackingNumber', async () => {
    const samplePoint = new TelemetryPoint('id-1', 'o-1', 'TRK-1', 'd-1', -33.4, -70.6, 50, 90, new Date());
    repositoryMock.findByTrackingNumber.mockResolvedValue([samplePoint]);

    const result = await useCase.execute('TRK-1');

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(samplePoint);
    expect(repositoryMock.findByTrackingNumber).toHaveBeenCalledWith('TRK-1');
  });

  it('debe generar y guardar 5 puntos GPS de demostración en seedRouteTelemetry', async () => {
    const points = await useCase.seedRouteTelemetry('TRK-SEED-1');

    expect(points).toHaveLength(5);
    expect(repositoryMock.save).toHaveBeenCalledTimes(5);
  });
});
