import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserFields1234567890123 implements MigrationInterface {
    name = 'AddUserFields1234567890123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "passwordHash" VARCHAR(255) NOT NULL DEFAULT '',
            ADD COLUMN "city" VARCHAR(50) NOT NULL DEFAULT '',
            ADD COLUMN "dateOfBirth" DATE NOT NULL DEFAULT CURRENT_DATE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN "passwordHash",
            DROP COLUMN "city", 
            DROP COLUMN "dateOfBirth"
        `);
    }
} 