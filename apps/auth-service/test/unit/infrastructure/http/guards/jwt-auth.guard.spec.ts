import { JwtAuthGuard } from 'src/infrastructure/http/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

describe('JwtAuthGuard (auth-service)', () => {
  let guard: JwtAuthGuard;
  let reflectorMock: Partial<Reflector>;
  const secret = 'logipulse_jwt_secret_key_2026';

  beforeEach(() => {
    reflectorMock = {
      getAllAndOverride: jest.fn().mockReturnValue(null),
    };
    guard = new JwtAuthGuard(reflectorMock as Reflector);
  });

  const createMockContext = (
    headers: Record<string, string>,
    cookies?: Record<string, string>,
  ): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ headers, cookies: cookies || {} }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  it('debe permitir acceso cuando devBypass es true sin token', () => {
    const context = createMockContext({ 'x-dev-bypass': 'true' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('debe lanzar UnauthorizedException cuando falta el token en producción', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const context = createMockContext({});
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);

    process.env.NODE_ENV = originalEnv;
  });

  it('debe permitir acceso con token Bearer JWT firmado válido en producción', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const validToken = jwt.sign({ sub: 'usr-1', email: 'admin@logipulse.ai', role: 'ADMIN' }, secret);

    const context = createMockContext({ authorization: `Bearer ${validToken}` });
    expect(guard.canActivate(context)).toBe(true);

    process.env.NODE_ENV = originalEnv;
  });
});
