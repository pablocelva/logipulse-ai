import { JwtAuthGuard } from 'src/infrastructure/http/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard (orders-service)', () => {
  let guard: JwtAuthGuard;
  let reflectorMock: Partial<Reflector>;

  beforeEach(() => {
    reflectorMock = {
      getAllAndOverride: jest.fn().mockReturnValue(null),
    };
    guard = new JwtAuthGuard(reflectorMock as Reflector);
  });

  const createMockContext = (headers: Record<string, string>): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ headers }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  it('debe permitir acceso cuando devBypass es true', () => {
    const context = createMockContext({ 'x-dev-bypass': 'true' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('debe lanzar UnauthorizedException cuando falta el header Authorization en producción', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const context = createMockContext({});
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);

    process.env.NODE_ENV = originalEnv;
  });

  it('debe permitir acceso con token Bearer válido en producción', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const context = createMockContext({ authorization: 'Bearer valid_jwt_token_sample_123' });
    expect(guard.canActivate(context)).toBe(true);

    process.env.NODE_ENV = originalEnv;
  });
});
