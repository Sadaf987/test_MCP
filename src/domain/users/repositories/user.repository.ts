// src/domain/users/repositories/user.repository.ts
import { User } from '../entities/user.entity';

export interface IUserRepository {
  save(user: User): Promise<User>;
  update(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
