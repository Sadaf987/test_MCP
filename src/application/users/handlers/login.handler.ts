// src/application/users/handlers/login.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { LoginCommand } from '../commands/login.command';
import { IUserRepository } from 'src/domain/users/repositories/user.repository';
import { InvalidCredentialsException } from 'src/common/exceptions/user.exceptions';
import * as bcrypt from 'bcrypt';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(command: LoginCommand) {
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

    // Return user data (without password)
    return {
      id: user.id,
      username: user.username.value,
      email: user.email,
      city: user.city,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
} 