// src/application/transactions/dto/deposit.dto.ts
export class DepositDTO {
  readonly account_id: number;
  readonly amount: number;
  readonly description?: string;
} 