import { IncidentAnalysis } from '../../../../src/domain/entities/incident-analysis.entity';

describe('IncidentAnalysis Entity (Domain Rules)', () => {
  it('debe identificar un incidente como crítico si su severidad es CRITICAL o HIGH', () => {
    const lowAnalysis = new IncidentAnalysis(
      'id-1', 'TRK-1', 'Lluvia leve', 'Santiago', 'LOW', 'Tráfico normal', 'Continuar ruta', '', new Date(),
    );
    const criticalAnalysis = new IncidentAnalysis(
      'id-2', 'TRK-2', 'Accidente grave', 'Vitacura', 'CRITICAL', 'Vía bloqueada', 'Desviar por Costanera', '', new Date(),
    );

    expect(lowAnalysis.isCritical()).toBe(false);
    expect(criticalAnalysis.isCritical()).toBe(true);
  });
});
