import { Controller, Post, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateLoanCommand } from '../../application/loans/commands/create-loan.command';
import { UpdateLoanStatusCommand } from '../../application/loans/commands/update-loan-status.command';
import { GetLoanQuery } from '../../application/loans/queries/get-loan.query';
import { GetLoansByUserQuery } from '../../application/loans/queries/get-loans-by-user.query';
import { CreateLoanDTO } from '../../application/loans/dto/create-loan.dto';
import { LoanResponseDTO } from '../../application/loans/dto/loan-response.dto';
import { AuthGuard } from '../../infrastructure/auth/guards/auth.guard';
import { CurrentUser } from '../../infrastructure/auth/decorators/current-user.decorator';

@Controller('loans')
export class LoansController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createLoanDto: CreateLoanDTO, @CurrentUser() user: any): Promise<LoanResponseDTO> {
    const loan = await this.commandBus.execute(
      new CreateLoanCommand(
        user.userId, // Get userId from authenticated user
        createLoanDto.amount,
        createLoanDto.interestRate,
        createLoanDto.termMonths
      )
    );

    return this.toResponseDTO(loan);
  }

  @Get()
  async findByUser(@Query('userId') userId: number): Promise<LoanResponseDTO[]> {
    const loans = await this.queryBus.execute(new GetLoansByUserQuery(userId));
    return loans.map(loan => this.toResponseDTO(loan));
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<LoanResponseDTO> {
    const loan = await this.queryBus.execute(new GetLoanQuery(id));
    if (!loan) {
      throw new Error('Loan not found');
    }
    return this.toResponseDTO(loan);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: string
  ): Promise<void> {
    await this.commandBus.execute(new UpdateLoanStatusCommand(id, status));
  }

  private toResponseDTO(loan: any): LoanResponseDTO {
    return {
      id: loan.id,
      userId: loan.userId,
      amount: loan.amount,
      interestRate: loan.interestRate,
      termMonths: loan.termMonths,
      status: loan.status,
      monthlyPayment: loan.calculateMonthlyPayment(),
      createdAt: loan.createdAt,
      updatedAt: loan.updatedAt
    };
  }
} 