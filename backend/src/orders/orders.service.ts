import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../common/constants/roles.enum';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(customerId: string, dto: { items: { productId: string; qty: number }[]; shippingAddressJson?: any; notes?: string }) {
    // Fetch products and validate
    const productIds = dto.items.map(i => i.productId);

    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) throw new NotFoundException('Some products not found');

    // Build order items, check status & stock
    let total = 0;

    const itemsData = dto.items.map(input => {
      const p = products.find(pp => pp.id === input.productId)!;

      if (p.status !== 'ACTIVE') throw new BadRequestException(`Product not available: ${p.title}`);
      if (p.stock < input.qty) throw new BadRequestException(`Insufficient stock: ${p.title}`);

      const unitPrice = Number(p.price);
      total += unitPrice * input.qty;

      return {
        productId: p.id,
        vendorId: p.vendorId,
        qty: input.qty,
        unitPrice: p.price,
        currency: p.currency,
        itemStatus: 'PENDING',
      };
    });

    // Transaction: create order + decrement stock
    const result = await this.prisma.$transaction(async (tx) => {
      // decrement stock
      for (const input of dto.items) {
        const updated = await tx.product.updateMany({
          where: {
            id: input.productId,
            stock: { gte: input.qty },
            status: 'ACTIVE',
          },
          data: { stock: { decrement: input.qty } },
        });

        if (updated.count !== 1) {
          throw new BadRequestException('Stock changed, please retry');
        }
      }

      const order = await tx.order.create({
        data: {
          customerId,
          status: 'PENDING',
          currency: 'BDT',
          totalAmount: total,
          shippingAddressJson: dto.shippingAddressJson ?? undefined,
          notes: dto.notes ?? undefined,
          items: { create: itemsData },
        },
        include: { items: true },
      });

      return order;
    });

    return result;
  }

  async myOrders(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async getOrder(customerId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.customerId !== customerId) throw new ForbiddenException('Not your order');
    return order;
  }

  async vendorOrderItems(user: { role: Role; vendorId?: string | null }) {
    if (user.role !== Role.VENDOR || !user.vendorId) throw new ForbiddenException('Vendor access required');

    return this.prisma.orderItem.findMany({
      where: { vendorId: user.vendorId },
      orderBy: { createdAt: 'desc' },
      include: { order: true, product: true },
    });
  }
}
