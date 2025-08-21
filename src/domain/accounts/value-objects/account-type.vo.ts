// src/domain/accounts/value-objects/account-type.vo.ts
export class AccountType {
  private static readonly VALID_TYPES = ['savings', 'checking'] as const;
  private readonly _value: typeof AccountType.VALID_TYPES[number];

  constructor(value: string) {
    if (!AccountType.VALID_TYPES.includes(value as any)) {
      throw new Error(`Invalid account type. Must be one of: ${AccountType.VALID_TYPES.join(', ')}`);
    }
    this._value = value as typeof AccountType.VALID_TYPES[number];
  }

  get value(): string {
    return this._value;
  }

  static get types() {
    return this.VALID_TYPES;
  }
} 