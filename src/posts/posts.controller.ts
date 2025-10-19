import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/users/:userId')
  public getPosts(@Param('userId', new ParseIntPipe()) userId: number) {
    return this.postsService.findAll(userId);
  }

  @Post()
  public createPost(@Body() body: CreatePostDto) {
    return this.postsService.create(body);
  }

  @Patch('/:id')
  public updatePost(
    @Body() body: PatchPostDto,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.postsService.update(body, id);
  }

  @Delete('/:id')
  public deletePost(@Param('id', new ParseIntPipe()) id: number) {
    return this.postsService.delete(id);
  }
}
