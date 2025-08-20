// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './interfaces/http/users.controller';
import { UserTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/user.typeorm.repository';
import { UserOrmEntity } from './infrastructure/persistence/typeorm/entities/user.orm-entity';
import { CreateUserHandler } from './application/users/handlers/create-user.handler';
import { GetAllUsersHandler } from './application/users/handlers/get-all-users.handler';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'banking-app',
      entities: [UserOrmEntity],
      synchronize: false, // Disabled to use migrations
    }),
    TypeOrmModule.forFeature([UserOrmEntity])
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserTypeOrmRepository,
    },
    CreateUserHandler,
    GetAllUsersHandler
  ],
})
export class AppModule {}
