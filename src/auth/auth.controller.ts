import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() registerUserDto : RegisterUserDto):Promise<User> {
    console.log('register api request', registerUserDto)
    return this.authService.register(registerUserDto)
  }
}
