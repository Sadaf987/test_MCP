// src/application/transactions/handlers/get-transaction.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetTransactionQuery } from '../queries/get-transaction.query';
import { ITransactionRepository } from 'src/domain/transactions/repositories/transaction.repository';

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler implements IQueryHandler<GetTransactionQuery> {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(query: GetTransactionQuery) {
    const transaction = await this.transactionRepository.findById(query.id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return {
      id: transaction.id,
      fromAccountId: transaction.fromAccountId,
      toAccountId: transaction.toAccountId,
      amount: transaction.amount,
      type: transaction.type.value,
      status: transaction.status.value,
      description: transaction.description,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    };
  }
} 