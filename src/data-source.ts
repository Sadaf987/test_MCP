import { DataSource } from 'typeorm';
import { UserOrmEntity } from './infrastructure/persistence/typeorm/entities/user.orm-entity';
import { AccountOrmEntity } from './infrastructure/persistence/typeorm/entities/account.orm-entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'banking-app',
  entities: [UserOrmEntity, AccountOrmEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Disable synchronize for production
}); 