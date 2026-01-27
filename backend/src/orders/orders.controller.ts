import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { VendorScopeGuard } from '../common/guards/vendor-scope.guard';
import { OrderCreateDto } from './dto/order-create.dto';

@Controller()
export class OrdersController {
  constructor(private orders: OrdersService) {}

  // Customer
  @UseGuards(JwtAuthGuard)
  @Post('orders')
  async create(@CurrentUser() user: any, @Body() dto: OrderCreateDto) {
    return this.orders.createOrder(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders/me')
  async my(@CurrentUser() user: any) {
    return this.orders.myOrders(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders/:id')
  async get(@CurrentUser() user: any, @Param('id') id: string) {
    return this.orders.getOrder(user.sub, id);
  }

  // Vendor: see their order items
  @UseGuards(JwtAuthGuard, RolesGuard, VendorScopeGuard)
  @Roles(Role.VENDOR)
  @Get('vendor/orders/items')
  async vendorItems(@CurrentUser() user: any) {
    return this.orders.vendorOrderItems({ role: user.role, vendorId: user.vendorId });
  }
}
