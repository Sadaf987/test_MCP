// src/application/auth/commands/refresh-tokens.command.ts
export class RefreshTokensCommand {
  constructor(
    public readonly refreshToken: string
  ) {}
} 