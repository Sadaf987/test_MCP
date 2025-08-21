// src/application/transactions/handlers/create-transaction.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateTransactionCommand } from '../commands/create-transaction.command';
import { ITransactionRepository } from 'src/domain/transactions/repositories/transaction.repository';
import { IAccountRepository } from 'src/domain/accounts/repositories/account.repository';
import { Transaction } from 'src/domain/transactions/entities/transaction.entity';
import { TransactionType } from 'src/domain/transactions/value-objects/transaction-type.vo';
import { TransactionStatus } from 'src/domain/transactions/value-objects/transaction-status.vo';
import { Account } from 'src/domain/accounts/entities/account.entity';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(command: CreateTransactionCommand) {
    const { fromAccountId, toAccountId, amount, type, description } = command;

    // Validate transaction type and account requirements
    if (type === 'transfer' && (!fromAccountId || !toAccountId)) {
      throw new Error('Transfer requires both from and to accounts');
    }

    if (type === 'deposit' && !toAccountId) {
      throw new Error('Deposit requires a destination account');
    }

    if (type === 'withdrawal' && !fromAccountId) {
      throw new Error('Withdrawal requires a source account');
    }

    // Fetch and validate accounts
    let fromAccount: Account | null = null;
    let toAccount: Account | null = null;

    if (fromAccountId) {
      fromAccount = await this.accountRepository.findById(fromAccountId);
      if (!fromAccount) {
        throw new Error('Source account not found');
      }
      if (fromAccount.status.value !== 'active') {
        throw new Error('Source account is not active');
      }
    }

    if (toAccountId) {
      toAccount = await this.accountRepository.findById(toAccountId);
      if (!toAccount) {
        throw new Error('Destination account not found');
      }
      if (toAccount.status.value !== 'active') {
        throw new Error('Destination account is not active');
      }
    }

    // Validate sufficient balance for withdrawals and transfers
    if ((type === 'withdrawal' || type === 'transfer') && fromAccount) {
      const currentBalance = parseFloat(fromAccount.balance.toString());
      if (currentBalance < amount) {
        throw new Error('Insufficient balance');
      }
    }

    // Create transaction
    const transactionType = new TransactionType(type);
    const transactionStatus = TransactionStatus.COMPLETED; // For simplicity, we'll make it completed immediately
    const now = new Date();

    const transaction = new Transaction(
      0,
      fromAccountId,
      toAccountId,
      amount,
      transactionType,
      transactionStatus,
      description,
      now,
      now
    );

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Update account balances
    if (type === 'deposit' && toAccount) {
      const currentBalance = parseFloat(toAccount.balance.toString());
      const newBalance = parseFloat((currentBalance + amount).toFixed(2));
      
      const updatedToAccount = new Account(
        toAccount.id,
        toAccount.accountNumber,
        toAccount.userId,
        toAccount.type,
        newBalance,
        toAccount.status,
        toAccount.createdAt,
        now
      );
      await this.accountRepository.save(updatedToAccount);
    }

    if (type === 'withdrawal' && fromAccount) {
      const currentBalance = parseFloat(fromAccount.balance.toString());
      const newBalance = parseFloat((currentBalance - amount).toFixed(2));
      
      const updatedFromAccount = new Account(
        fromAccount.id,
        fromAccount.accountNumber,
        fromAccount.userId,
        fromAccount.type,
        newBalance,
        fromAccount.status,
        fromAccount.createdAt,
        now
      );
      await this.accountRepository.save(updatedFromAccount);
    }

    if (type === 'transfer' && fromAccount && toAccount) {
      const currentFromBalance = parseFloat(fromAccount.balance.toString());
      const currentToBalance = parseFloat(toAccount.balance.toString());
      
      const newFromBalance = parseFloat((currentFromBalance - amount).toFixed(2));
      const newToBalance = parseFloat((currentToBalance + amount).toFixed(2));

      const updatedFromAccount = new Account(
        fromAccount.id,
        fromAccount.accountNumber,
        fromAccount.userId,
        fromAccount.type,
        newFromBalance,
        fromAccount.status,
        fromAccount.createdAt,
        now
      );

      const updatedToAccount = new Account(
        toAccount.id,
        toAccount.accountNumber,
        toAccount.userId,
        toAccount.type,
        newToBalance,
        toAccount.status,
        toAccount.createdAt,
        now
      );

      await this.accountRepository.save(updatedFromAccount);
      await this.accountRepository.save(updatedToAccount);
    }

    return {
      id: savedTransaction.id,
      fromAccountId: savedTransaction.fromAccountId,
      toAccountId: savedTransaction.toAccountId,
      amount: savedTransaction.amount,
      type: savedTransaction.type.value,
      status: savedTransaction.status.value,
      description: savedTransaction.description,
      createdAt: savedTransaction.createdAt,
      updatedAt: savedTransaction.updatedAt
    };
  }
} 