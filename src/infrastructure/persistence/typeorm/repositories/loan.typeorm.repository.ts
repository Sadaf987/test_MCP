import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILoanRepository } from '../../../../domain/loans/repositories/loan.repository';
import { Loan } from '../../../../domain/loans/entities/loan.entity';
import { LoanOrmEntity } from '../entities/loan.orm-entity';

@Injectable()
export class LoanTypeOrmRepository implements ILoanRepository {
  constructor(
    @InjectRepository(LoanOrmEntity)
    private readonly repository: Repository<LoanOrmEntity>
  ) {}

  async findById(id: number): Promise<Loan | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    if (!ormEntity) return null;
    return this.toDomain(ormEntity);
  }

  async findByUserId(userId: number): Promise<Loan[]> {
    const ormEntities = await this.repository.find({ where: { userId } });
    return ormEntities.map(entity => this.toDomain(entity));
  }

  async save(loan: Loan): Promise<Loan> {
    const ormEntity = this.toOrm(loan);
    const savedEntity = await this.repository.save(ormEntity);
    return this.toDomain(savedEntity);
  }

  async update(loan: Loan): Promise<Loan> {
    const ormEntity = this.toOrm(loan);
    const updatedEntity = await this.repository.save(ormEntity);
    return this.toDomain(updatedEntity);
  }

  async findAll(): Promise<Loan[]> {
    const ormEntities = await this.repository.find();
    return ormEntities.map(entity => this.toDomain(entity));
  }

  private toDomain(ormEntity: LoanOrmEntity): Loan {
    return new Loan(
      ormEntity.id,
      ormEntity.userId,
      ormEntity.amount,
      ormEntity.interestRate,
      ormEntity.termMonths,
      ormEntity.status,
      ormEntity.createdAt,
      ormEntity.updatedAt
    );
  }

  private toOrm(loan: Loan): LoanOrmEntity {
    const ormEntity = new LoanOrmEntity();
    ormEntity.id = loan.id;
    ormEntity.userId = loan.userId;
    ormEntity.amount = loan.amount;
    ormEntity.interestRate = loan.interestRate;
    ormEntity.termMonths = loan.termMonths;
    ormEntity.status = loan.status;
    ormEntity.createdAt = loan.createdAt;
    ormEntity.updatedAt = loan.updatedAt;
    return ormEntity;
  }
} 