import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IncidentAnalysis } from '../../domain/entities/incident-analysis.entity';
import { AI_MODEL_PORT, AiModelPort } from '../../domain/ports/ai-model.port';
import { WEB_SEARCH_PORT, WebSearchPort } from '../../domain/ports/web-search.port';
import { AnalyzeIncidentDto } from '../dtos/analyze-incident.dto';

@Injectable()
export class AnalyzeIncidentUseCase {
  constructor(
    @Inject(AI_MODEL_PORT)
    private readonly aiModel: AiModelPort,
    @Inject(WEB_SEARCH_PORT)
    private readonly webSearch: WebSearchPort,
  ) {}

  async execute(dto: AnalyzeIncidentDto): Promise<IncidentAnalysis> {
    // 1. Buscar contexto de tráfico/clima en tiempo real usando Tavily Search API
    const searchContext = await this.webSearch.search(
      `reporte de tráfico clima accidentes en ${dto.location}`,
    );

    // 2. Realizar inferencia ultrarrápida con Groq API (Llama 3.1 70B)
    const prompt = `Incidente en entrega: ${dto.description}. Ubicación: ${dto.location}.`;
    const aiResponse = await this.aiModel.analyze(prompt, searchContext);

    return new IncidentAnalysis(
      uuidv4(),
      dto.trackingNumber,
      dto.description,
      dto.location,
      aiResponse.severity,
      aiResponse.summary,
      aiResponse.suggestedAction,
      searchContext,
      new Date(),
    );
  }
}
