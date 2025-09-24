// src/infrastructure/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './services/auth.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthGuard } from './guards/auth.guard';
import { AuthController } from '../../interfaces/http/auth.controller';
import { UserOrmEntity } from '../persistence/typeorm/entities/user.orm-entity';
import { UserTypeOrmRepository } from '../persistence/typeorm/repositories/user.typeorm.repository';

import { GenerateTokensHandler } from 'src/application/auth/handlers/generate-tokens.handler';
import { RefreshTokensHandler } from 'src/application/auth/handlers/refresh-tokens.handler';
import { ValidateTokenHandler } from 'src/application/auth/handlers/validate-token.handler';
import { ChangePasswordHandler } from 'src/application/auth/handlers/change-password.handler';

const CommandHandlers = [
  GenerateTokensHandler,
  RefreshTokensHandler,
  ChangePasswordHandler
];

const QueryHandlers = [
  ValidateTokenHandler
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-super-secret-jwt-key-here',
        signOptions: { expiresIn: '2h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    AuthMiddleware,
    AuthGuard,
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IUserRepository',
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [
    JwtModule,
    'IAuthService',
    AuthGuard,
  ],
})
export class AuthModule {}
