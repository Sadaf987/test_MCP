import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateLoanStatusCommand } from '../commands/update-loan-status.command';
import { ILoanRepository } from '../../../domain/loans/repositories/loan.repository';
import { Loan } from '../../../domain/loans/entities/loan.entity';

@CommandHandler(UpdateLoanStatusCommand)
export class UpdateLoanStatusHandler implements ICommandHandler<UpdateLoanStatusCommand> {
  constructor(
    @Inject('ILoanRepository')
    private readonly loanRepository: ILoanRepository
  ) {}

  async execute(command: UpdateLoanStatusCommand): Promise<void> {
    const loan = await this.loanRepository.findById(command.loanId);
    if (!loan) {
      throw new Error('Loan not found');
    }

    const updatedLoan = new Loan(
      loan.id,
      loan.userId,
      loan.amount,
      loan.interestRate,
      loan.termMonths,
      command.status,
      loan.createdAt,
      new Date()
    );

    await this.loanRepository.update(updatedLoan);
  }
} 