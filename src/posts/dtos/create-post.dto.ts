import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateMetaOptionDto } from 'src/meta-options/dtos/create-meta-option.dto';
import { PostType, Status } from 'src/posts/enums/posts.enum';

export class CreatePostDto {
  @IsString()
  @MaxLength(512)
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  @IsJSON()
  schema?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @IsOptional()
  @IsISO8601()
  publishedAt?: Date;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  @IsOptional()
  @Type(() => CreateMetaOptionDto)
  metaOption?: CreateMetaOptionDto | null;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
