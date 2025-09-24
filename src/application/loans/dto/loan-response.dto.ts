export class LoanResponseDTO {
  readonly id: number;
  readonly userId: number;
  readonly amount: number;
  readonly interestRate: number;
  readonly termMonths: number;
  readonly status: string;
  readonly monthlyPayment: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
} 