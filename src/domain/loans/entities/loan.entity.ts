export class Loan {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly amount: number,
    public readonly interestRate: number,
    public readonly termMonths: number,
    public readonly status: string, // 'pending', 'approved', 'rejected', 'active'
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Simple domain methods
  canBeApproved(): boolean {
    return this.status === 'pending';
  }

  isActive(): boolean {
    return this.status === 'active';
  }

  calculateMonthlyPayment(): number {
    const monthlyRate = this.interestRate / 100 / 12;
    const numerator = this.amount * monthlyRate * Math.pow(1 + monthlyRate, this.termMonths);
    const denominator = Math.pow(1 + monthlyRate, this.termMonths) - 1;
    return numerator / denominator;
  }
} 