// src/domain/accounts/value-objects/account-number.vo.ts
export class AccountNumber {
  private static readonly BANK_CODE = '1234';
  private static readonly BRANCH_CODE = '5678';

  constructor(private readonly _value: string) {
    if (!_value || _value.trim().length === 0) {
      throw new Error('Account number cannot be empty');
    }
    if (!this.isValidFormat(_value)) {
      throw new Error('Invalid account number format');
    }
  }

  get value(): string {
    return this._value;
  }

  private isValidFormat(accountNumber: string): boolean {
    // Format: XXXX-XXXX-XXXX-XXXX
    const pattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    return pattern.test(accountNumber);
  }

  static generate(): AccountNumber {
    const accountTypeCode = '9012'; // Account type code
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const accountNumber = `${this.BANK_CODE}-${this.BRANCH_CODE}-${accountTypeCode}-${randomNum}`;
    return new AccountNumber(accountNumber);
  }
} 