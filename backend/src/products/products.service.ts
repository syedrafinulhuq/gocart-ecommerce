import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { normalizePagination } from '../common/utils/pagination';
import { Role } from '../common/constants/roles.enum';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async publicList(query: { q?: string; minPrice?: number; maxPrice?: number; page?: number; limit?: number }) {
    const { skip, limit, page } = normalizePagination(query.page, query.limit);

    const where: any = { status: 'ACTIVE' };

    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    if (query.minPrice != null || query.maxPrice != null) {
      where.price = {};
      if (query.minPrice != null) where.price.gte = query.minPrice;
      if (query.maxPrice != null) where.price.lte = query.maxPrice;
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { vendor: true, images: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async publicGetById(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, status: 'ACTIVE' },
      include: { vendor: true, images: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async vendorCreate(user: { role: Role; vendorId?: string | null }, dto: any) {
    if (user.role !== Role.VENDOR || !user.vendorId) throw new ForbiddenException('Vendor access required');

    // vendor approval check
    const vendor = await this.prisma.vendor.findUnique({ where: { id: user.vendorId } });
    if (!vendor || vendor.status !== 'APPROVED') throw new ForbiddenException('Vendor not approved');

    return this.prisma.product.create({
      data: {
        vendorId: user.vendorId,
        title: dto.title,
        description: dto.description,
        sku: dto.sku,
        price: dto.price,
        currency: dto.currency ?? 'BDT',
        stock: dto.stock,
        status: 'DRAFT',
      },
    });
  }

  async vendorList(user: { role: Role; vendorId?: string | null }) {
    if (user.role !== Role.VENDOR || !user.vendorId) throw new ForbiddenException('Vendor access required');
    return this.prisma.product.findMany({
      where: { vendorId: user.vendorId },
      orderBy: { createdAt: 'desc' },
      include: { images: true },
    });
  }

  async vendorUpdate(user: { role: Role; vendorId?: string | null }, id: string, dto: any) {
    if (user.role !== Role.VENDOR || !user.vendorId) throw new ForbiddenException('Vendor access required');

    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.vendorId !== user.vendorId) throw new ForbiddenException('Not your product');

    return this.prisma.product.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        sku: dto.sku,
        price: dto.price,
        currency: dto.currency,
        stock: dto.stock,
        status: dto.status,
      },
    });
  }

  async vendorDelete(user: { role: Role; vendorId?: string | null }, id: string) {
    if (user.role !== Role.VENDOR || !user.vendorId) throw new ForbiddenException('Vendor access required');

    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.vendorId !== user.vendorId) throw new ForbiddenException('Not your product');

    await this.prisma.product.delete({ where: { id } });
    return { ok: true };
  }

  async adminSetStatus(id: string, status: 'ACTIVE' | 'BLOCKED') {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id },
      data: { status },
    });
  }
}
