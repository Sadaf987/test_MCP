// src/interfaces/http/users.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from 'src/application/users/commands/create-user.command';
import { LoginCommand } from 'src/application/users/commands/login.command';
import { GetAllUsersQuery } from 'src/application/users/queries/get-all-users.query';
import { CreateUserDTO } from 'src/application/users/dto/create-user.dto';
import { LoginDTO } from 'src/application/users/dto/login.dto';
import { createUserJoi, loginJoi, validateRequest } from 'src/lib/util/joi.schemas';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  async create(@Body() createUserDTO: CreateUserDTO) {
    // Validate the request body
    const validatedData = validateRequest(createUserJoi, createUserDTO);
    const { username, email, password, city, date_of_birth } = validatedData;
    return await this.commandBus.execute(new CreateUserCommand(username, email, password, city, date_of_birth));
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    // Validate the request body
    const validatedData = validateRequest(loginJoi, loginDTO);
    const { email, password } = validatedData;
    return await this.commandBus.execute(new LoginCommand(email, password));
  }

  @Get()
  async getAll() {
    return await this.queryBus.execute(new GetAllUsersQuery());
  }
}
