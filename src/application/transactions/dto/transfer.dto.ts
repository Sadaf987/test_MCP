// src/application/transactions/dto/transfer.dto.ts
export class TransferDTO {
  readonly from_account_id: number;
  readonly to_account_id: number;
  readonly amount: number;
  readonly description?: string;
} 