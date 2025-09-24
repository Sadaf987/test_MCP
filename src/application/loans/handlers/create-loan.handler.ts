import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateLoanCommand } from '../commands/create-loan.command';
import { ILoanRepository } from '../../../domain/loans/repositories/loan.repository';
import { Loan } from '../../../domain/loans/entities/loan.entity';

@CommandHandler(CreateLoanCommand)
export class CreateLoanHandler implements ICommandHandler<CreateLoanCommand> {
  constructor(
    @Inject('ILoanRepository')
    private readonly loanRepository: ILoanRepository
  ) {}

  async execute(command: CreateLoanCommand): Promise<Loan> {
    const loan = new Loan(
      0, // ID will be set by repository
      command.userId,
      command.amount,
      command.interestRate,
      command.termMonths,
      'pending',
      new Date(),
      new Date()
    );

    return this.loanRepository.save(loan);
  }
} 