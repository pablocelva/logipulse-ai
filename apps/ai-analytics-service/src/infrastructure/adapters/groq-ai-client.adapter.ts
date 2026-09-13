import { Injectable, Logger } from '@nestjs/common';
import Groq from 'groq-sdk';
import { AiModelPort, AiModelResponse } from '../../domain/ports/ai-model.port';

@Injectable()
export class GroqAiClientAdapter implements AiModelPort {
  private readonly logger = new Logger(GroqAiClientAdapter.name);

  private getClient(): Groq | null {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey && apiKey !== 'gsk_tu_api_key_de_groq_aqui') {
      return new Groq({ apiKey });
    }
    return null;
  }

  async analyze(prompt: string, context: string): Promise<AiModelResponse> {
    const groq = this.getClient();
    if (!groq) {
      this.logger.warn('⚠️ GROQ_API_KEY no configurada o por defecto. Se usará respuesta simulada.');
      return {
        severity: 'HIGH',
        summary: 'Demora severa por congestión vial reportada en la ruta de despacho.',
        suggestedAction: 'Desviar vehículo por avenida alternativa paralela y notificar al cliente.',
      };
    }

    // Lista de modelos soportados por Groq Cloud en orden de preferencia
    const candidateModels = [
      process.env.GROQ_MODEL,
      'groq/compound-mini',
      'groq/compound',
      'openai/gpt-oss-120b',
    ].filter(Boolean) as string[];

    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        this.logger.log(`⚡ Intentando inferencia en Groq API con modelo: "${model}"...`);
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: `Eres un asistente de IA avanzado para gestión logística. Analiza el incidente y el contexto web del tráfico. 
              Responde EXCLUSIVAMENTE un objeto JSON válido con este esquema exacto:
              {
                "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
                "summary": "Resumen conciso del problema",
                "suggestedAction": "Recomendación operativa para el chofer o choferes"
              }`,
            },
            {
              role: 'user',
              content: `Prompt: ${prompt}\nContexto Web Real: ${context}`,
            },
          ],
          model: model,
          response_format: { type: 'json_object' },
        });

        const rawContent = completion.choices[0]?.message?.content || '{}';
        const parsed = JSON.parse(rawContent);

        this.logger.log(`✅ ¡Inferencia exitosa en Groq API usando "${model}"!`);
        return {
          severity: parsed.severity || 'MEDIUM',
          summary: parsed.summary || 'Incidente en procesamiento.',
          suggestedAction: parsed.suggestedAction || 'Evaluar ruta manualmente.',
        };
      } catch (error: any) {
        lastError = error;
        this.logger.warn(`Modelo "${model}" descontinuado o no disponible en tu cuenta (${error.message}). Intentando siguiente modelo...`);
      }
    }

    this.logger.error(`Error en inferencia Groq API (Todos los modelos fallaron): ${lastError?.message}`);
    return {
      severity: 'MEDIUM',
      summary: 'Incidente detectado en ruta (Fallback de contingencia por límite de API).',
      suggestedAction: 'Verificar ubicación con la central de tráfico.',
    };
  }
}
