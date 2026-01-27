import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../common/constants/roles.enum';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async apply(userId: string, name: string, slug: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.vendorId) throw new BadRequestException('User already linked to a vendor');

    const existsSlug = await this.prisma.vendor.findUnique({ where: { slug } });
    if (existsSlug) throw new BadRequestException('Vendor slug already exists');

    const vendor = await this.prisma.vendor.create({
      data: {
        name,
        slug,
        status: 'PENDING',
        ownerUserId: userId,
      },
    });

    // Link user to vendor; set role to VENDOR (but vendor remains PENDING until admin approves)
    await this.prisma.user.update({
      where: { id: userId },
      data: { vendorId: vendor.id, role: Role.VENDOR },
    });

    return vendor;
  }

  async getMyVendor(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.vendorId) throw new NotFoundException('No vendor linked');

    return this.prisma.vendor.findUnique({ where: { id: user.vendorId } });
  }

  async updateMyVendor(userId: string, data: { name?: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.vendorId) throw new NotFoundException('No vendor linked');

    return this.prisma.vendor.update({
      where: { id: user.vendorId },
      data,
    });
  }

  async ensureVendorApproved(vendorId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundException('Vendor not found');
    if (vendor.status !== 'APPROVED') throw new ForbiddenException('Vendor not approved');
    return vendor;
  }
}
