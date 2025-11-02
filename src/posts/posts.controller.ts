import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  public getPosts(@Query() postQuery: GetPostsDto) {
    return this.postsService.findAll(postQuery);
  }

  // @Post()
  // public createPost(@Body() body: CreatePostDto) {
  //   return this.postsService.create(body);
  // }

  @Post()
  public createPost(@Req() request: Request) {
    console.log(request[REQUEST_USER_KEY]);
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
