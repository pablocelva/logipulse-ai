export const USER_REPOSITORY_PORT = Symbol('USER_REPOSITORY_PORT');

export interface UserDomainEntity {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'DISPATCHER' | 'DRIVER';
  passwordHash: string;
  createdAt?: Date;
}

export interface UserRepositoryPort {
  findByEmail(email: string): Promise<UserDomainEntity | null>;
  save(user: UserDomainEntity): Promise<UserDomainEntity>;
  seedDefaultUsers(): Promise<void>;
}
