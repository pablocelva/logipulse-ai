import { HealthController } from 'src/infrastructure/http/controllers/health.controller';

describe('HealthController (auth-service)', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('debe retornar status UP con información de salud de auth-service', async () => {
    const response = await controller.checkHealth();

    expect(response.status).toBe('UP');
    expect(response.service).toBe('auth-service');
    expect(response.jwtProvider).toContain('Active');
    expect(response.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });
});
