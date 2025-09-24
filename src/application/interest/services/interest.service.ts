import { Injectable } from '@nestjs/common';

export interface InterestCalculationRequest {
  principalAmount: number;
  interestRate: number; // Annual rate as percentage
  timePeriod: number; // Time in years
  interestType: 'simple' | 'compound';
  compoundFrequency?: 'yearly' | 'monthly' | 'quarterly' | 'daily';
}

export interface InterestCalculationResult {
  principalAmount: number;
  interestAmount: number;
  totalAmount: number;
  interestRate: number;
  timePeriod: number;
  interestType: string;
  monthlyPayment?: number; // For loans
  dailyInterest?: number; // For accounts
}

@Injectable()
export class InterestService {
  
  /**
   * Calculate simple interest
   */
  calculateSimpleInterest(request: InterestCalculationRequest): InterestCalculationResult {
    const { principalAmount, interestRate, timePeriod } = request;
    
    const interestAmount = principalAmount * (interestRate / 100) * timePeriod;
    const totalAmount = principalAmount + interestAmount;
    
    return {
      principalAmount,
      interestAmount,
      totalAmount,
      interestRate,
      timePeriod,
      interestType: 'simple',
      monthlyPayment: this.calculateMonthlyPayment(totalAmount, timePeriod),
      dailyInterest: interestAmount / (timePeriod * 365)
    };
  }

  /**
   * Calculate compound interest
   */
  calculateCompoundInterest(request: InterestCalculationRequest): InterestCalculationResult {
    const { principalAmount, interestRate, timePeriod, compoundFrequency = 'yearly' } = request;
    
    const frequency = this.getCompoundFrequency(compoundFrequency);
    const interestAmount = principalAmount * Math.pow(
      1 + (interestRate / 100) / frequency,
      frequency * timePeriod
    ) - principalAmount;
    
    const totalAmount = principalAmount + interestAmount;
    
    return {
      principalAmount,
      interestAmount,
      totalAmount,
      interestRate,
      timePeriod,
      interestType: 'compound',
      monthlyPayment: this.calculateMonthlyPayment(totalAmount, timePeriod),
      dailyInterest: interestAmount / (timePeriod * 365)
    };
  }

  /**
   * Calculate interest for loans (with monthly payments)
   */
  calculateLoanInterest(
    principalAmount: number,
    annualRate: number,
    termMonths: number,
    interestType: 'simple' | 'compound' = 'compound'
  ): InterestCalculationResult {
    const timePeriod = termMonths / 12;
    
    const request: InterestCalculationRequest = {
      principalAmount,
      interestRate: annualRate,
      timePeriod,
      interestType,
      compoundFrequency: 'monthly'
    };

    const result = interestType === 'simple' 
      ? this.calculateSimpleInterest(request)
      : this.calculateCompoundInterest(request);

    // Calculate monthly payment using loan amortization formula
    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment = principalAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                          (Math.pow(1 + monthlyRate, termMonths) - 1);

    return {
      ...result,
      monthlyPayment,
      timePeriod: termMonths / 12
    };
  }

  /**
   * Calculate interest for savings accounts
   */
  calculateAccountInterest(
    principalAmount: number,
    annualRate: number,
    days: number,
    interestType: 'simple' | 'compound' = 'compound'
  ): InterestCalculationResult {
    const timePeriod = days / 365;
    
    const request: InterestCalculationRequest = {
      principalAmount,
      interestRate: annualRate,
      timePeriod,
      interestType,
      compoundFrequency: 'daily'
    };

    const result = interestType === 'simple' 
      ? this.calculateSimpleInterest(request)
      : this.calculateCompoundInterest(request);

    return {
      ...result,
      timePeriod: days / 365
    };
  }

  private getCompoundFrequency(frequency: string): number {
    switch (frequency) {
      case 'daily': return 365;
      case 'monthly': return 12;
      case 'quarterly': return 4;
      case 'yearly': return 1;
      default: return 1;
    }
  }

  private calculateMonthlyPayment(totalAmount: number, timePeriod: number): number {
    const months = timePeriod * 12;
    return months > 0 ? totalAmount / months : 0;
  }
}
