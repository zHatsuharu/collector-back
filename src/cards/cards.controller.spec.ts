import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { AuthGuard } from 'src/auth/auth.guard';

describe('CardsController', () => {
  let controller: CardsController;
  let cardsService: {
    create: jest.Mock,
    findCollection: jest.Mock,
    update: jest.Mock,
    remove: jest.Mock,
  };

  beforeEach(async () => {
    cardsService = {
      create: jest.fn(),
      findCollection: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [{ provide: CardsService, useValue: cardsService }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<CardsController>(CardsController);
  });

  describe('create', () => {
    it('should call cardsService.create with user uuid and dto', async () => {
      const req = { user: { uuid: 'user-1' } };
      const dto = { code: 'CARD1', quantity: 1 };
      const result = { ok: true };
      cardsService.create.mockResolvedValue(result);

      expect(await controller.create(req, dto as any)).toBe(result);
      expect(cardsService.create).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('findCollection', () => {
    it('should call cardsService.findCollection with user uuid', async () => {
      const req = { user: { uuid: 'user-1' } };
      const collection = [{ code: 'A' }, { code: 'B' }];
      cardsService.findCollection.mockResolvedValue(collection);

      expect(await controller.findCollection(req)).toBe(collection);
      expect(cardsService.findCollection).toHaveBeenCalledWith('user-1');
    });
  });

  describe('update', () => {
    it('should call cardsService.update with user uuid and dto', async () => {
      const req = { user: { uuid: 'user-1' } };
      const dto = { code: 'CARD1', quantity: 2 };
      const updated = { code: 'CARD1', quantity: 2 };
      cardsService.update.mockResolvedValue(updated);

      expect(await controller.update(req, dto as any)).toBe(updated);
      expect(cardsService.update).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('remove', () => {
    it('should call cardsService.remove with user uuid and code', async () => {
      const req = { user: { uuid: 'user-1' } };
      const code = 'CARD1';
      const deleted = { affected: 1 };
      cardsService.remove.mockResolvedValue(deleted);

      expect(await controller.remove(req, code)).toBe(deleted);
      expect(cardsService.remove).toHaveBeenCalledWith('user-1', code);
    });
  });
});