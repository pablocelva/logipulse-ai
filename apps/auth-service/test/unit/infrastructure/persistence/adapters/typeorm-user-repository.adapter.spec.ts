import { TypeOrmUserRepositoryAdapter } from 'src/infrastructure/persistence/adapters/typeorm-user-repository.adapter';
import { UserOrmEntity } from 'src/infrastructure/persistence/entities/user.orm-entity';
import { Repository } from 'typeorm';
import { PasswordHasherPort } from 'src/domain/ports/password-hasher.port';

describe('TypeOrmUserRepositoryAdapter (auth-service)', () => {
  let adapter: TypeOrmUserRepositoryAdapter;
  let repositoryMock: Partial<Repository<UserOrmEntity>>;
  let passwordHasherMock: jest.Mocked<PasswordHasherPort>;

  beforeEach(() => {
    repositoryMock = {
      findOne: jest.fn().mockImplementation(async (options: any) => {
        if (options?.where?.email === 'admin@logipulse.ai') {
          const u = new UserOrmEntity();
          u.id = '1';
          u.email = 'admin@logipulse.ai';
          u.name = 'Admin';
          u.role = 'ADMIN';
          u.passwordHash = 'hash';
          return u;
        }
        return null;
      }),
      save: jest.fn().mockImplementation(async (entity) => entity),
      count: jest.fn().mockResolvedValue(0),
    };

    passwordHasherMock = {
      hash: jest.fn().mockResolvedValue('hashed_pass'),
      compare: jest.fn().mockResolvedValue(true),
    };

    adapter = new TypeOrmUserRepositoryAdapter(
      repositoryMock as Repository<UserOrmEntity>,
      passwordHasherMock,
    );
  });

  it('debe buscar usuario por email correctamente', async () => {
    const user = await adapter.findByEmail('admin@logipulse.ai');
    expect(user).toBeDefined();
    expect(user?.email).toBe('admin@logipulse.ai');
  });

  it('debe retornar null cuando el usuario no existe', async () => {
    const user = await adapter.findByEmail('inexistente@logipulse.ai');
    expect(user).toBeNull();
  });

  it('debe sembrar usuarios demo al iniciar el módulo si la tabla está vacía', async () => {
    await adapter.onModuleInit();
    expect(repositoryMock.count).toHaveBeenCalled();
    expect(repositoryMock.save).toHaveBeenCalledTimes(3);
  });
});
