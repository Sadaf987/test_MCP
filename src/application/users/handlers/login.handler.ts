// src/application/users/handlers/login.handler.ts
import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { LoginCommand } from '../commands/login.command';
import { IUserRepository } from 'src/domain/users/repositories/user.repository';
import { InvalidCredentialsException } from 'src/common/exceptions/user.exceptions';
import { GenerateTokensCommand } from 'src/application/auth/commands/generate-tokens.command';
import { AuthResponseDTO } from 'src/application/auth/dto/auth-response.dto';
import * as bcrypt from 'bcrypt';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly commandBus: CommandBus
  ) {}

  async execute(command: LoginCommand): Promise<AuthResponseDTO> {
    const { email, password } = command;

    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Generate tokens
    return await this.commandBus.execute(
      new GenerateTokensCommand(user.id, user.username.value, user.email)
    );
  }
} 