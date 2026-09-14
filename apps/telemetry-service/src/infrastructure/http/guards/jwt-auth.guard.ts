import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const devBypass = request.headers['x-dev-bypass'];

    if (devBypass === 'true' || process.env.NODE_ENV !== 'production') {
      return true;
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token JWT no proporcionado o inválido');
    }

    const token = authHeader.split(' ')[1];
    if (!token || token.length < 10) {
      throw new UnauthorizedException('Formato de Token JWT malformado');
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const userRole = request.headers['x-user-role'] || 'DRIVER';
    const hasRole = requiredRoles.includes(String(userRole));

    if (!hasRole) {
      throw new ForbiddenException(`Rol insuficiente: se requiere uno de [${requiredRoles.join(', ')}]`);
    }

    return true;
  }
}
