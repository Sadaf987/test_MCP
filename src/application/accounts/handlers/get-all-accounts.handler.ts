// src/application/accounts/handlers/get-all-accounts.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllAccountsQuery } from '../queries/get-all-accounts.query';
import { IAccountRepository } from 'src/domain/accounts/repositories/account.repository';

@QueryHandler(GetAllAccountsQuery)
export class GetAllAccountsHandler implements IQueryHandler<GetAllAccountsQuery> {
  constructor(
    @Inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(query: GetAllAccountsQuery) {
    const accounts = await this.accountRepository.findAll();

    return accounts.map(account => ({
      id: account.id,
      accountNumber: account.accountNumber.value,
      userId: account.userId,
      type: account.type.value,
      balance: account.balance,
      status: account.status.value,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt
    }));
  }
} 