import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserDomainEntity, UserRepositoryPort } from '../../../domain/ports/user-repository.port';
import { UserMapper } from '../mappers/user.mapper';
import { PASSWORD_HASHER_PORT, PasswordHasherPort } from '../../../domain/ports/password-hasher.port';

@Injectable()
export class TypeOrmUserRepositoryAdapter implements UserRepositoryPort, OnModuleInit {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async onModuleInit() {
    await this.seedDefaultUsers();
  }

  async findByEmail(email: string): Promise<UserDomainEntity | null> {
    const ormUser = await this.repository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!ormUser) return null;
    return UserMapper.toDomain(ormUser);
  }

  async save(user: UserDomainEntity): Promise<UserDomainEntity> {
    const ormUser = UserMapper.toOrm(user);
    const saved = await this.repository.save(ormUser);
    return UserMapper.toDomain(saved);
  }

  async seedDefaultUsers(): Promise<void> {
    const count = await this.repository.count();
    if (count === 0) {
      const defaultUsers = [
        {
          id: '11111111-1111-4111-a111-111111111111',
          email: 'admin@logipulse.ai',
          name: 'Administrador de Logística',
          role: 'ADMIN' as const,
          passwordPlain: 'admin123',
        },
        {
          id: '22222222-2222-4222-a222-222222222222',
          email: 'dispatcher@logipulse.ai',
          name: 'Despachador de Central',
          role: 'DISPATCHER' as const,
          passwordPlain: 'dispatcher123',
        },
        {
          id: '33333333-3333-4333-a333-333333333333',
          email: 'driver@logipulse.ai',
          name: 'Chofer de Ruta',
          role: 'DRIVER' as const,
          passwordPlain: 'driver123',
        },
      ];

      for (const u of defaultUsers) {
        const passwordHash = await this.passwordHasher.hash(u.passwordPlain);
        const entity = new UserOrmEntity();
        entity.id = u.id;
        entity.email = u.email;
        entity.name = u.name;
        entity.role = u.role;
        entity.passwordHash = passwordHash;
        await this.repository.save(entity);
      }
    }
  }
}
