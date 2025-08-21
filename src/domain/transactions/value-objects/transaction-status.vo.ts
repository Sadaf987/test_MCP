// src/domain/transactions/value-objects/transaction-status.vo.ts
export class TransactionStatus {
  private static readonly VALID_STATUSES = ['pending', 'completed', 'failed', 'cancelled'] as const;
  private readonly _value: typeof TransactionStatus.VALID_STATUSES[number];

  constructor(value: string) {
    if (!TransactionStatus.VALID_STATUSES.includes(value as any)) {
      throw new Error(`Invalid transaction status. Must be one of: ${TransactionStatus.VALID_STATUSES.join(', ')}`);
    }
    this._value = value as typeof TransactionStatus.VALID_STATUSES[number];
  }

  get value(): string {
    return this._value;
  }

  static get statuses() {
    return this.VALID_STATUSES;
  }

  static get PENDING() {
    return new TransactionStatus('pending');
  }

  static get COMPLETED() {
    return new TransactionStatus('completed');
  }

  static get FAILED() {
    return new TransactionStatus('failed');
  }

  static get CANCELLED() {
    return new TransactionStatus('cancelled');
  }
} 