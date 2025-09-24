import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { LoansController } from '../../interfaces/http/loans.controller';
import { LoanOrmEntity } from '../../infrastructure/persistence/typeorm/entities/loan.orm-entity';
import { LoanTypeOrmRepository } from '../../infrastructure/persistence/typeorm/repositories/loan.typeorm.repository';
import { ILoanRepository } from '../../domain/loans/repositories/loan.repository';
import { CreateLoanHandler } from './handlers/create-loan.handler';
import { UpdateLoanStatusHandler } from './handlers/update-loan-status.handler';
import { GetLoanHandler } from './handlers/get-loan.handler';
import { GetLoansByUserHandler } from './handlers/get-loans-by-user.handler';
import { AuthModule } from '../../infrastructure/auth/auth.module';

const CommandHandlers = [CreateLoanHandler, UpdateLoanStatusHandler];
const QueryHandlers = [GetLoanHandler, GetLoansByUserHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([LoanOrmEntity]), AuthModule],
  controllers: [LoansController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: 'ILoanRepository',
      useClass: LoanTypeOrmRepository,
    },
  ],
  exports: ['ILoanRepository'],
})
export class LoansModule {} 