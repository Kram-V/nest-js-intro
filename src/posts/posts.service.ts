import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/tags.service';
import { PatchPostDto } from './dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';
import { GetPostsDto } from './dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { PaginatedInterface } from 'src/common/pagination/interfaces/paginated.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider,

    @InjectRepository(Post) private postsRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async findAll(
    postQuery: GetPostsDto,
    userId: number,
  ): Promise<PaginatedInterface<Post>> {
    const user = this.usersService.findOneById(userId);

    // if the eager: true is not set
    // const posts = await this.postsRepository.find({
    //   relations: { metaOption: true },
    // });

    const posts = await this.paginationProvider.paginateQuery(
      postQuery,
      this.postsRepository,
    );

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
    let tags: Tag[] | null = null;

    try {
      tags = await this.tagsService.findMultipleTags(data.tags ?? []);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again later',
        {
          description: 'Error Connecting to Database',
        },
      );
    }

    if (!tags || tags.length !== data.tags?.length) {
      throw new BadRequestException(
        'Please check your tag Ids and ensure they are correct',
      );
    }

    let post: Post | null;

    try {
      post = await this.postsRepository.findOneBy({ id });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again later',
        {
          description: 'Error Connecting to Database',
        },
      );
    }

    if (!post) {
      throw new BadRequestException('No Post Found!');
    }

    post.title = data.title ?? post.title;
    post.postType = data.postType ?? post.postType;
    post.slug = data.slug ?? post.slug;
    post.status = data.status ?? post.status;
    post.content = data.content ?? post.content;
    post.schema = data.schema ?? post.schema;
    post.featuredImageUrl = data.featuredImageUrl ?? post.featuredImageUrl;
    post.tags = tags.length > 0 ? tags : post.tags;

    try {
      await this.postsRepository.save(post);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again later',
        {
          description: 'Error Connecting to Database',
        },
      );
    }

    return post;
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return { deleted: true, id };
  }
}
