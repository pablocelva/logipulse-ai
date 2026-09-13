import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateOrderUseCase } from '../../../application/use-cases/create-order.use-case';
import { GetOrderByIdUseCase } from '../../../application/use-cases/get-order-by-id.use-case';
import { UpdateOrderStatusUseCase } from '../../../application/use-cases/update-order-status.use-case';
import { CreateOrderDto } from '../../../application/dtos/create-order.dto';
import { UpdateOrderStatusDto } from '../../../application/dtos/update-order-status.dto';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  @Post('seed')
  async seedOrders() {
    return this.createOrderUseCase.seed5Orders();
  }

  @Post()
  async createOrder(@Body() dto: CreateOrderDto) {
    return this.createOrderUseCase.execute(dto);
  }

  @Get()
  async getAllOrders() {
    return this.createOrderUseCase.getAllOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.getOrderByIdUseCase.execute(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.updateOrderStatusUseCase.execute(id, dto.status);
  }
}
