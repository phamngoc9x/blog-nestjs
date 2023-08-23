import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto, RegisterUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) 
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService

  ){}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashPassword = await this.hashPassword(registerUserDto.password);
    return await this.userRepository.save({...registerUserDto, refresh_token: 'refresh_token_string', password: hashPassword});
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);
    return hash
  }

  private async generateToken(payload: { id : number, email: string}) {
      const access_token = await this.jwtService.signAsync(payload) 
      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('SECRET'),
        expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
      })

      await this.userRepository.update(
        { email: payload.email },
        { refresh_token : refresh_token }
      )

      return { access_token, refresh_token }
  }

  async refreshToken(refresh_token: string): Promise<any> {
    try {

      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('SECRET'),
      })
      const checkExistToken = await this.userRepository.findOneBy({ email: verify.email,  refresh_token: refresh_token })
      if(checkExistToken) {
        return this.generateToken({id: verify.id, email: verify.email}) 
      } else {
        throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST)
      }
      
    } catch (error) {
      throw new HttpException('Refresh token is invalid', HttpStatus.BAD_REQUEST)
      // console.log(error)
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email }
    })

    // for show loading icon
    await new Promise<any>(resolve => setTimeout(resolve, 2000))
    
    if (!user) {
      throw new HttpException("Email is not exist", HttpStatus.UNAUTHORIZED)
    }

    const checkPassword = bcrypt.compareSync(loginUserDto.password, user.password);

    if(!checkPassword) {
      throw new HttpException("Password is not correct", HttpStatus.UNAUTHORIZED)
    }

    // generate access token and refresh token

    const payload = {
      id: user.id,
      email: user.email
    }

    return this.generateToken(payload)
  }
}
