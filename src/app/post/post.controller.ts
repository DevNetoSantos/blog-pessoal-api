import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, Req, Query, UseGuards, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorator/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ACGuard, UseRoles } from 'nest-access-control';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('api/post')
//@UseInterceptors(ClassSerializerInterceptor)

export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource:  'post',
    action:  'create',
    possession:  'any',
  })
  create(@Body() createPostDto: CreatePostDto, @CurrentUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @Get()
  findAll(@Query() query: any, @CurrentUser() user: User) {
    return this.postService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Get('/slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename(req, file, callback) {
        const name = file.originalname.split('.')[0]
        const fileExtension = file.originalname.split('.')[1];
        const newFileName = name.split(" ").join('_')+'_'+Date.now()+'.'+fileExtension;

        callback(null, newFileName);
      }
    }),
    fileFilter(req, file, callback) {
      if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(null, false)
      }
      callback(null, true)
    },
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if(!file) {
      throw new BadRequestException('file not is image')
    } else {
      const response = {
        filePath: `${process.env.BASE_URL}/post/pictures/${file.filename}`
      }
      return response;
    }
  }

  @Get('pictures/:filename')
  async getPicture(@Param('filename') filename: string, @Res() res: Response) {
    res.sendFile(filename, {root: './uploads'});
  }

  @Patch(':slug')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('slug') slug: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(slug, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
