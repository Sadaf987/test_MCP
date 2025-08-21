// src/application/accounts/dto/create-account.dto.ts
export class CreateAccountDTO {
    readonly user_id: number;
    readonly type: string;
    readonly initial_balance?: number;
} 