import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findOne: jest.fn(),
      findOneById: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('create', () => {
    it('should call usersService.create with dto', async () => {
      const dto = { name: 'John', email: 'john@mail.com' };
      const result = { id: '1', ...dto };
      usersService.create?.mockResolvedValue(result);

      expect(await controller.create(dto as any)).toEqual(result);
      expect(usersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findOneByMail', () => {
    it('should call usersService.findOne with mail', async () => {
      const mail = 'john@mail.com';
      const result = { id: '1', mail };
      usersService.findOne?.mockResolvedValue(result);

      expect(await controller.findOneByMail(mail)).toEqual(result);
      expect(usersService.findOne).toHaveBeenCalledWith(mail);
    });
  });

  describe('findOneById', () => {
    it('should call usersService.findOneById with id', async () => {
      const id = '1';
      const result = { id, mail: 'john@mail.com' };
      usersService.findOneById?.mockResolvedValue(result);

      expect(await controller.findOneById(id)).toEqual(result);
      expect(usersService.findOneById).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('should call usersService.remove with user uuid', async () => {
      const user = { uuid: 'user-uuid' };
      const req = { user };
      const result = { success: true };
      usersService.remove?.mockResolvedValue(result);

      expect(await controller.remove(req)).toEqual(result);
      expect(usersService.remove).toHaveBeenCalledWith(user.uuid);
    });
  });
});