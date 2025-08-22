import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    private usersService: UsersService,
  ) {};

  async create(id: string, createCardDto: CreateCardDto) {
    const user = await this.usersService.findOneById(id);
    const card = await this.cardRepository.findOneBy({
      user: user!,
      code: createCardDto.code
    });

    if (card) {
      return this.update(user!.id, {
        code: createCardDto.code,
        quantity: card.quantity + 1
      })
    }

    return this.cardRepository.save({
      user: user!,
      ...createCardDto
    });
  }

  async findCollection(id: string) {
    const user = await this.usersService.findOneById(id);
  
    return this.cardRepository.findBy({ user: user! });
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    if (updateCardDto.quantity <= 0) {
      return this.remove(id, updateCardDto.code);
    }
    
    const user = await this.usersService.findOneById(id);
    const card = await this.cardRepository.findOneBy({ code: updateCardDto.code, user: user! })

    card!.quantity = updateCardDto.quantity;
    return this.cardRepository.save({...card});
  }

  async remove(id: string, code: string) {
    const user = await this.usersService.findOneById(id);
    
    return this.cardRepository.delete({ code, user: user! });
  }
}
