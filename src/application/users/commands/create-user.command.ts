// src/application/users/commands/create-user.command.ts
export class CreateUserCommand {
    constructor(
      public readonly username: string,
      public readonly email: string
    ) {}
  }
  