import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: {
    save: jest.Mock,
    findOneBy: jest.Mock,
    delete: jest.Mock,
  };

  beforeEach(async () => {
    usersRepository = {
      save: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: usersRepository }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should throw if passwords do not match', async () => {
      const dto = {
        email: 'john@mail.com',
        password: '1234',
        confirmPassword: '5678',
      };
      await expect(service.create(dto as any))
        .rejects
        .toThrowError(new HttpException("Passwords don't match.", HttpStatus.BAD_REQUEST));
    });

    it('should hash password and save user', async () => {
      const dto = {
        email: 'john@mail.com',
        password: '1234',
        confirmPassword: '1234',
      };
      const hashed = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashed);
      usersRepository.save.mockResolvedValue({ id: 1 });

      const result = await service.create({ ...dto } as any);

      expect(bcrypt.hash).toHaveBeenCalledWith('1234', expect.any(Number));
      expect(usersRepository.save).toHaveBeenCalledWith({
        ...dto,
        password: hashed,
      });
      expect(result).toEqual({ ok: true });
    });

    it('should return { ok: false } if save fails', async () => {
      const dto = {
        email: 'john@mail.com',
        password: '1234',
        confirmPassword: '1234',
      };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      usersRepository.save.mockResolvedValue(undefined);

      const result = await service.create({ ...dto } as any);

      expect(result).toEqual({ ok: false, message: 'User can not be created.' });
    });
  });

  describe('findOne', () => {
    it('should call findOneBy with email', async () => {
      const email = 'john@mail.com';
      const user = { id: 1, email };
      usersRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOne(email);

      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });
  });

  describe('findOneById', () => {
    it('should call findOneBy with id', async () => {
      const id = '1';
      const user = { id, email: 'john@mail.com' };
      usersRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOneById(id);

      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(user);
    });
  });

  describe('remove', () => {
    it('should call delete with id', async () => {
      const id = '1';
      const deleteResult = { affected: 1 };
      usersRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(id);

      expect(usersRepository.delete).toHaveBeenCalledWith({ id });
      expect(result).toEqual(deleteResult);
    });
  });
});