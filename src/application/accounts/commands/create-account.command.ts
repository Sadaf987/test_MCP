// src/application/accounts/commands/create-account.command.ts
export class CreateAccountCommand {
    constructor(
        public readonly userId: number,
        public readonly type: string,
        public readonly initialBalance: number = 0
    ) {}
} 