import { Body, Controller, Post } from '@nestjs/common';
import { AnalyzeIncidentUseCase } from '../../../application/use-cases/analyze-incident.use-case';
import { AnalyzeIncidentDto } from '../../../application/dtos/analyze-incident.dto';

@Controller('ai')
export class AiAnalyticsController {
  constructor(private readonly analyzeIncidentUseCase: AnalyzeIncidentUseCase) {}

  @Post('analyze-incident')
  async analyzeIncident(@Body() dto: AnalyzeIncidentDto) {
    return this.analyzeIncidentUseCase.execute(dto);
  }

  @Post('seed-demo')
  async seedDemo() {
    return this.analyzeIncidentUseCase.execute({
      trackingNumber: 'TRK-357064',
      location: 'Av. Vitacura 9000, Vitacura',
      description: 'Accidente de tránsito de terceros bloqueando 2 pistas principales.',
    });
  }
}
