// src/application/users/handlers/create-user.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserCommand } from '../commands/create-user.command';
import { IUserRepository } from 'src/domain/users/repositories/user.repository';
import { User } from 'src/domain/users/entities/user.entity';
import { Username } from 'src/domain/users/value-objects/username.vo';
import { EmailAlreadyExistsException, UsernameAlreadyExistsException } from 'src/common/exceptions/user.exceptions';
import * as bcrypt from 'bcrypt';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(command: CreateUserCommand) {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(command.email);
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    // Check if username already exists
    const existingUsername = await this.userRepository.findByUsername(command.username);
    if (existingUsername) {
      throw new UsernameAlreadyExistsException();
    }

    const username = new Username(command.username);
    const passwordHash = await bcrypt.hash(command.password, 10);
    const dateOfBirth = new Date(command.dateOfBirth);
    const now = new Date();
    
    const user = new User(
      0, 
      username, 
      command.email, 
      passwordHash,
      command.city,
      dateOfBirth,
      now, 
      now
    );

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      username: savedUser.username.value,
      email: savedUser.email,
      city: savedUser.city,
      dateOfBirth: savedUser.dateOfBirth,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt
    };
  }
}
