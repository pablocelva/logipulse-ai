import { HealthController } from 'src/infrastructure/http/controllers/health.controller';
import { Connection } from 'mongoose';

describe('HealthController (telemetry-service)', () => {
  let controller: HealthController;
  let currentReadyState: number;

  beforeEach(() => {
    currentReadyState = 1;
    const mongooseConnectionMock = {
      get readyState() {
        return currentReadyState;
      },
    } as unknown as Connection;

    controller = new HealthController(mongooseConnectionMock);
  });

  it('debe retornar status UP cuando la base de datos MongoDB está conectada', async () => {
    const response = await controller.checkHealth();

    expect(response.status).toBe('UP');
    expect(response.service).toBe('telemetry-service');
    expect(response.database).toBe('MongoDB Connected');
    expect(response.websocketsGateway).toContain('Socket.io');
    expect(response.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('debe lanzar ServiceUnavailableException cuando MongoDB está desconectado', async () => {
    currentReadyState = 0;

    await expect(controller.checkHealth()).rejects.toThrow();
  });
});
