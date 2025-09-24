// src/application/auth/handlers/generate-tokens.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GenerateTokensCommand } from '../commands/generate-tokens.command';
import { AuthResponseDTO } from '../dto/auth-response.dto';
import { IAuthService } from 'src/domain/auth/services/auth.service';

@CommandHandler(GenerateTokensCommand)
export class GenerateTokensHandler implements ICommandHandler<GenerateTokensCommand> {
  constructor(
    @Inject('IAuthService')
    private readonly authService: IAuthService
  ) {}

  async execute(command: GenerateTokensCommand): Promise<AuthResponseDTO> {
    const { userId, username, email } = command;

    const tokens = await this.authService.generateTokens(userId, username, email);

    return new AuthResponseDTO(
      tokens.accessToken,
      tokens.refreshToken,
      tokens.expiresIn,
      { id: userId, username, email }
    );
  }
} 