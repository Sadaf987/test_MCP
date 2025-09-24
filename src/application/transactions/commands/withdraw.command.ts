// src/application/transactions/commands/withdraw.command.ts
export class WithdrawCommand {
  constructor(
    public readonly accountId: number,
    public readonly amount: number,
    public readonly description: string,
    public readonly userId: number
  ) {}
} 