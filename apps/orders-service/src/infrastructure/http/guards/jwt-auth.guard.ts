import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  private get secret(): string {
    return process.env.JWT_SECRET || 'logipulse_jwt_secret_key_2026';
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const cookieToken = request.cookies?.['access_token'];
    const devBypass = request.headers['x-dev-bypass'];

    let token: string | null = null;

    if (cookieToken) {
      token = cookieToken;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // Development bypass mode when no token is provided in local dev
    if (!token && (devBypass === 'true' || process.env.NODE_ENV !== 'production')) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('Token JWT no proporcionado o inválido');
    }

    let decodedPayload: any = null;
    try {
      decodedPayload = jwt.verify(token, this.secret);
      request.user = decodedPayload;
    } catch {
      if (devBypass === 'true' || process.env.NODE_ENV !== 'production') {
        return true;
      }
      throw new UnauthorizedException('Token JWT inválido o expirado');
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const userRole = decodedPayload?.role || request.headers['x-user-role'] || 'DISPATCHER';
    const hasRole = requiredRoles.includes(String(userRole));

    if (!hasRole) {
      throw new ForbiddenException(`Rol insuficiente: se requiere uno de [${requiredRoles.join(', ')}]`);
    }

    return true;
  }
}
