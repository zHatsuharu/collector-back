import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new HttpException('wrong email or password.', HttpStatus.BAD_REQUEST);
    }
    const isMatch = await bcrypt.compare(pass, user.password);

    if (isMatch) {
      const payload = { uuid: user.id, username: user.username, email };
      return {
        access_token: await this.jwtService.signAsync(payload),
        ...payload,
      };
    } else {
      throw new HttpException('wrong email or password.', HttpStatus.BAD_REQUEST)
    }
  }
}
