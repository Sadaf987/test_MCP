// src/application/auth/handlers/refresh-tokens.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { RefreshTokensCommand } from '../commands/refresh-tokens.command';
import { AuthResponseDTO } from '../dto/auth-response.dto';
import { IAuthService } from 'src/domain/auth/services/auth.service';
import { IUserRepository } from 'src/domain/users/repositories/user.repository';

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensHandler implements ICommandHandler<RefreshTokensCommand> {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository
  ) {}

  async execute(command: RefreshTokensCommand): Promise<AuthResponseDTO> {
    const { refreshToken } = command;

    try {
      // Validate refresh token and get user ID
      const refreshTokenInfo = await this.authService.validateRefreshToken(refreshToken);
      
      // Verify user still exists
      const user = await this.userRepository.findById(refreshTokenInfo.userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      const tokens = await this.authService.generateTokens(
        user.id,
        user.username.value,
        user.email
      );

      return new AuthResponseDTO(
        tokens.accessToken,
        tokens.refreshToken,
        tokens.expiresIn,
        { id: user.id, username: user.username.value, email: user.email }
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
} 