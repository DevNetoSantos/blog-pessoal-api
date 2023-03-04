import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv'
import { JwtStrategy } from './strategy/jwt.strategy';

dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})

export class AuthModule {}
