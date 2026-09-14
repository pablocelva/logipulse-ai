import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginUseCase, LoginResult } from '../../../application/use-cases/login.use-case';
import { LoginDto } from '../../../application/dtos/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response): Promise<LoginResult> {
    const result = await this.loginUseCase.execute(dto);

    // OWASP API2 & API8: Set HttpOnly, Secure, SameSite Cookie
    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response): Promise<{ message: string }> {
    response.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });
    response.clearCookie('access_token', { path: '/' });
    return { message: 'Sesión cerrada exitosamente' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request): Promise<{ user: any }> {
    const user = (req as any).user;
    if (!user) {
      throw new UnauthorizedException('No hay sesión activa');
    }
    return { user };
  }
}
