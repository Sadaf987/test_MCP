// src/domain/transactions/value-objects/transaction-type.vo.ts
export class TransactionType {
  private static readonly VALID_TYPES = ['deposit', 'withdrawal', 'transfer'] as const;
  private readonly _value: typeof TransactionType.VALID_TYPES[number];

  constructor(value: string) {
    if (!TransactionType.VALID_TYPES.includes(value as any)) {
      throw new Error(`Invalid transaction type. Must be one of: ${TransactionType.VALID_TYPES.join(', ')}`);
    }
    this._value = value as typeof TransactionType.VALID_TYPES[number];
  }

  get value(): string {
    return this._value;
  }

  static get types() {
    return this.VALID_TYPES;
  }
} 