import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './entities/user.entity';
import { CurrentUserGuard } from './guard/current-user-gaurd';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('login')
  async userLogin(@Body() userLoginDto: UserLoginDto, @Res() res: Response) {
    const { token, user } = await this.authService.login(userLoginDto);

    res.cookie('isAuthenticated', true, {maxAge: 2*60*60*1000}) //max age 2hrhs
    res.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: 2*60*60*1000
    });
    
    return res.send({success: true, user});
  }

  @Post('register')
  async userRegister(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('status')
  @UseGuards(CurrentUserGuard)
  authStatus(@CurrentUser() user: User) {
    return {status: !!user, user}
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
     res.clearCookie('Authentication');
     res.clearCookie('isAuthenticated');
    return res.status(200).send({success: true});
  }
}
