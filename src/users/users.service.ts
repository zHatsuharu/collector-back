import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

require('dotenv').config()

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password != createUserDto.confirmPassword) {
      throw new HttpException('Passwords don\'t match.', HttpStatus.BAD_REQUEST)
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, parseInt(process.env.SALT_ROUND ?? "10"));

    const newUser = await this.usersRepository.save(createUserDto);
    return !!newUser ? { ok: true } : { ok: false, message: 'User can not be created.' };
  }

  findOne(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  findOneById(id: string) {
    return this.usersRepository.findOneBy({ id });
  }

  remove(id: string) {
    return this.usersRepository.delete({ id });
  }
}
