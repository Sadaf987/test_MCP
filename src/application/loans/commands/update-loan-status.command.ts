export class UpdateLoanStatusCommand {
  constructor(
    public readonly loanId: number,
    public readonly status: string
  ) {}
} 