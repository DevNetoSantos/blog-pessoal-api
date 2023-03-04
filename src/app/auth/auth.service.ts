import { BadRequestException, Get, Injectable, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, private jwtService: JwtService) {}

  async login (userloginDto: UserLoginDto) {
    const user = await this.userRepository.createQueryBuilder('user')
    .addSelect('user.password')
    .where('user.email = :email', {email: userloginDto.email}).getOne();

    if(!user) {
      throw new UnauthorizedException('Bad credentials');
    } else {
      if(await this.verifyPassword(userloginDto.password, user.password)) {
        const token = await this.jwtService.signAsync ({
          email: user.email,
          id: user.id
        });
        delete user.password;
        return { token, user }
      } else {
        throw new UnauthorizedException('Bad credentials');
      }
    }
  }

  async verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async register (createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    
    const findByEmail = await this.userRepository.findOne({where: {email}});

    if(findByEmail) {
      throw new BadRequestException('is email already');
    } else {
      const user = new User()
      Object.assign(user, createUserDto);
      this.userRepository.create(user);
      await this.userRepository.save(user);
      delete user.password;
      return user;
    }
  }
}
