// src/interfaces/http/auth.controller.ts
import { Controller, Post, Body, Get, Headers, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RefreshTokenDTO } from 'src/application/auth/dto/refresh-token.dto';
import { ChangePasswordDTO } from 'src/application/auth/dto/change-password.dto';
import { RefreshTokensCommand } from 'src/application/auth/commands/refresh-tokens.command';
import { ChangePasswordCommand } from 'src/application/auth/commands/change-password.command';
import { ValidateTokenQuery } from 'src/application/auth/queries/validate-token.query';
import { CurrentUser } from 'src/infrastructure/auth/decorators/current-user.decorator';
import { AuthGuard } from 'src/infrastructure/auth/guards/auth.guard';
import { changePasswordJoi, validateRequest } from 'src/lib/util/joi.schemas';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post('refresh')
  async refresh(@Body() refreshTokenDTO: RefreshTokenDTO) {
    try {
      return await this.commandBus.execute(
        new RefreshTokensCommand(refreshTokenDTO.refreshToken)
      );
    } catch (error) {
      if (error.message === 'Refresh token expired') {
        throw new UnauthorizedException('Refresh token expired');
      } else if (error.message === 'Invalid refresh token') {
        throw new UnauthorizedException('Invalid refresh token');
      } else if (error.message === 'Refresh token not active yet') {
        throw new UnauthorizedException('Refresh token not active yet');
      }
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return user;
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDTO: ChangePasswordDTO,
    @CurrentUser() user: any
  ) {
    // Validate the request body
    const validatedData = validateRequest(changePasswordJoi, changePasswordDTO);
    const { currentPassword, newPassword } = validatedData;

    return await this.commandBus.execute(
      new ChangePasswordCommand(user.userId, currentPassword, newPassword)
    );
  }
}
