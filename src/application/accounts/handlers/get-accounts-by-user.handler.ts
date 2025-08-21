// src/application/accounts/handlers/get-accounts-by-user.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAccountsByUserQuery } from '../queries/get-accounts-by-user.query';
import { IAccountRepository } from 'src/domain/accounts/repositories/account.repository';
import { IUserRepository } from 'src/domain/users/repositories/user.repository';

@QueryHandler(GetAccountsByUserQuery)
export class GetAccountsByUserHandler implements IQueryHandler<GetAccountsByUserQuery> {
  constructor(
    @Inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(query: GetAccountsByUserQuery) {
    // Check if user exists
    const user = await this.userRepository.findById(query.userId);
    if (!user) {
      throw new Error('User not found');
    }

    const accounts = await this.accountRepository.findByUserId(query.userId);

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