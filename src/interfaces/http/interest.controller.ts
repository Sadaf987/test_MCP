import { Controller, Post, Body } from '@nestjs/common';
import { InterestService } from '../../application/interest/services/interest.service';
import { 
  CalculateInterestDTO, 
  CalculateLoanInterestDTO, 
  CalculateAccountInterestDTO 
} from '../../application/interest/dto/calculate-interest.dto';
import { InterestResponseDTO } from '../../application/interest/dto/interest-response.dto';

@Controller('interest')
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @Post('calculate')
  async calculateInterest(@Body() dto: CalculateInterestDTO): Promise<InterestResponseDTO> {
    const result = dto.interestType === 'simple'
      ? this.interestService.calculateSimpleInterest(dto)
      : this.interestService.calculateCompoundInterest(dto);

    return result;
  }

  @Post('calculate-loan')
  async calculateLoanInterest(@Body() dto: CalculateLoanInterestDTO): Promise<InterestResponseDTO> {
    const result = this.interestService.calculateLoanInterest(
      dto.principalAmount,
      dto.annualRate,
      dto.termMonths,
      dto.interestType || 'compound'
    );

    return result;
  }

  @Post('calculate-account')
  async calculateAccountInterest(@Body() dto: CalculateAccountInterestDTO): Promise<InterestResponseDTO> {
    const result = this.interestService.calculateAccountInterest(
      dto.principalAmount,
      dto.annualRate,
      dto.days,
      dto.interestType || 'compound'
    );

    return result;
  }
}
