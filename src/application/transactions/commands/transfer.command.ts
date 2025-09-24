// src/application/transactions/commands/transfer.command.ts
export class TransferCommand {
  constructor(
    public readonly fromAccountId: number,
    public readonly toAccountId: number,
    public readonly amount: number,
    public readonly description: string,
    public readonly userId: number
  ) {}
} 