import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockExecutionContext = (headers: any = {}) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    jwtService = mockJwtService as unknown as JwtService;
    authGuard = new AuthGuard(jwtService);
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should throw UnauthorizedException if no token provided', async () => {
      const context = mockExecutionContext({});

      await expect(authGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const context = mockExecutionContext({
        authorization: 'Bearer invalidtoken',
      });

      mockJwtService.verifyAsync.mockRejectedValueOnce(new Error('invalid'));

      await expect(authGuard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return true if token is valid', async () => {
      const payload = { userId: 1, email: 'test@mail.com' };
      const context = mockExecutionContext({
        authorization: 'Bearer validtoken',
      });

      mockJwtService.verifyAsync.mockResolvedValueOnce(payload);

      const result = await authGuard.canActivate(context);

      expect(result).toBe(true);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('validtoken', {
        secret: process.env.JWT_SECRET,
      });
    });

    it('should return undefined from extractTokenFromHeader if no Bearer token', () => {
      const request = { headers: { authorization: 'Basic abcdef' } } as any;

      const token = authGuard['extractTokenFromHeader'](request);

      expect(token).toBeUndefined();
    });
  });
});
