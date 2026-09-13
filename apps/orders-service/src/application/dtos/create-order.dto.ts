import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  merchantId: string;

  @IsString()
  @IsNotEmpty()
  originAddress: string;

  @IsString()
  @IsNotEmpty()
  destinationAddress: string;

  @IsNumber()
  @IsPositive()
  price: number;
}