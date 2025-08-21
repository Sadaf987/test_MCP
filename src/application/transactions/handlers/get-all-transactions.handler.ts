// src/application/transactions/handlers/get-all-transactions.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllTransactionsQuery } from '../queries/get-all-transactions.query';
import { ITransactionRepository } from 'src/domain/transactions/repositories/transaction.repository';

@QueryHandler(GetAllTransactionsQuery)
export class GetAllTransactionsHandler implements IQueryHandler<GetAllTransactionsQuery> {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(query: GetAllTransactionsQuery) {
    const transactions = await this.transactionRepository.findAll();

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