import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.Authentication;
      }]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY
    })
  }

  async validate(payload: any, req: Request, email: string) {
    if(!payload) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne({where: {email}});

    if(!user) {
      throw new UnauthorizedException();
    }

    req.user = user;
    return await req.user;
  }
}