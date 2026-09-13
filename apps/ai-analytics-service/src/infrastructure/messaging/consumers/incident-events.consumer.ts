import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AnalyzeIncidentUseCase } from '../../../application/use-cases/analyze-incident.use-case';

@Controller()
export class IncidentEventsConsumer {
  constructor(private readonly analyzeIncidentUseCase: AnalyzeIncidentUseCase) {}

  @EventPattern('order.created')
  handleOrderCreated(@Payload() data: any) {
    console.log(`🤖 [AI Microservice] Orden detectada para monitoreo preventivo de IA:`, data.trackingNumber);
  }

  @EventPattern('order.status_updated')
  async handleStatusUpdated(@Payload() data: any) {
    if (data.status === 'INCIDENT') {
      console.log(`🚨 [AI Microservice] ¡INCIDENTE DETECTADO! Analizando en tiempo real con Groq & Tavily...`);
      const analysis = await this.analyzeIncidentUseCase.execute({
        trackingNumber: data.trackingNumber,
        location: 'Sector Central / Ruta de Despacho',
        description: 'Retraso de vehículo reportado por el chofer.',
      });
      console.log(`🤖 [Diagnóstico de IA Completo]:`, analysis);
    }
  }
}
