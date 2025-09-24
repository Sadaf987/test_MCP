export class InterestResponseDTO {
  readonly principalAmount: number;
  readonly interestAmount: number;
  readonly totalAmount: number;
  readonly interestRate: number;
  readonly timePeriod: number;
  readonly interestType: string;
  readonly monthlyPayment?: number;
  readonly dailyInterest?: number;
}
