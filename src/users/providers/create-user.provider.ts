import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly hashingProvider: HashingProvider,
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

    let newUser = this.usersRepository.create({
      ...data,
      password: await this.hashingProvider.hashPassword(data.password),
    });

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
}
