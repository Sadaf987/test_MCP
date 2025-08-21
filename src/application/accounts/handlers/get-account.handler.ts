// src/application/accounts/handlers/get-account.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAccountQuery } from '../queries/get-account.query';
import { IAccountRepository } from 'src/domain/accounts/repositories/account.repository';

@QueryHandler(GetAccountQuery)
export class GetAccountHandler implements IQueryHandler<GetAccountQuery> {
  constructor(
    @Inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(query: GetAccountQuery) {
    const account = await this.accountRepository.findById(query.id);
    if (!account) {
      throw new Error('Account not found');
    }

    return {
      id: account.id,
      accountNumber: account.accountNumber.value,
      userId: account.userId,
      type: account.type.value,
      balance: account.balance,
      status: account.status.value,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt
    };
  }
} 