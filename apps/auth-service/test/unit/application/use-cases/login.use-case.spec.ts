import { LoginUseCase } from 'src/application/use-cases/login.use-case';
import { PasswordHasherPort } from 'src/domain/ports/password-hasher.port';
import { TokenProviderPort } from 'src/domain/ports/token-provider.port';
import { UserRepositoryPort, UserDomainEntity } from 'src/domain/ports/user-repository.port';
import { UnauthorizedException } from '@nestjs/common';

describe('LoginUseCase (auth-service)', () => {
  let useCase: LoginUseCase;
  let userRepositoryMock: jest.Mocked<UserRepositoryPort>;
  let passwordHasherMock: jest.Mocked<PasswordHasherPort>;
  let tokenProviderMock: jest.Mocked<TokenProviderPort>;

  const mockAdminUser: UserDomainEntity = {
    id: '11111111-1111-4111-a111-111111111111',
    email: 'admin@logipulse.ai',
    name: 'Administrador de Logística',
    role: 'ADMIN',
    passwordHash: 'hashed_admin123',
  };

  beforeEach(() => {
    userRepositoryMock = {
      findByEmail: jest.fn().mockImplementation(async (email: string) => {
        if (email.toLowerCase() === 'admin@logipulse.ai') {
          return mockAdminUser;
        }
        return null;
      }),
      save: jest.fn(),
      seedDefaultUsers: jest.fn(),
    };

    passwordHasherMock = {
      hash: jest.fn().mockImplementation(async (pw: string) => `hashed_${pw}`),
      compare: jest.fn().mockImplementation(async (pw: string) => pw === 'admin123'),
    };

    tokenProviderMock = {
      sign: jest.fn().mockReturnValue('mocked_jwt_token_admin_123'),
      verify: jest.fn(),
    };

    useCase = new LoginUseCase(userRepositoryMock, passwordHasherMock, tokenProviderMock);
  });

  it('debe autenticar exitosamente a un usuario demo con credenciales válidas y retornar JWT', async () => {
    const result = await useCase.execute({
      email: 'admin@logipulse.ai',
      password: 'admin123',
    });

    expect(result).toBeDefined();
    expect(result.accessToken).toBe('mocked_jwt_token_admin_123');
    expect(result.user.email).toBe('admin@logipulse.ai');
    expect(result.user.role).toBe('ADMIN');
    expect(tokenProviderMock.sign).toHaveBeenCalledTimes(1);
  });

  it('debe lanzar UnauthorizedException cuando el usuario no existe en el repositorio', async () => {
    await expect(
      useCase.execute({
        email: 'inexistente@logipulse.ai',
        password: 'admin123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('debe lanzar UnauthorizedException cuando la contraseña es incorrecta', async () => {
    passwordHasherMock.compare.mockResolvedValueOnce(false);

    await expect(
      useCase.execute({
        email: 'admin@logipulse.ai',
        password: 'password_errada',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
