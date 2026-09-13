import { SeverityLevel } from '../entities/incident-analysis.entity';

export const AI_MODEL_PORT = Symbol('AI_MODEL_PORT');

export interface AiModelResponse {
  severity: SeverityLevel;
  summary: string;
  suggestedAction: string;
}

export interface AiModelPort {
  analyze(prompt: string, context: string): Promise<AiModelResponse>;
}
