import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorApplyDto } from './dto/vendor-apply.dto';
import { VendorUpdateDto } from './dto/vendor-update.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('vendor')
export class VendorsController {
  constructor(private vendors: VendorsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('apply')
  async apply(@CurrentUser() user: any, @Body() dto: VendorApplyDto) {
    return this.vendors.apply(user.sub, dto.name, dto.slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: any) {
    return this.vendors.getMyVendor(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@CurrentUser() user: any, @Body() dto: VendorUpdateDto) {
    return this.vendors.updateMyVendor(user.sub, dto);
  }
}
