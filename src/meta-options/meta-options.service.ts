import { Injectable } from '@nestjs/common';
import { CreateMetaOptionDto } from './dtos/create-meta-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from './meta-option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async create(data: CreateMetaOptionDto) {
    const metaOption = this.metaOptionsRepository.create(data);

    return await this.metaOptionsRepository.save(metaOption);
  }
}
