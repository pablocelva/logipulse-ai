import { AuthController } from 'src/infrastructure/http/controllers/auth.controller';
import { LoginUseCase } from 'src/application/use-cases/login.use-case';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController (auth-service)', () => {
  let controller: AuthController;
  let loginUseCaseMock: Partial<LoginUseCase>;
  let responseMock: Partial<Response>;

  beforeEach(() => {
    loginUseCaseMock = {
      execute: jest.fn().mockResolvedValue({
        accessToken: 'valid_jwt_access_token_123',
        user: {
          id: 'usr-admin-01',
          email: 'admin@logipulse.ai',
          name: 'Administrador de Logística',
          role: 'ADMIN',
        },
      }),
    };

    responseMock = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
    };

    controller = new AuthController(loginUseCaseMock as LoginUseCase);
  });

  it('debe autenticar y establecer la cookie HttpOnly en la respuesta', async () => {
    const result = await controller.login(
      { email: 'admin@logipulse.ai', password: 'admin123' },
      responseMock as Response,
    );

    expect(result.accessToken).toBe('valid_jwt_access_token_123');
    expect(responseMock.cookie).toHaveBeenCalledWith(
      'access_token',
      'valid_jwt_access_token_123',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      }),
    );
  });

  it('debe limpiar la cookie al cerrar sesión (logout)', async () => {
    const result = await controller.logout(responseMock as Response);

    expect(result.message).toContain('cerrada exitosamente');
    expect(responseMock.clearCookie).toHaveBeenCalledWith('access_token', { path: '/' });
  });

  it('debe retornar el perfil si el usuario está autenticado', async () => {
    const reqMock = { user: { id: '1', email: 'admin@logipulse.ai', role: 'ADMIN' } } as unknown as Request;
    const profile = await controller.getProfile(reqMock);
    expect(profile.user.email).toBe('admin@logipulse.ai');
  });

  it('debe lanzar UnauthorizedException si no hay usuario en la request', async () => {
    const reqMock = {} as unknown as Request;
    await expect(controller.getProfile(reqMock)).rejects.toThrow(UnauthorizedException);
  });
});
