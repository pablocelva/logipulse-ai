import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PASSWORD_HASHER_PORT } from './domain/ports/password-hasher.port';
import { BcryptHasherAdapter } from './infrastructure/adapters/bcrypt-hasher.adapter';
import { TOKEN_PROVIDER_PORT } from './domain/ports/token-provider.port';
import { JwtTokenAdapter } from './infrastructure/adapters/jwt-token.adapter';
import { USER_REPOSITORY_PORT } from './domain/ports/user-repository.port';
import { TypeOrmUserRepositoryAdapter } from './infrastructure/persistence/adapters/typeorm-user-repository.adapter';
import { UserOrmEntity } from './infrastructure/persistence/entities/user.orm-entity';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { AuthController } from './infrastructure/http/controllers/auth.controller';
import { HealthController } from './infrastructure/http/controllers/health.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5433', 10),
      username: process.env.POSTGRES_USER || 'logipulse_user',
      password: process.env.POSTGRES_PASSWORD || 'logipulse_secret',
      database: process.env.POSTGRES_AUTH_DB || 'logipulse_auth_db',
      entities: [UserOrmEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  controllers: [AuthController, HealthController],
  providers: [
    {
      provide: PASSWORD_HASHER_PORT,
      useClass: BcryptHasherAdapter,
    },
    {
      provide: TOKEN_PROVIDER_PORT,
      useClass: JwtTokenAdapter,
    },
    {
      provide: USER_REPOSITORY_PORT,
      useClass: TypeOrmUserRepositoryAdapter,
    },
    LoginUseCase,
  ],
})
export class AuthServiceModule {}
