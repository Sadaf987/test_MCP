// src/interfaces/http/banking.controller.ts
import { Controller, Post, Body, Headers, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ValidateTokenQuery } from 'src/application/auth/queries/validate-token.query';
import { CreateTransactionCommand } from 'src/application/transactions/commands/create-transaction.command';

// Helper function to handle authentication errors
function handleAuthError(error: any): never {
  if (error.message === 'Authentication required') {
    throw new UnauthorizedException('Authentication required');
  } else if (error.message === 'Token expired') {
    throw new UnauthorizedException('Token expired');
  } else if (error.message === 'Invalid token') {
    throw new UnauthorizedException('Invalid token');
  } else if (error.message === 'Token not active yet') {
    throw new UnauthorizedException('Token not active yet');
  }
  throw error;
}

@Controller('banking')
export class BankingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post('deposit')
  async deposit(@Body() depositData: { account_id: number; amount: number; description?: string }, @Headers('authorization') authHeader: string) {
    try {
      // Validate JWT token
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Authentication required');
      }
      const token = authHeader.substring(7);
      const user = await this.queryBus.execute(new ValidateTokenQuery(token));
      
      // Create deposit transaction
      return await this.commandBus.execute(new CreateTransactionCommand(
        null, // from_account_id (null for deposits)
        depositData.account_id,
        depositData.amount,
        'deposit',
        depositData.description || 'Deposit',
        user.userId
      ));
    } catch (error) {
      handleAuthError(error);
    }
  }

  @Post('withdraw')
  async withdraw(@Body() withdrawData: { account_id: number; amount: number; description?: string }, @Headers('authorization') authHeader: string) {
    try {
      // Validate JWT token
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Authentication required');
      }
      const token = authHeader.substring(7);
      const user = await this.queryBus.execute(new ValidateTokenQuery(token));
      
      // Create withdrawal transaction
      return await this.commandBus.execute(new CreateTransactionCommand(
        withdrawData.account_id, // from_account_id
        null, // to_account_id (null for withdrawals)
        withdrawData.amount,
        'withdrawal',
        withdrawData.description || 'Withdrawal',
        user.userId
      ));
    } catch (error) {
      handleAuthError(error);
    }
  }

  @Post('transfer')
  async transfer(@Body() transferData: { from_account_id: number; to_account_id: number; amount: number; description?: string }, @Headers('authorization') authHeader: string) {
    try {
      // Validate JWT token
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Authentication required');
      }
      const token = authHeader.substring(7);
      const user = await this.queryBus.execute(new ValidateTokenQuery(token));
      
      // Create transfer transaction
      return await this.commandBus.execute(new CreateTransactionCommand(
        transferData.from_account_id,
        transferData.to_account_id,
        transferData.amount,
        'transfer',
        transferData.description || 'Transfer',
        user.userId
      ));
    } catch (error) {
      handleAuthError(error);
    }
  }
} 