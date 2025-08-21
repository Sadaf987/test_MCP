import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAccountsTable1234567890125 implements MigrationInterface {
    name = 'CreateAccountsTable1234567890125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "accounts" (
                "id" SERIAL PRIMARY KEY,
                "accountNumber" VARCHAR(20) UNIQUE NOT NULL,
                "userId" INTEGER NOT NULL,
                "type" VARCHAR(10) NOT NULL,
                "balance" DECIMAL(15,2) NOT NULL DEFAULT 0.00,
                "status" VARCHAR(10) NOT NULL DEFAULT 'active',
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT "FK_accounts_users" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "accounts"`);
    }
} 