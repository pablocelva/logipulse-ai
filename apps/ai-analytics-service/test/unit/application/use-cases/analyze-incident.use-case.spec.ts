import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzeIncidentUseCase } from '../../../../src/application/use-cases/analyze-incident.use-case';
import { AI_MODEL_PORT, AiModelPort } from '../../../../src/domain/ports/ai-model.port';
import { WEB_SEARCH_PORT, WebSearchPort } from '../../../../src/domain/ports/web-search.port';
import { AnalyzeIncidentDto } from '../../../../src/application/dtos/analyze-incident.dto';

describe('AnalyzeIncidentUseCase (Application Layer)', () => {
  let useCase: AnalyzeIncidentUseCase;
  let aiModelMock: jest.Mocked<AiModelPort>;
  let webSearchMock: jest.Mocked<WebSearchPort>;

  beforeEach(async () => {
    aiModelMock = {
      analyze: jest.fn().mockResolvedValue({
        severity: 'HIGH',
        summary: 'Congestión vehicular alta por colisión.',
        suggestedAction: 'Tomar desvío por Av. Andrés Bello.',
      }),
    };

    webSearchMock = {
      search: jest.fn().mockResolvedValue('Tráfico detenido en Av. Vitacura por choque.'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyzeIncidentUseCase,
        {
          provide: AI_MODEL_PORT,
          useValue: aiModelMock,
        },
        {
          provide: WEB_SEARCH_PORT,
          useValue: webSearchMock,
        },
      ],
    }).compile();

    useCase = module.get<AnalyzeIncidentUseCase>(AnalyzeIncidentUseCase);
  });

  it('debe consultar la web con Tavily y realizar inferencia con Groq Llama 3.1', async () => {
    const dto: AnalyzeIncidentDto = {
      trackingNumber: 'TRK-555666',
      location: 'Vitacura, Santiago',
      description: 'Congestión alta reportada por chofer',
    };

    const result = await useCase.execute(dto);

    expect(result).toBeDefined();
    expect(result.severity).toBe('HIGH');
    expect(result.suggestedAction).toContain('Tomar desvío');

    expect(webSearchMock.search).toHaveBeenCalledTimes(1);
    expect(webSearchMock.search).toHaveBeenCalledWith('reporte de tráfico clima accidentes en Vitacura, Santiago');

    expect(aiModelMock.analyze).toHaveBeenCalledTimes(1);
  });
});
