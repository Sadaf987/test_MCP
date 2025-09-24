export class CreateLoanCommand {
  constructor(
    public readonly userId: number,
    public readonly amount: number,
    public readonly interestRate: number,
    public readonly termMonths: number
  ) {}
} 