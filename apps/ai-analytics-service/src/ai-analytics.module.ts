import { Module } from '@nestjs/common';
import { AI_MODEL_PORT } from './domain/ports/ai-model.port';
import { GroqAiClientAdapter } from './infrastructure/adapters/groq-ai-client.adapter';
import { WEB_SEARCH_PORT } from './domain/ports/web-search.port';
import { TavilyWebSearchAdapter } from './infrastructure/adapters/tavily-web-search.adapter';
import { AnalyzeIncidentUseCase } from './application/use-cases/analyze-incident.use-case';
import { AiAnalyticsController } from './infrastructure/http/controllers/ai-analytics.controller';
import { HealthController } from './infrastructure/http/controllers/health.controller';
import { IncidentEventsConsumer } from './infrastructure/messaging/consumers/incident-events.consumer';

@Module({
  controllers: [AiAnalyticsController, HealthController, IncidentEventsConsumer],
  providers: [
    {
      provide: AI_MODEL_PORT,
      useClass: GroqAiClientAdapter,
    },
    {
      provide: WEB_SEARCH_PORT,
      useClass: TavilyWebSearchAdapter,
    },
    AnalyzeIncidentUseCase,
  ],
})
export class AiAnalyticsModule {}
