import { JwtAuthGuard } from 'src/infrastructure/http/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard (telemetry-service)', () => {
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

  it('debe permitir acceso en modo dev (devBypass)', () => {
    const context = createMockContext({ 'x-dev-bypass': 'true' });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('debe lanzar UnauthorizedException sin token en producción', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const context = createMockContext({});
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);

    process.env.NODE_ENV = originalEnv;
  });
});
