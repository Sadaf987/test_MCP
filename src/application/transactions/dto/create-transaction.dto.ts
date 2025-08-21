// src/application/transactions/dto/create-transaction.dto.ts
export class CreateTransactionDTO {
    readonly from_account_id?: number;
    readonly to_account_id?: number;
    readonly amount: number;
    readonly type: string;
    readonly description: string;
} 