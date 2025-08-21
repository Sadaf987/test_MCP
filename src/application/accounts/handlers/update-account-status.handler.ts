// src/application/accounts/handlers/update-account-status.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateAccountStatusCommand } from '../commands/update-account-status.command';
import { IAccountRepository } from 'src/domain/accounts/repositories/account.repository';
import { AccountAggregate } from 'src/domain/accounts/aggregates/account.aggregate';

@CommandHandler(UpdateAccountStatusCommand)
export class UpdateAccountStatusHandler implements ICommandHandler<UpdateAccountStatusCommand> {
  constructor(
    @Inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(command: UpdateAccountStatusCommand) {
    const { accountId, status } = command;

    // Find the account
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    // Create aggregate for business logic
    const accountAggregate = new AccountAggregate(account);

    // Validate status transition
    const currentStatus = account.status.value;
    
    // Business rules for status transitions
    if (currentStatus === 'closed' && status !== 'closed') {
      throw new Error('Cannot reactivate a closed account');
    }

    if (status === 'closed' && account.balance !== 0) {
      throw new Error('Cannot close account with non-zero balance');
    }

    // Update account status
    const updatedAccount = accountAggregate.updateStatus(status);
    const savedAccount = await this.accountRepository.save(updatedAccount);

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