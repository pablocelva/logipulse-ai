import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  async checkHealth() {
    const isDbConnected = this.dataSource.isInitialized;

    if (!isDbConnected) {
      throw new ServiceUnavailableException({
        status: 'DOWN',
        service: 'orders-service',
        database: 'PostgreSQL Disconnected',
        timestamp: new Date().toISOString(),
      });
    }

    const memoryUsage = process.memoryUsage();

    return {
      status: 'UP',
      service: 'orders-service',
      database: 'PostgreSQL Connected',
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      timestamp: new Date().toISOString(),
    };
  }
}
