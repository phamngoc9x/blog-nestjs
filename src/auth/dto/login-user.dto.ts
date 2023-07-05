import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsEmail, IsString } from "class-validator"

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string
}