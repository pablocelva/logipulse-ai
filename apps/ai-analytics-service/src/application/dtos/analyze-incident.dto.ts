import { IsNotEmpty, IsString } from 'class-validator';

export class AnalyzeIncidentDto {
  @IsString()
  @IsNotEmpty()
  trackingNumber: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
