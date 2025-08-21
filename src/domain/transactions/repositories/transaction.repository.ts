// src/domain/transactions/repositories/transaction.repository.ts
import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  findById(id: number): Promise<Transaction | null>;
  findByAccountId(accountId: number): Promise<Transaction[]>;
  findAll(): Promise<Transaction[]>;
} 