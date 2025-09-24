// src/application/transactions/commands/deposit.command.ts
export class DepositCommand {
  constructor(
    public readonly accountId: number,
    public readonly amount: number,
    public readonly description: string,
    public readonly userId: number
  ) {}
} 