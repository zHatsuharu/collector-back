import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { UsersService } from 'src/users/users.service';

describe('CardsService', () => {
  let service: CardsService;
  let cardRepository: {
    findOneBy: jest.Mock,
    save: jest.Mock,
    findBy: jest.Mock,
    delete: jest.Mock,
  };
  let usersService: {
    findOneById: jest.Mock,
  };

  beforeEach(async () => {
    cardRepository = {
      findOneBy: jest.fn(),
      save: jest.fn(),
      findBy: jest.fn(),
      delete: jest.fn(),
    };
    usersService = {
      findOneById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        { provide: getRepositoryToken(Card), useValue: cardRepository },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
  });

  describe('create', () => {
    it('should increment card quantity if card exists', async () => {
      const user = { id: 'user-id' };
      const dto = { code: 'ABC123', quantity: 1 };
      const foundCard = { code: dto.code, quantity: 2 };
      usersService.findOneById.mockResolvedValue(user);
      cardRepository.findOneBy.mockResolvedValue(foundCard);
      const updatedCard = { code: dto.code, quantity: 3 };

      jest.spyOn(service, 'update').mockResolvedValue(updatedCard as any);

      const result = await service.create(user.id, dto as any);

      expect(usersService.findOneById).toHaveBeenCalledWith(user.id);
      expect(cardRepository.findOneBy).toHaveBeenCalledWith({ user, code: dto.code });
      expect(service.update).toHaveBeenCalledWith(user.id, {
        code: dto.code,
        quantity: foundCard.quantity + 1,
      });
      expect(result).toBe(updatedCard);
    });

    it('should save a new card if it does not exist', async () => {
      const user = { id: 'user-id' };
      const dto = { code: 'ABC123', quantity: 1 };
      usersService.findOneById.mockResolvedValue(user);
      cardRepository.findOneBy.mockResolvedValue(null);

      const savedCard = { id: 1, ...dto, user };
      cardRepository.save.mockResolvedValue(savedCard);

      const result = await service.create(user.id, dto as any);

      expect(usersService.findOneById).toHaveBeenCalledWith(user.id);
      expect(cardRepository.findOneBy).toHaveBeenCalledWith({ user, code: dto.code });
      expect(cardRepository.save).toHaveBeenCalledWith({ user, ...dto });
      expect(result).toEqual(savedCard);
    });
  });

  describe('findCollection', () => {
    it('should return user cards', async () => {
      const user = { id: 'user-id' };
      usersService.findOneById.mockResolvedValue(user);

      const cards = [{ code: 'A', user }, { code: 'B', user }];
      cardRepository.findBy.mockResolvedValue(cards);

      const result = await service.findCollection(user.id);

      expect(usersService.findOneById).toHaveBeenCalledWith(user.id);
      expect(cardRepository.findBy).toHaveBeenCalledWith({ user });
      expect(result).toEqual(cards);
    });
  });

  describe('update', () => {
    it('should call remove if quantity <= 0', async () => {
      const id = 'user-id';
      const dto = { code: 'ABC123', quantity: 0 };
      jest.spyOn(service, 'remove').mockResolvedValue('removed' as any);

      const result = await service.update(id, dto as any);

      expect(service.remove).toHaveBeenCalledWith(id, dto.code);
      expect(result).toBe('removed');
    });

    it('should update card quantity if quantity > 0', async () => {
      const user = { id: 'user-id' };
      const dto = { code: 'ABC123', quantity: 5 };
      usersService.findOneById.mockResolvedValue(user);

      const existingCard = { code: dto.code, user, quantity: 3 };
      cardRepository.findOneBy.mockResolvedValue(existingCard);

      const savedCard = { ...existingCard, quantity: dto.quantity };
      cardRepository.save.mockResolvedValue(savedCard);

      const result = await service.update(user.id, dto as any);

      expect(usersService.findOneById).toHaveBeenCalledWith(user.id);
      expect(cardRepository.findOneBy).toHaveBeenCalledWith({ code: dto.code, user });
      expect(cardRepository.save).toHaveBeenCalledWith({ ...existingCard, quantity: dto.quantity });
      expect(result).toEqual(savedCard);
    });
  });

  describe('remove', () => {
    it('should delete the card by code and user', async () => {
      const user = { id: 'user-id' };
      const code = 'ABC123';
      usersService.findOneById.mockResolvedValue(user);

      const deleteResult = { affected: 1 };
      cardRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove(user.id, code);

      expect(usersService.findOneById).toHaveBeenCalledWith(user.id);
      expect(cardRepository.delete).toHaveBeenCalledWith({ code, user });
      expect(result).toBe(deleteResult);
    });
  });
});