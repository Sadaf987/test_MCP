// src/domain/accounts/repositories/account.repository.ts
import { Account } from '../entities/account.entity';

export interface IAccountRepository {
  save(account: Account): Promise<Account>;
  findById(id: number): Promise<Account | null>;
  findByAccountNumber(accountNumber: string): Promise<Account | null>;
  findByUserId(userId: number): Promise<Account[]>;
  findAll(): Promise<Account[]>;
} 