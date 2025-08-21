// src/interfaces/http/accounts.controller.ts
import { Controller, Post, Body, Get, Put, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountCommand } from 'src/application/accounts/commands/create-account.command';
import { UpdateAccountStatusCommand } from 'src/application/accounts/commands/update-account-status.command';
import { GetAccountQuery } from 'src/application/accounts/queries/get-account.query';
import { GetAccountsByUserQuery } from 'src/application/accounts/queries/get-accounts-by-user.query';
import { GetAllAccountsQuery } from 'src/application/accounts/queries/get-all-accounts.query';
import { CreateAccountDTO } from 'src/application/accounts/dto/create-account.dto';
import { UpdateAccountStatusDTO } from 'src/application/accounts/dto/update-account-status.dto';
import { createAccountJoi, updateAccountStatusJoi, validateRequest } from 'src/lib/util/joi.schemas';

@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  async create(@Body() createAccountDTO: CreateAccountDTO) {
    try {
      // Validate the request body
      const validatedData = validateRequest(createAccountJoi, createAccountDTO);
      const { user_id, type, initial_balance = 0 } = validatedData;
      return await this.commandBus.execute(new CreateAccountCommand(user_id, type, initial_balance));
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException({
          message: error.message,
          statusCode: 404,
          error: 'Not Found'
        }, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Get()
  async getAll() {
    return await this.queryBus.execute(new GetAllAccountsQuery());
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      const accountId = parseInt(id);
      if (isNaN(accountId)) {
        throw new HttpException({
          message: 'Invalid account ID. Must be a number.',
          statusCode: 400,
          error: 'Bad Request'
        }, HttpStatus.BAD_REQUEST);
      }
      return await this.queryBus.execute(new GetAccountQuery(accountId));
    } catch (error) {
      if (error.message === 'Account not found') {
        throw new HttpException({
          message: error.message,
          statusCode: 404,
          error: 'Not Found'
        }, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Get('user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    try {
      const userIdNum = parseInt(userId);
      if (isNaN(userIdNum)) {
        throw new HttpException({
          message: 'Invalid user ID. Must be a number.',
          statusCode: 400,
          error: 'Bad Request'
        }, HttpStatus.BAD_REQUEST);
      }
      return await this.queryBus.execute(new GetAccountsByUserQuery(userIdNum));
    } catch (error) {
      if (error.message === 'User not found') {
        throw new HttpException({
          message: error.message,
          statusCode: 404,
          error: 'Not Found'
        }, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Put(':id/status')
  async updateStatus(@Param('id') id: string, @Body() updateStatusDTO: UpdateAccountStatusDTO) {
    try {
      const accountId = parseInt(id);
      if (isNaN(accountId)) {
        throw new HttpException({
          message: 'Invalid account ID. Must be a number.',
          statusCode: 400,
          error: 'Bad Request'
        }, HttpStatus.BAD_REQUEST);
      }

      const validatedData = validateRequest(updateAccountStatusJoi, updateStatusDTO);
      return await this.commandBus.execute(new UpdateAccountStatusCommand(accountId, validatedData.status));
    } catch (error) {
      if (error.message === 'Account not found') {
        throw new HttpException({
          message: error.message,
          statusCode: 404,
          error: 'Not Found'
        }, HttpStatus.NOT_FOUND);
      }
      if (error.message.includes('Cannot')) {
        throw new HttpException({
          message: error.message,
          statusCode: 400,
          error: 'Bad Request'
        }, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }
} 