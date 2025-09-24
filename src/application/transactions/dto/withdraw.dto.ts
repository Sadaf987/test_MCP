// src/application/transactions/dto/withdraw.dto.ts
export class WithdrawDTO {
  readonly account_id: number;
  readonly amount: number;
  readonly description?: string;
} 