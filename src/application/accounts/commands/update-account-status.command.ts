// src/application/accounts/commands/update-account-status.command.ts
export class UpdateAccountStatusCommand {
    constructor(
        public readonly accountId: number,
        public readonly status: string,
        public readonly userId?: number
    ) {}
} 