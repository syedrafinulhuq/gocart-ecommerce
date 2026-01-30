import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

function accessCookieOptions() {
  const secure = (process.env.COOKIE_SECURE ?? 'false') === 'true';
  const domain = process.env.COOKIE_DOMAIN || undefined;

  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/', // access token used everywhere
    maxAge: 15 * 60 * 1000, // 15 minutes
    domain,
  };
}

function refreshCookieOptions() {
  const secure = (process.env.COOKIE_SECURE ?? 'false') === 'true';
  const domain = process.env.COOKIE_DOMAIN || undefined;

  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/api/auth/refresh',
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    domain,
  };
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  // ---------------- REGISTER ----------------
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password);
  }

  // ---------------- LOGIN ----------------
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.validateUser(dto.email, dto.password);

    const accessToken = await this.auth.issueAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
      vendorId: user.vendorId,
    });

    const refresh = await this.auth.issueAndStoreRefreshToken(user.id);

    // 🔐 HttpOnly cookies
    res.cookie('access_token', accessToken, accessCookieOptions());
    res.cookie('refresh_token', refresh.token, refreshCookieOptions());

    // ❗ NO tokens in response body
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        vendorId: user.vendorId,
      },
    };
  }

  // ---------------- REFRESH ----------------
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const user = req.refresh.user;
    const currentTokenHash = req.refresh.tokenHash as string;

    const next = await this.auth.rotateRefreshToken(
      user.id,
      currentTokenHash,
    );

    const accessToken = await this.auth.issueAccessToken({
      id: user.id,
      email: user.email,
      role: user.role as any,
      vendorId: user.vendorId,
    });

    res.cookie('access_token', accessToken, accessCookieOptions());
    res.cookie('refresh_token', next.token, refreshCookieOptions());

    return { success: true };
  }

  // ---------------- LOGOUT ----------------
  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const user = req.refresh.user;
    const tokenHash = req.refresh.tokenHash as string;

    await this.auth.logout(user.id, tokenHash);

    res.clearCookie('access_token', accessCookieOptions());
    res.clearCookie('refresh_token', refreshCookieOptions());

    return { success: true };
  }
}
