// src/interfaces/http/transactions.controller.ts
import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateTransactionCommand } from 'src/application/transactions/commands/create-transaction.command';
import { GetTransactionQuery } from 'src/application/transactions/queries/get-transaction.query';
import { GetTransactionsByAccountQuery } from 'src/application/transactions/queries/get-transactions-by-account.query';
import { GetAllTransactionsQuery } from 'src/application/transactions/queries/get-all-transactions.query';
import { CreateTransactionDTO } from 'src/application/transactions/dto/create-transaction.dto';
import { createTransactionJoi, validateRequest } from 'src/lib/util/joi.schemas';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post()
  async create(@Body() createTransactionDTO: CreateTransactionDTO) {
    try {
      const validatedData = validateRequest(createTransactionJoi, createTransactionDTO);
      const { from_account_id, to_account_id, amount, type, description } = validatedData;
      return await this.commandBus.execute(new CreateTransactionCommand(from_account_id, to_account_id, amount, type, description));
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('not active')) {
        throw new HttpException({message: error.message,statusCode: 404,error: 'Not Found'}, HttpStatus.NOT_FOUND);
      }
      if (error.message.includes('Insufficient balance') || error.message.includes('requires')) {
        throw new HttpException({message: error.message,statusCode: 400,error: 'Bad Request'}, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  @Get()
  async getAll() {
    return await this.queryBus.execute(new GetAllTransactionsQuery());
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      const transactionId = parseInt(id);
      if (isNaN(transactionId)) {
        throw new HttpException({
          message: 'Invalid transaction ID. Must be a number.',
          statusCode: 400,
          error: 'Bad Request'
        }, HttpStatus.BAD_REQUEST);
      }
      return await this.queryBus.execute(new GetTransactionQuery(transactionId));
    } catch (error) {
      if (error.message === 'Transaction not found') {
        throw new HttpException({
          message: error.message,
          statusCode: 404,
          error: 'Not Found'
        }, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Get('account/:accountId')
  async getByAccountId(@Param('accountId') accountId: string) {
    try {
      const accountIdNum = parseInt(accountId);
      if (isNaN(accountIdNum)) {
        throw new HttpException({
          message: 'Invalid account ID. Must be a number.',
          statusCode: 400,
          error: 'Bad Request'
        }, HttpStatus.BAD_REQUEST);
      }
      return await this.queryBus.execute(new GetTransactionsByAccountQuery(accountIdNum));
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
} 