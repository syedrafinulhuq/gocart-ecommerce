import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Role } from '../constants/roles.enum';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VendorScopeGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as { id: string; role: Role; vendorId?: string | null };

    if (user.role === Role.ADMIN) return true;

    if (user.role !== Role.VENDOR || !user.vendorId) {
      throw new ForbiddenException('Vendor access required');
    }

    const vendor = await this.prisma.vendor.findUnique({ where: { id: user.vendorId } });
    if (!vendor || vendor.status !== 'APPROVED') {
      throw new ForbiddenException('Vendor not approved');
    }

    return true;
  }
}
