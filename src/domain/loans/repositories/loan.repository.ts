import { Loan } from '../entities/loan.entity';

export interface ILoanRepository {
  findById(id: number): Promise<Loan | null>;
  findByUserId(userId: number): Promise<Loan[]>;
  save(loan: Loan): Promise<Loan>;
  update(loan: Loan): Promise<Loan>;
  findAll(): Promise<Loan[]>;
} 