import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { storageConfig } from '../../helpers/config'
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto, FilterUserDto, UpdateUserDto } from './dto/';
import { User } from './entities';
import { UserService } from './user.service';
import { extname } from 'path';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'items_per_page' })
  @ApiQuery({ name: 'search' })
  @Get()
  findAll(@Query() query: FilterUserDto): Promise<User[]> {
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

  @Post('upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar',{ 
    storage: storageConfig('avatar'),
    fileFilter: (req, file, cb) => {
      const ext = extname(file.originalname);
      const allowedExtArr = ['.jpg', '.png', '.jpeg']
      if(!allowedExtArr.includes(ext)) {
        req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`
        cb(null, false);
      } else {
        const fileSize = parseInt(req.headers['content-length'])
        if(fileSize > 1024 * 1024 * 5){
          req.fileValidationError = `File size is too large. Accepted file is less than 5MB`
          cb(null, false);
        } else {
          cb(null, true)
        }
      }
    }
  }))
  uploadAvatar(@Req() req: any, @UploadedFile() file: Express.Multer.File) {
    console.log('uploadAvatar', file)
    if(req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if(!file) {
      throw new BadRequestException('File is required');
    }
    this.userService.updateAvatar(req.user_data.id, file.destination + '/' + file.filename); 
  }
}

