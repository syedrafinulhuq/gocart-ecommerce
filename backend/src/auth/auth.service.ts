import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/constants/roles.enum';
import crypto from 'crypto';

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function parseAccessTtl(ttl: string): string {
  // pass-through for jwtService (e.g. "15m", "1h")
  return ttl;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email already in use');

    const passwordHash = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: { email, passwordHash, role: Role.CUSTOMER },
      select: { id: true, email: true, role: true, vendorId: true },
    });

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async issueAccessToken(user: { id: string; email: string; role: Role; vendorId?: string | null }) {
    const payload = { sub: user.id, email: user.email, role: user.role, vendorId: user.vendorId ?? null };
    return this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: parseAccessTtl(process.env.ACCESS_TOKEN_TTL ?? '15m'),
    });
  }

  async issueAndStoreRefreshToken(userId: string) {
    const refreshDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? 14);
    const expiresAt = new Date(Date.now() + refreshDays * 24 * 60 * 60 * 1000);

    const token = await this.jwt.signAsync(
      { sub: userId },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: `${refreshDays}d`,
      },
    );

    const tokenHash = sha256(token);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return { token, tokenHash, expiresAt };
  }

  async rotateRefreshToken(userId: string, currentTokenHash: string) {
    // revoke current
    await this.prisma.refreshToken.updateMany({
      where: { userId, tokenHash: currentTokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    // issue new
    return this.issueAndStoreRefreshToken(userId);
  }

  async logout(userId: string, tokenHash?: string) {
    if (tokenHash) {
      await this.prisma.refreshToken.updateMany({
        where: { userId, tokenHash, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      return;
    }

    // revoke all sessions
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
