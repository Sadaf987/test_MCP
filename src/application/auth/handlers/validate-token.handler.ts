// src/application/auth/handlers/validate-token.handler.ts
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { ValidateTokenQuery } from '../queries/validate-token.query';
import { IAuthService } from 'src/domain/auth/services/auth.service';

@QueryHandler(ValidateTokenQuery)
export class ValidateTokenHandler implements IQueryHandler<ValidateTokenQuery> {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService
  ) {}

  async execute(query: ValidateTokenQuery) {
    const { token } = query;

    try {
      return await this.authService.validateToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 