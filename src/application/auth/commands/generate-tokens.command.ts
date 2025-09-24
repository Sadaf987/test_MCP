// src/application/auth/commands/generate-tokens.command.ts
export class GenerateTokensCommand {
  constructor(
    public readonly userId: number,
    public readonly username: string,
    public readonly email: string
  ) {}
} 