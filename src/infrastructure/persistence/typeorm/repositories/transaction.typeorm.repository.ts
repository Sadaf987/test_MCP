// src/infrastructure/persistence/typeorm/repositories/transaction.typeorm.repository.ts
import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from 'src/domain/transactions/repositories/transaction.repository';
import { Transaction } from 'src/domain/transactions/entities/transaction.entity';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionType } from 'src/domain/transactions/value-objects/transaction-type.vo';
import { TransactionStatus } from 'src/domain/transactions/value-objects/transaction-status.vo';

@Injectable()
export class TransactionTypeOrmRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly transactionRepository: Repository<TransactionOrmEntity>
  ) {}

  async save(transaction: Transaction): Promise<Transaction> {
    const transactionEntity = new TransactionOrmEntity();
    if (transaction.id) {
      transactionEntity.id = transaction.id;
    }
    transactionEntity.fromAccountId = transaction.fromAccountId;
    transactionEntity.toAccountId = transaction.toAccountId;
    transactionEntity.amount = transaction.amount;
    transactionEntity.type = transaction.type.value;
    transactionEntity.status = transaction.status.value;
    transactionEntity.description = transaction.description;
    transactionEntity.createdAt = transaction.createdAt;
    transactionEntity.updatedAt = transaction.updatedAt;

    const savedEntity = await this.transactionRepository.save(transactionEntity);

    return new Transaction(
      savedEntity.id,
      savedEntity.fromAccountId,
      savedEntity.toAccountId,
      savedEntity.amount,
      new TransactionType(savedEntity.type),
      new TransactionStatus(savedEntity.status),
      savedEntity.description,
      savedEntity.createdAt,
      savedEntity.updatedAt
    );
  }

  private mapToDomain(entity: TransactionOrmEntity): Transaction {
    return new Transaction(
      entity.id,
      entity.fromAccountId,
      entity.toAccountId,
      entity.amount,
      new TransactionType(entity.type),
      new TransactionStatus(entity.status),
      entity.description,
      entity.createdAt,
      entity.updatedAt
    );
  }

  async findById(id: number): Promise<Transaction | null> {
    const transactionEntity = await this.transactionRepository.findOne({ where: { id } });
    if (!transactionEntity) {
      return null;
    }
    return this.mapToDomain(transactionEntity);
  }

  async findByAccountId(accountId: number): Promise<Transaction[]> {
    const transactionEntities = await this.transactionRepository.find({
      where: [
        { fromAccountId: accountId },
        { toAccountId: accountId }
      ],
      order: { createdAt: 'DESC' }
    });

    return transactionEntities.map(entity => this.mapToDomain(entity));
  }

  async findAll(): Promise<Transaction[]> {
    const transactionEntities = await this.transactionRepository.find({
      order: { createdAt: 'DESC' }
    });

    return transactionEntities.map(entity => this.mapToDomain(entity));
  }
} 