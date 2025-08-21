// src/infrastructure/persistence/typeorm/repositories/account.typeorm.repository.ts
import { Injectable } from '@nestjs/common';
import { IAccountRepository } from 'src/domain/accounts/repositories/account.repository';
import { Account } from 'src/domain/accounts/entities/account.entity';
import { AccountOrmEntity } from '../entities/account.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountNumber } from 'src/domain/accounts/value-objects/account-number.vo';
import { AccountType } from 'src/domain/accounts/value-objects/account-type.vo';
import { AccountStatus } from 'src/domain/accounts/value-objects/account-status.vo';

@Injectable()
export class AccountTypeOrmRepository implements IAccountRepository {
  constructor(
    @InjectRepository(AccountOrmEntity)
    private readonly accountRepository: Repository<AccountOrmEntity>
  ) {}

  async save(account: Account): Promise<Account> {
    const accountEntity = new AccountOrmEntity();
    if (account.id) {
      accountEntity.id = account.id;
    }
    accountEntity.accountNumber = account.accountNumber.value;
    accountEntity.userId = account.userId;
    accountEntity.type = account.type.value;
    accountEntity.balance = account.balance;
    accountEntity.status = account.status.value;
    accountEntity.createdAt = account.createdAt;
    accountEntity.updatedAt = account.updatedAt;

    const savedEntity = await this.accountRepository.save(accountEntity);
    
    return new Account(
      savedEntity.id,
      new AccountNumber(savedEntity.accountNumber),
      savedEntity.userId,
      new AccountType(savedEntity.type),
      savedEntity.balance,
      new AccountStatus(savedEntity.status),
      savedEntity.createdAt,
      savedEntity.updatedAt
    );
  }

  private mapToDomain(entity: AccountOrmEntity): Account {
    return new Account(
      entity.id,
      new AccountNumber(entity.accountNumber),
      entity.userId,
      new AccountType(entity.type),
      entity.balance,
      new AccountStatus(entity.status),
      entity.createdAt,
      entity.updatedAt
    );
  }

  async findById(id: number): Promise<Account | null> {
    const accountEntity = await this.accountRepository.findOne({ where: { id } });
    if (!accountEntity) return null;
    return this.mapToDomain(accountEntity);
  }

  async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    const accountEntity = await this.accountRepository.findOne({ where: { accountNumber } });
    if (!accountEntity) return null;
    return this.mapToDomain(accountEntity);
  }

  async findByUserId(userId: number): Promise<Account[]> {
    const accountEntities = await this.accountRepository.find({ where: { userId } });
    return accountEntities.map(entity => this.mapToDomain(entity));
  }

  async findAll(): Promise<Account[]> {
    const accountEntities = await this.accountRepository.find();
    return accountEntities.map(entity => this.mapToDomain(entity));
  }
} 