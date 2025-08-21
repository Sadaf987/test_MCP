// src/application/transactions/commands/create-transaction.command.ts
export class CreateTransactionCommand {
    constructor(
        public readonly fromAccountId: number | null,
        public readonly toAccountId: number | null,
        public readonly amount: number,
        public readonly type: string,
        public readonly description: string
    ) {}
} 