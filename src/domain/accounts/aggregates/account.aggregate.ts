// src/domain/accounts/aggregates/account.aggregate.ts
import { Account } from '../entities/account.entity';
import { AccountStatus } from '../value-objects/account-status.vo';

export class AccountAggregate {
  private readonly _account: Account;

  constructor(account: Account) {
    this._account = account;
  }

  get account(): Account {
    return this._account;
  }

  // Update account status
  updateStatus(newStatus: string): Account {
    const status = new AccountStatus(newStatus);
    return new Account(
      this._account.id,
      this._account.accountNumber,
      this._account.userId,
      this._account.type,
      this._account.balance,
      status,
      this._account.createdAt,
      new Date()
    );
  }

  // Freeze account
  freeze(): Account {
    return this.updateStatus('frozen');
  }

  // Activate account
  activate(): Account {
    return this.updateStatus('active');
  }

  // Close account (only if balance is 0)
  close(): Account {
    if (this._account.balance !== 0) {
      throw new Error('Cannot close account with non-zero balance');
    }
    return this.updateStatus('closed');
  }

  // Check if account is active
  isActive(): boolean {
    return this._account.status.value === 'active';
  }

  // Check if account is frozen
  isFrozen(): boolean {
    return this._account.status.value === 'frozen';
  }

  // Check if account is closed
  isClosed(): boolean {
    return this._account.status.value === 'closed';
  }
} 