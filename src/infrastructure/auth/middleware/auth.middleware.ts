// src/infrastructure/auth/middleware/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { QueryBus } from '@nestjs/cqrs';
import { ValidateTokenQuery } from 'src/application/auth/queries/validate-token.query';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly queryBus: QueryBus) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No valid authorization header');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const user = await this.queryBus.execute(new ValidateTokenQuery(token));
      req['user'] = user; // Attach user to request
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 