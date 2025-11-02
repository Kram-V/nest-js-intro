import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  DefaultValuePipe,
  Patch,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(['', ':id'])
  public getUsers(
    @Param('id', new ParseIntPipe({ optional: true })) id?: number,
    @Query(
      'limit',
      new DefaultValuePipe(10),
      new ParseIntPipe({ optional: true }),
    )
    limit?: number,
    @Query(
      'page',
      new DefaultValuePipe(1),
      new ParseIntPipe({ optional: true }),
    )
    page?: number,
  ) {
    return this.usersService.findAll(id, limit, page);
  }

  @Post()
  public createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Post('create-many')
  public createManyUsers(@Body() body: CreateManyUsersDto) {
    return this.usersService.createMany(body);
  }

  @Patch()
  public patchUser(@Body() body: PatchUserDto) {
    console.log(body instanceof PatchUserDto);
    return 'User Updated Successfully';
  }
}
