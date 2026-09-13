import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RecordLocationUseCase } from '../../../application/use-cases/record-location.use-case';
import { GetLocationHistoryUseCase } from '../../../application/use-cases/get-location-history.use-case';
import { RecordLocationDto } from '../../../application/dtos/record-location.dto';

@Controller('telemetry')
export class TelemetryController {
  constructor(
    private readonly recordLocationUseCase: RecordLocationUseCase,
    private readonly getLocationHistoryUseCase: GetLocationHistoryUseCase,
  ) {}

  @Post()
  async recordLocation(@Body() dto: RecordLocationDto) {
    return this.recordLocationUseCase.execute(dto);
  }

  @Get('tracking/:trackingNumber')
  async getHistory(@Param('trackingNumber') trackingNumber: string) {
    return this.getLocationHistoryUseCase.execute(trackingNumber);
  }

  @Post('seed/:trackingNumber')
  async seedRoute(@Param('trackingNumber') trackingNumber: string) {
    return this.getLocationHistoryUseCase.seedRouteTelemetry(trackingNumber);
  }
}
