import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    jwtService = {
      sign: jest.fn(),
      verify: jest.fn()
    } as unknown as jest.Mocked<JwtService>;

    authService = new AuthService(jwtService);
  });

  describe('generateTokens', () => {
    it('should sign access and refresh tokens with expected payloads', async () => {
      jwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await authService.generateTokens(1, 'john', 'john@example.com');

      expect(jwtService.sign).toHaveBeenNthCalledWith(
        1,
        { sub: 1, username: 'john', email: 'john@example.com' },
        { expiresIn: '2h' }
      );
      expect(jwtService.sign).toHaveBeenNthCalledWith(
        2,
        { sub: 1, type: 'refresh' },
        { expiresIn: '7d' }
      );
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 2 * 60 * 60
      });
    });
  });

  describe('validateToken', () => {
    it('should return token payload for a valid access token', async () => {
      jwtService.verify.mockReturnValue({
        sub: 2,
        username: 'doe',
        email: 'doe@example.com'
      } as any);

      const result = await authService.validateToken('token');

      expect(jwtService.verify).toHaveBeenCalledWith('token');
      expect(result).toEqual({
        userId: 2,
        username: 'doe',
        email: 'doe@example.com'
      });
    });

    it('should reject when a refresh token is used as an access token', async () => {
      jwtService.verify.mockReturnValue({
        sub: 3,
        username: 'foo',
        email: 'foo@example.com',
        type: 'refresh'
      } as any);

      await expect(authService.validateToken('token')).rejects.toThrow(
        'Cannot use refresh token as access token'
      );
    });

    it.each([
      ['TokenExpiredError', 'Token expired'],
      ['JsonWebTokenError', 'Invalid token'],
      ['NotBeforeError', 'Token not active yet']
    ])('should map %s to a user-friendly error', async (name, message) => {
      jwtService.verify.mockImplementation(() => {
        const error = new Error('boom');
        error.name = name;
        throw error;
      });

      await expect(authService.validateToken('token')).rejects.toThrow(message);
    });
  });

  describe('validateRefreshToken', () => {
    it('should return payload for a valid refresh token', async () => {
      jwtService.verify.mockReturnValue({ sub: 4, type: 'refresh' } as any);

      const result = await authService.validateRefreshToken('refresh');

      expect(jwtService.verify).toHaveBeenCalledWith('refresh');
      expect(result).toEqual({ userId: 4 });
    });

    it('should reject when refresh token payload type is invalid', async () => {
      jwtService.verify.mockReturnValue({ sub: 5 } as any);

      await expect(authService.validateRefreshToken('refresh')).rejects.toThrow(
        'Invalid refresh token'
      );
    });

    it.each([
      ['TokenExpiredError', 'Refresh token expired'],
      ['JsonWebTokenError', 'Invalid refresh token'],
      ['NotBeforeError', 'Refresh token not active yet']
    ])('should map %s errors when verifying refresh token', async (name, message) => {
      jwtService.verify.mockImplementation(() => {
        const error = new Error('boom');
        error.name = name;
        throw error;
      });

      await expect(authService.validateRefreshToken('refresh')).rejects.toThrow(message);
    });
  });
});
