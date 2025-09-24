// src/domain/auth/services/auth.service.ts
export interface IAuthService {
  generateTokens(userId: number, username: string, email: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }>;
  
  validateToken(token: string): Promise<{
    userId: number;
    username: string;
    email: string;
  }>;
  
  validateRefreshToken(refreshToken: string): Promise<{
    userId: number;
  }>;
} 