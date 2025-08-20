// src/application/users/handlers/create-user.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserCommand } from '../commands/create-user.command';
import { IUserRepository } from 'src/domain/users/repositories/user.repository';
import { User } from 'src/domain/users/entities/user.entity';
import { Username } from 'src/domain/users/value-objects/username.vo';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(command: CreateUserCommand) {
    const username = new Username(command.username);
    const now = new Date();
    const user = new User(0, username, command.email, now, now);

    await this.userRepository.save(user);

    return user;
  }
}
