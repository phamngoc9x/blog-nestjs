import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from './dto/';
import { User } from './entities';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: FilterUserDto): Promise<User[]> {
    console.log(query)
    return this.userService.findAll(query);
  }


  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(Number(id));
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.userService.update(Number(id), updateUserDto)
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.userService.delete(Number(id))
  }
}

