import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { VendorScopeGuard } from '../common/guards/vendor-scope.guard';

@Controller()
export class ProductsController {
  constructor(private products: ProductsService) {}

  // Public
  @Get('products')
  async list(@Query() q: ProductQueryDto) {
    return this.products.publicList(q);
  }

  @Get('products/:id')
  async get(@Param('id') id: string) {
    return this.products.publicGetById(id);
  }

  // Vendor
  @UseGuards(JwtAuthGuard, RolesGuard, VendorScopeGuard)
  @Roles(Role.VENDOR)
  @Post('vendor/products')
  async vendorCreate(@CurrentUser() user: any, @Body() dto: ProductCreateDto) {
    return this.products.vendorCreate({ role: user.role, vendorId: user.vendorId }, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, VendorScopeGuard)
  @Roles(Role.VENDOR)
  @Get('vendor/products')
  async vendorList(@CurrentUser() user: any) {
    return this.products.vendorList({ role: user.role, vendorId: user.vendorId });
  }

  @UseGuards(JwtAuthGuard, RolesGuard, VendorScopeGuard)
  @Roles(Role.VENDOR)
  @Patch('vendor/products/:id')
  async vendorUpdate(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: ProductUpdateDto) {
    return this.products.vendorUpdate({ role: user.role, vendorId: user.vendorId }, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, VendorScopeGuard)
  @Roles(Role.VENDOR)
  @Delete('vendor/products/:id')
  async vendorDelete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.products.vendorDelete({ role: user.role, vendorId: user.vendorId }, id);
  }

  // Admin moderation
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/products/:id/activate')
  async adminActivate(@Param('id') id: string) {
    return this.products.adminSetStatus(id, 'ACTIVE');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/products/:id/block')
  async adminBlock(@Param('id') id: string) {
    return this.products.adminSetStatus(id, 'BLOCKED');
  }
}
