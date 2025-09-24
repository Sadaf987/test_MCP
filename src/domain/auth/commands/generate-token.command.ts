export class GenerateTokensCommand {
    constructor(
      public readonly userId: number,
      public readonly username: string,
      public readonly email: string
    ) {}
  }