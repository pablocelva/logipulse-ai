import { UserDomainEntity } from '../../../domain/ports/user-repository.port';
import { UserOrmEntity } from '../entities/user.orm-entity';

export class UserMapper {
  static toDomain(ormEntity: UserOrmEntity): UserDomainEntity {
    return {
      id: ormEntity.id,
      email: ormEntity.email,
      name: ormEntity.name,
      role: ormEntity.role,
      passwordHash: ormEntity.passwordHash,
      createdAt: ormEntity.createdAt,
    };
  }

  static toOrm(domainEntity: UserDomainEntity): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.id = domainEntity.id;
    entity.email = domainEntity.email;
    entity.name = domainEntity.name;
    entity.role = domainEntity.role;
    entity.passwordHash = domainEntity.passwordHash;
    if (domainEntity.createdAt) {
      entity.createdAt = domainEntity.createdAt;
    }
    return entity;
  }
}
