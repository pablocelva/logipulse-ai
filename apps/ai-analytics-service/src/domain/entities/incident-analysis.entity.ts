export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export class IncidentAnalysis {
  constructor(
    public readonly id: string,
    public readonly trackingNumber: string,
    public readonly rawDescription: string,
    public readonly location: string,
    public readonly severity: SeverityLevel,
    public readonly summary: string,
    public readonly suggestedAction: string,
    public readonly searchContext: string,
    public readonly createdAt: Date,
  ) {}

  public isCritical(): boolean {
    return this.severity === 'CRITICAL' || this.severity === 'HIGH';
  }
}
