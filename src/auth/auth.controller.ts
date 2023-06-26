import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { retry } from 'rxjs';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  register(@Body() registerUserDto : RegisterUserDto):Promise<User> {
    console.log('register api request', registerUserDto)
    return this.authService.register(registerUserDto)
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  login(@Body() loginUserDto:LoginUserDto):Promise<any> {
    console.log('login api request')
    console.log(loginUserDto)
    return this.authService.login(loginUserDto)
  }

  @Post('refresh-token')
  refeshToken(@Body() {refresh_token}):Promise<any>{
    console.log('refesh Token api', refresh_token);
    return this.authService.refreshToken(refresh_token)
    
  }
}
