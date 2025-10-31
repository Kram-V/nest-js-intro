import { MetaOption } from 'src/meta-options/meta-option.entity';
import { PostType, Status } from 'src/posts/enums/posts.enum';
import { Tag } from 'src/tags/tag.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: PostType,
    nullable: false,
    default: PostType.POST,
  })
  postType: PostType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: Status,
    nullable: false,
    default: Status.DRAFT,
  })
  status: Status;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishedAt?: Date;

  @ManyToMany(() => Tag, (tag) => tag.posts, { cascade: true, eager: true })
  @JoinTable({
    name: 'posts_tags_tag',
    joinColumn: {
      name: 'postId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tagId',

      referencedColumnName: 'id',
    },
  })
  tags: Tag[];

  @OneToOne(() => MetaOption, (metaOption) => metaOption.post, {
    cascade: true,
    eager: true,
  })
  metaOption?: MetaOption;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn()
  user: User;
}
