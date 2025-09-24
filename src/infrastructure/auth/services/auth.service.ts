// src/infrastructure/auth/services/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from 'src/domain/auth/services/auth.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(userId: number, username: string, email: string) {
    const payload = { sub: userId, username, email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });
    
    const refreshPayload = { sub: userId, type: 'refresh' };
    const refreshToken = this.jwtService.sign(refreshPayload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      expiresIn: 2 * 60 * 60 // 2 hours in seconds
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      
      // Check if it's a refresh token
      if (payload.type === 'refresh') {
        throw new Error('Cannot use refresh token as access token');
      }

      return {
        userId: payload.sub,
        username: payload.username,
        email: payload.email
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else if (error.name === 'NotBeforeError') {
        throw new Error('Token not active yet');
      } else {
        throw error;
      }
    }
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      
      if (payload.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      return {
        userId: payload.sub
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      } else if (error.name === 'NotBeforeError') {
        throw new Error('Refresh token not active yet');
      } else {
        throw error;
      }
    }
  }
} 