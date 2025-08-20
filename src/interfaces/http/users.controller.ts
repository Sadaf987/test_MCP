// src/interfaces/http/users.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/application/users/commands/create-user.command';
import { GetAllUsersQuery } from 'src/application/users/queries/get-all-users.query';
import { CreateUserDTO } from 'src/application/users/dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    const { username, email } = createUserDTO;
    return await this.commandBus.execute(new CreateUserCommand(username, email));
  }

  @Get()
  async getAll() {
    return await this.queryBus.execute(new GetAllUsersQuery());
  }
}
