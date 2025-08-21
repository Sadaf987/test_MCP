// src/application/transactions/handlers/get-transactions-by-account.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTransactionsByAccountQuery } from '../queries/get-transactions-by-account.query';
import { ITransactionRepository } from 'src/domain/transactions/repositories/transaction.repository';
import { IAccountRepository } from 'src/domain/accounts/repositories/account.repository';

@QueryHandler(GetTransactionsByAccountQuery)
export class GetTransactionsByAccountHandler implements IQueryHandler<GetTransactionsByAccountQuery> {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(query: GetTransactionsByAccountQuery) {
    const account = await this.accountRepository.findById(query.accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    const transactions = await this.transactionRepository.findByAccountId(query.accountId);

    return transactions.map(transaction => ({
      id: transaction.id,
      fromAccountId: transaction.fromAccountId,
      toAccountId: transaction.toAccountId,
      amount: transaction.amount,
      type: transaction.type.value,
      status: transaction.status.value,
      description: transaction.description,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    }));
  }
} 