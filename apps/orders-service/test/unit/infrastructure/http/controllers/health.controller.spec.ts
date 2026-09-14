import { HealthController } from 'src/infrastructure/http/controllers/health.controller';
import { DataSource } from 'typeorm';

describe('HealthController (orders-service)', () => {
  let controller: HealthController;
  let isDbInitialized: boolean;

  beforeEach(() => {
    isDbInitialized = true;
    const dataSourceMock = {
      get isInitialized() {
        return isDbInitialized;
      },
    } as unknown as DataSource;

    controller = new HealthController(dataSourceMock);
  });

  it('debe retornar status UP cuando la base de datos PostgreSQL está conectada', async () => {
    const response = await controller.checkHealth();

    expect(response.status).toBe('UP');
    expect(response.service).toBe('orders-service');
    expect(response.database).toBe('PostgreSQL Connected');
    expect(response.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('debe lanzar ServiceUnavailableException cuando la base de datos está desconectada', async () => {
    isDbInitialized = false;

    await expect(controller.checkHealth()).rejects.toThrow();
  });
});
