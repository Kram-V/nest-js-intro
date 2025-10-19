import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';
import { TagsService } from 'src/tags/tags.service';
import { PatchPostDto } from './dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,

    @InjectRepository(Post) private postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async findAll(userId: number) {
    const user = this.usersService.findOneById(userId);

    // if the eager: true is not set
    // const posts = await this.postsRepository.find({
    //   relations: { metaOption: true },
    // });

    const posts = await this.postsRepository.find({
      relations: {
        // user: true,
        // tags: true,
      },
    });

    return posts;
  }

  public async create(data: CreatePostDto) {
    const user = await this.usersService.findOneById(data.userId);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const tags = await this.tagsService.findMultipleTags(data.tags ?? []);

    const post = this.postsRepository.create({
      ...data,
      user,
      tags,
      metaOption: data.metaOption
        ? this.metaOptionsRepository.create(data.metaOption)
        : undefined,
    });

    return await this.postsRepository.save(post);
  }

  public async update(data: PatchPostDto, id: number) {
    const tags = await this.tagsService.findMultipleTags(data.tags ?? []);

    const post = await this.postsRepository.findOneBy({ id });

    if (!post) {
      return 'No Post';
    }

    post.title = data.title ?? post.title;
    post.postType = data.postType ?? post.postType;
    post.slug = data.slug ?? post.slug;
    post.status = data.status ?? post.status;
    post.content = data.content ?? post.content;
    post.schema = data.schema ?? post.schema;
    post.featuredImageUrl = data.featuredImageUrl ?? post.featuredImageUrl;
    post.tags = tags.length > 0 ? tags : post.tags;

    return await this.postsRepository.save(post);
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
