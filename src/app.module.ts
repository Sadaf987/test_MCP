// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './interfaces/http/users.controller';
import { AccountsController } from './interfaces/http/accounts.controller';
import { TransactionsController } from './interfaces/http/transactions.controller';
import { ProtectedController } from './interfaces/http/protected.controller';
import { BankingController } from './interfaces/http/banking.controller';
import { UserTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/user.typeorm.repository';
import { AccountTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/account.typeorm.repository';
import { TransactionTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/transaction.typeorm.repository';
import { UserOrmEntity } from './infrastructure/persistence/typeorm/entities/user.orm-entity';
import { AccountOrmEntity } from './infrastructure/persistence/typeorm/entities/account.orm-entity';
import { TransactionOrmEntity } from './infrastructure/persistence/typeorm/entities/transaction.orm-entity';
import { LoanOrmEntity } from './infrastructure/persistence/typeorm/entities/loan.orm-entity';
import { CreateUserHandler } from './application/users/handlers/create-user.handler';
import { LoginHandler } from './application/users/handlers/login.handler';
import { GetAllUsersHandler } from './application/users/handlers/get-all-users.handler';
import { CreateAccountHandler } from './application/accounts/handlers/create-account.handler';
import { UpdateAccountStatusHandler } from './application/accounts/handlers/update-account-status.handler';
import { GetAccountHandler } from './application/accounts/handlers/get-account.handler';
import { GetAccountsByUserHandler } from './application/accounts/handlers/get-accounts-by-user.handler';
import { GetAllAccountsHandler } from './application/accounts/handlers/get-all-accounts.handler';
import { CreateTransactionHandler } from './application/transactions/handlers/create-transaction.handler';
import { GetTransactionHandler } from './application/transactions/handlers/get-transaction.handler';
import { GetTransactionsByAccountHandler } from './application/transactions/handlers/get-transactions-by-account.handler';
import { GetAllTransactionsHandler } from './application/transactions/handlers/get-all-transactions.handler';
import { AuthModule } from './infrastructure/auth/auth.module';
import { LoansModule } from './application/loans/loans.module';
import { InterestModule } from './application/interest/interest.module';

@Module({
  imports: [
    CqrsModule,
    AuthModule,
    LoansModule,
    InterestModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'banking-app',
      entities: [UserOrmEntity, AccountOrmEntity, TransactionOrmEntity, LoanOrmEntity],
      synchronize: false, // Disabled to use migrations
    }),
    TypeOrmModule.forFeature([UserOrmEntity, AccountOrmEntity, TransactionOrmEntity, LoanOrmEntity])
  ],
  controllers: [UsersController, AccountsController, TransactionsController, ProtectedController, BankingController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserTypeOrmRepository,
    },
    {
      provide: 'IAccountRepository',
      useClass: AccountTypeOrmRepository,
    },
    {
      provide: 'ITransactionRepository',
      useClass: TransactionTypeOrmRepository,
    },
    CreateUserHandler,
    LoginHandler,
    GetAllUsersHandler,
    CreateAccountHandler,
    UpdateAccountStatusHandler,
    GetAccountHandler,
    GetAccountsByUserHandler,
    GetAllAccountsHandler,
    CreateTransactionHandler,
    GetTransactionHandler,
    GetTransactionsByAccountHandler,
    GetAllTransactionsHandler
  ],
})
export class AppModule {}
