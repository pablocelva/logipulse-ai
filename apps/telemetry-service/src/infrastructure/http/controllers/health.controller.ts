import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection()
    private readonly mongooseConnection: Connection,
  ) {}

  @Get()
  async checkHealth() {
    // Connection state: 1 = connected
    const isMongoConnected = this.mongooseConnection.readyState === 1;

    if (!isMongoConnected) {
      throw new ServiceUnavailableException({
        status: 'DOWN',
        service: 'telemetry-service',
        database: 'MongoDB Disconnected',
        timestamp: new Date().toISOString(),
      });
    }

    const memoryUsage = process.memoryUsage();

    return {
      status: 'UP',
      service: 'telemetry-service',
      database: 'MongoDB Connected',
      websocketsGateway: 'Active (Socket.io)',
      uptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      timestamp: new Date().toISOString(),
    };
  }
}
