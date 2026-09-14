import { HealthController } from 'src/infrastructure/http/controllers/health.controller';

describe('HealthController (ai-analytics-service)', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('debe retornar status UP con estado de proveedores de IA', async () => {
    const originalGroq = process.env.GROQ_API_KEY;
    const originalTavily = process.env.TAVILY_API_KEY;

    process.env.GROQ_API_KEY = 'gsk_mocked_key_for_unit_tests';
    process.env.TAVILY_API_KEY = 'tvly_mocked_key_for_unit_tests';

    const response = await controller.checkHealth();

    expect(response.status).toBe('UP');
    expect(response.service).toBe('ai-analytics-service');
    expect(response.aiProviders.groqCloud).toBe('Configured');
    expect(response.aiProviders.tavilySearch).toBe('Configured');
    expect(response.uptimeSeconds).toBeGreaterThanOrEqual(0);

    process.env.GROQ_API_KEY = originalGroq;
    process.env.TAVILY_API_KEY = originalTavily;
  });

  it('debe indicar Mock Mode (Fallback) cuando las API keys no están configuradas', async () => {
    const originalGroq = process.env.GROQ_API_KEY;
    const originalTavily = process.env.TAVILY_API_KEY;

    delete process.env.GROQ_API_KEY;
    delete process.env.TAVILY_API_KEY;

    const response = await controller.checkHealth();

    expect(response.status).toBe('UP');
    expect(response.aiProviders.groqCloud).toBe('Mock Mode (Fallback)');
    expect(response.aiProviders.tavilySearch).toBe('Mock Mode (Fallback)');

    process.env.GROQ_API_KEY = originalGroq;
    process.env.TAVILY_API_KEY = originalTavily;
  });
});
