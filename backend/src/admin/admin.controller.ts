import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/constants/roles.enum';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('vendors')
  async vendors(@Query('status') status?: any) {
    return this.admin.listVendors(status);
  }

  @Patch('vendors/:id/approve')
  async approve(@Param('id') id: string) {
    return this.admin.approveVendor(id);
  }

  @Patch('vendors/:id/suspend')
  async suspend(@Param('id') id: string) {
    return this.admin.suspendVendor(id);
  }
}
