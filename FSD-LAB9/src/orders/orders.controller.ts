import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  placeOrder(@Body() body: Record<string, any>) {
    const order = this.ordersService.createOrder(body);
    return {
      success: true,
      message: 'Order confirmed successfully',
      data: order,
    };
  }

  @Get()
  getAllOrders() {
    return {
      success: true,
      data: this.ordersService.findAll(),
    };
  }

  @Get(':orderId')
  getOrderById(@Param('orderId') orderId: string) {
    return {
      success: true,
      data: this.ordersService.findOne(orderId),
    };
  }
}