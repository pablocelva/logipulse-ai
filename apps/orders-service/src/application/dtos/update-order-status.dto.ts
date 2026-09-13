import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../../domain/entities/order.entity';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(['IN_TRANSIT', 'DELIVERED', 'INCIDENT'])
  status: OrderStatus;
}