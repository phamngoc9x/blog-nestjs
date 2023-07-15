import { Body, Controller, Req, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreatePostDto } from './dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor( private postService: PostService){}
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail', { 
    storage: storageConfig('post'),
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
  create(@Req() req: any, @Body() createPostDto: CreatePostDto, @UploadedFile() file:Express.Multer.File) {
    if(req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if(!file) {
      throw new BadRequestException('File is required');
    }

    return this.postService.create(req['user_data'].id, {...createPostDto, thumbnail: file.destination + '/' + file.filename})
  }
}
