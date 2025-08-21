// src/application/accounts/handlers/create-account.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateAccountCommand } from '../commands/create-account.command';
import { IAccountRepository } from 'src/domain/accounts/repositories/account.repository';
import { IUserRepository } from 'src/domain/users/repositories/user.repository';
import { Account } from 'src/domain/accounts/entities/account.entity';
import { AccountNumber } from 'src/domain/accounts/value-objects/account-number.vo';
import { AccountType } from 'src/domain/accounts/value-objects/account-type.vo';
import { AccountStatus } from 'src/domain/accounts/value-objects/account-status.vo';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler implements ICommandHandler<CreateAccountCommand> {
  constructor(
    @Inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(command: CreateAccountCommand) {
    const { userId, type, initialBalance } = command;

    // Check if user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate unique account number
    const accountNumber = AccountNumber.generate();
    
    // Create account type and status
    const accountType = new AccountType(type);
    const accountStatus = AccountStatus.ACTIVE;
    
    const now = new Date();
    
    const account = new Account(
      0,
      accountNumber,
      userId,
      accountType,
      initialBalance,
      accountStatus,
      now,
      now
    );

    const savedAccount = await this.accountRepository.save(account);

    return {
      id: savedAccount.id,
      accountNumber: savedAccount.accountNumber.value,
      userId: savedAccount.userId,
      type: savedAccount.type.value,
      balance: savedAccount.balance,
      status: savedAccount.status.value,
      createdAt: savedAccount.createdAt,
      updatedAt: savedAccount.updatedAt
    };
  }
} 