// src/application/users/commands/create-user.command.ts
export class CreateUserCommand {
    constructor(
      public readonly username: string,
      public readonly email: string,
      public readonly password: string,
      public readonly city: string,
      public readonly dateOfBirth: string
    ) {}
  }
  