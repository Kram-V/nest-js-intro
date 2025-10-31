import {
  Injectable,
  forwardRef,
  Inject,
  RequestTimeoutException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';

import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import type { ConfigType } from '@nestjs/config';
import profileConfig from './config/profile.config';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private readonly usersCreateManyProvider: UsersCreateManyProvider,
  ) {}

  public async createUser(data: CreateUserDto) {
    let existingUser: User | null;

    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: data.email },
      });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again later',
        {
          description: 'Error Connecting to Database',
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'The user is already existing, please check your email provided',
      );
    }

    let newUser = this.usersRepository.create(data);

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again later',
        {
          description: 'Error Connecting to Database',
        },
      );
    }

    return newUser;
  }

  public findAll(
    id: number | undefined,
    limit: number | undefined,
    page: number | undefined,
  ) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The api endpoint does not exist',
        fileName: 'users.service.ts',
        lineNumber: 76,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'Occured because the API endpoint was permanently moved',
      },
    );
  }

  public async findOneById(id: number) {
    let user: User | null;

    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try again later',
        {
          description: 'Error Connecting to Database',
        },
      );
    }

    if (!user) {
      throw new BadRequestException('No user found!');
    }

    return user;
  }

  public async createMany(data: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(data);
  }
}
