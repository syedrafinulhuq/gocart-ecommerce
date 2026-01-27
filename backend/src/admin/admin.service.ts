import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  listVendors(status?: 'PENDING' | 'APPROVED' | 'SUSPENDED') {
    return this.prisma.vendor.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { ownerUser: { select: { id: true, email: true } } },
    });
  }

  async approveVendor(id: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    return this.prisma.vendor.update({
      where: { id },
      data: { status: 'APPROVED' },
    });
  }

  async suspendVendor(id: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { id } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    return this.prisma.vendor.update({
      where: { id },
      data: { status: 'SUSPENDED' },
    });
  }
}
