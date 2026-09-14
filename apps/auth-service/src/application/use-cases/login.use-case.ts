import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { PASSWORD_HASHER_PORT, PasswordHasherPort } from '../../domain/ports/password-hasher.port';
import { TOKEN_PROVIDER_PORT, TokenProviderPort, TokenPayload } from '../../domain/ports/token-provider.port';
import { USER_REPOSITORY_PORT, UserRepositoryPort, UserDomainEntity } from '../../domain/ports/user-repository.port';

export interface LoginResult {
  accessToken: string;
  user: Omit<UserDomainEntity, 'passwordHash'>;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_PROVIDER_PORT)
    private readonly tokenProvider: TokenProviderPort,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciales de acceso inválidas');
    }

    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales de acceso inválidas');
    }

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = this.tokenProvider.sign(payload);

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      accessToken,
      user: userWithoutPassword,
    };
  }
}
