import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  async checkHealth() {
    const groqKey = process.env.GROQ_API_KEY;
    const tavilyKey = process.env.TAVILY_API_KEY;

    const isGroqConfigured = !!(groqKey && groqKey !== 'gsk_tu_api_key_de_groq_aqui');
    const isTavilyConfigured = !!(tavilyKey && tavilyKey !== 'tvly-tu_api_key_de_tavily_aqui');

    const memoryUsage = process.memoryUsage();

    return {
      status: 'UP',
      service: 'ai-analytics-service',
      aiProviders: {
        groqCloud: isGroqConfigured ? 'Configured' : 'Mock Mode (Fallback)',
        tavilySearch: isTavilyConfigured ? 'Configured' : 'Mock Mode (Fallback)',
      },
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      timestamp: new Date().toISOString(),
    };
  }
}
