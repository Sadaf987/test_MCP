export class CalculateInterestDTO {
  readonly principalAmount: number;
  readonly interestRate: number;
  readonly timePeriod: number;
  readonly interestType: 'simple' | 'compound';
  readonly compoundFrequency?: 'yearly' | 'monthly' | 'quarterly' | 'daily';
}

export class CalculateLoanInterestDTO {
  readonly principalAmount: number;
  readonly annualRate: number;
  readonly termMonths: number;
  readonly interestType?: 'simple' | 'compound';
}

export class CalculateAccountInterestDTO {
  readonly principalAmount: number;
  readonly annualRate: number;
  readonly days: number;
  readonly interestType?: 'simple' | 'compound';
}
