import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

function refreshCookieOptions() {
  const secure = (process.env.COOKIE_SECURE ?? 'false') === 'true';
  const domain = process.env.COOKIE_DOMAIN || undefined;

  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/api/auth/refresh',
    domain,
  };
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validateUser(dto.email, dto.password);

    const accessToken = await this.auth.issueAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
      vendorId: user.vendorId,
    });

    const refresh = await this.auth.issueAndStoreRefreshToken(user.id);
    res.cookie('refresh_token', refresh.token, refreshCookieOptions());

    return {
      accessToken,
      user: { id: user.id, email: user.email, role: user.role, vendorId: user.vendorId },
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const user = req.refresh.user;
    const currentTokenHash = req.refresh.tokenHash as string;

    const next = await this.auth.rotateRefreshToken(user.id, currentTokenHash);

    const accessToken = await this.auth.issueAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
      vendorId: user.vendorId,
    });

    res.cookie('refresh_token', next.token, refreshCookieOptions());
    return { accessToken };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const user = req.refresh.user;
    const tokenHash = req.refresh.tokenHash as string;

    await this.auth.logout(user.id, tokenHash);

    res.clearCookie('refresh_token', refreshCookieOptions());
    return { ok: true };
  }
}
