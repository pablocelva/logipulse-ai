import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  async checkHealth() {
    const memoryUsage = process.memoryUsage();

    return {
      status: 'UP',
      service: 'auth-service',
      jwtProvider: 'Active (RS256/HS256)',
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      timestamp: new Date().toISOString(),
    };
  }
}
