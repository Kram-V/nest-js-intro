import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';

import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async createUser(data: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      return 'The email you provided is already existing';
    }

    let newUser = this.usersRepository.create(data);
    newUser = await this.usersRepository.save(newUser);

    return newUser;
  }

  public findAll(
    id: number | undefined,
    limit: number | undefined,
    page: number | undefined,
  ) {
    const isAuth = this.authService.isAuth();

    return [
      {
        firstName: 'Mark',
        lastName: 'Vivar',
      },
      {
        firstName: 'Diane',
        lastName: 'Castillo',
      },
    ];
  }

  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({ id });
  }
}
