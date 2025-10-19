import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  public createTag(@Body() body: CreateTagDto) {
    return this.tagsService.create(body);
  }

  @Delete('/:id')
  public deleteTag(@Param('id', new ParseIntPipe()) id: number) {
    return this.tagsService.delete(id);
  }

  @Delete('/:id/soft-delete')
  public softDeleteTag(@Param('id', new ParseIntPipe()) id: number) {
    return this.tagsService.softDelete(id);
  }
}
