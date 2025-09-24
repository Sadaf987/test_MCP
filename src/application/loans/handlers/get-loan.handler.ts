import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetLoanQuery } from '../queries/get-loan.query';
import { ILoanRepository } from '../../../domain/loans/repositories/loan.repository';

@QueryHandler(GetLoanQuery)
export class GetLoanHandler implements IQueryHandler<GetLoanQuery> {
  constructor(
    @Inject('ILoanRepository')
    private readonly loanRepository: ILoanRepository
  ) {}

  async execute(query: GetLoanQuery) {
    return this.loanRepository.findById(query.id);
  }
} 