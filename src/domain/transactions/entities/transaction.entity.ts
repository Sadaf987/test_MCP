// src/domain/transactions/entities/transaction.entity.ts
import { TransactionType } from '../value-objects/transaction-type.vo';
import { TransactionStatus } from '../value-objects/transaction-status.vo';

export class Transaction {
  constructor(
    public readonly id: number,
    public readonly fromAccountId: number | null,
    public readonly toAccountId: number | null,
    public readonly amount: number,
    public readonly type: TransactionType,
    public readonly status: TransactionStatus,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
} 