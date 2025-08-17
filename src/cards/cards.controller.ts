import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Request() req, @Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(req.user.uuid, createCardDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findCollection(@Request() req) {
    return this.cardsService.findCollection(req.user.uuid);
  }

  @Patch()
  @UseGuards(AuthGuard)
  update(@Request() req, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(req.user.uuid, updateCardDto);
  }

  @Delete(':code')
  @UseGuards(AuthGuard)
  remove(@Request() req, @Param('code') code: string) {
    return this.cardsService.remove(req.user.uuid, code);
  }
}
