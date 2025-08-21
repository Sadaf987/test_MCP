// src/domain/accounts/value-objects/account-status.vo.ts
export class AccountStatus {
  private static readonly VALID_STATUSES = ['active', 'frozen', 'closed'] as const;
  private readonly _value: typeof AccountStatus.VALID_STATUSES[number];

  constructor(value: string) {
    if (!AccountStatus.VALID_STATUSES.includes(value as any)) {
      throw new Error(`Invalid account status. Must be one of: ${AccountStatus.VALID_STATUSES.join(', ')}`);
    }
    this._value = value as typeof AccountStatus.VALID_STATUSES[number];
  }

  get value(): string {
    return this._value;
  }

  static get statuses() {
    return this.VALID_STATUSES;
  }

  static get ACTIVE() {
    return new AccountStatus('active');
  }

  static get FROZEN() {
    return new AccountStatus('frozen');
  }

  static get CLOSED() {
    return new AccountStatus('closed');
  }
} 