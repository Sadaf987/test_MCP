// src/domain/accounts/entities/account.entity.ts
import { AccountNumber } from '../value-objects/account-number.vo';
import { AccountType } from '../value-objects/account-type.vo';
import { AccountStatus } from '../value-objects/account-status.vo';

export class Account {
  constructor(
    public readonly id: number,
    public readonly accountNumber: AccountNumber,
    public readonly userId: number,
    public readonly type: AccountType,
    public readonly balance: number,
    public readonly status: AccountStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
} 