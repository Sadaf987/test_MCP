// src/interfaces/http/protected.controller.ts
import { Controller, Get, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ValidateTokenQuery } from 'src/application/auth/queries/validate-token.query';
import { CurrentUser } from 'src/infrastructure/auth/decorators/current-user.decorator';

@Controller('protected')
export class ProtectedController {
  constructor(
    private readonly queryBus: QueryBus
  ) {}

  // Method 1: Using the CurrentUser decorator (requires middleware to be applied)
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return {
      message: 'This is a protected route',
      user: user
    };
  }

  // Method 2: Manual token validation
  @Get('manual-auth')
  async manualAuth(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No valid authorization header');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const user = await this.queryBus.execute(new ValidateTokenQuery(token));
    
    return {
      message: 'This is a manually authenticated route',
      user: user
    };
  }

  // Method 3: Protected route with user info
  @Post('secure-action')
  async secureAction(@CurrentUser() user: any, @Body() data: any) {
    return {
      message: 'Secure action performed successfully',
      userId: user.userId,
      action: data.action,
      timestamp: new Date().toISOString()
    };
  }
} 