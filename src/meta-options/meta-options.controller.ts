import { Body, Controller, Post } from '@nestjs/common';
import { CreateMetaOptionDto } from './dtos/create-meta-option.dto';
import { MetaOptionsService } from './meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  @Post()
  public createMetaOption(@Body() body: CreateMetaOptionDto) {
    return this.metaOptionsService.create(body);
  }
}
