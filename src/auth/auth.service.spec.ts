import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findOne: jest.Mock };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(async () => {
    usersService = {
      findOne: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should throw if user not found', async () => {
      usersService.findOne.mockResolvedValue(null);

      await expect(service.signIn('foo@mail.com', 'pass'))
        .rejects
        .toThrowError(new HttpException('wrong email or password.', HttpStatus.BAD_REQUEST));
    });

    it('should throw if password does not match', async () => {
      usersService.findOne.mockResolvedValue({
        id: 'uuid-1',
        username: 'foo',
        email: 'foo@mail.com',
        password: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn('foo@mail.com', 'pass'))
        .rejects
        .toThrowError(new HttpException('wrong email or password.', HttpStatus.BAD_REQUEST));
    });

    it('should return access_token and payload if credentials are correct', async () => {
      const user = {
        id: 'uuid-1',
        username: 'foo',
        email: 'foo@mail.com',
        password: 'hashed',
      };
      usersService.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('jwt-token');

      const result = await service.signIn('foo@mail.com', 'pass');
      expect(usersService.findOne).toHaveBeenCalledWith('foo@mail.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('pass', user.password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        uuid: user.id,
        username: user.username,
        email: user.email,
      });
      expect(result).toEqual({
        access_token: 'jwt-token',
        uuid: user.id,
        username: user.username,
        email: user.email,
      });
    });
  });
});