import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetLoansByUserQuery } from '../queries/get-loans-by-user.query';
import { ILoanRepository } from '../../../domain/loans/repositories/loan.repository';

@QueryHandler(GetLoansByUserQuery)
export class GetLoansByUserHandler implements IQueryHandler<GetLoansByUserQuery> {
  constructor(
    @Inject('ILoanRepository')
    private readonly loanRepository: ILoanRepository
  ) {}

  async execute(query: GetLoansByUserQuery) {
    return this.loanRepository.findByUserId(query.userId);
  }
} 