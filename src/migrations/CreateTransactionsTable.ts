// src/migrations/CreateTransactionsTable.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionsTable1234567890126 implements MigrationInterface {
    name = 'CreateTransactionsTable1234567890126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" SERIAL PRIMARY KEY,
                "fromAccountId" INTEGER,
                "toAccountId" INTEGER,
                "amount" DECIMAL(15,2) NOT NULL,
                "type" VARCHAR(20) NOT NULL,
                "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
                "description" TEXT NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT "FK_transactions_from_account" FOREIGN KEY ("fromAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL,
                CONSTRAINT "FK_transactions_to_account" FOREIGN KEY ("toAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions"`);
    }
} 