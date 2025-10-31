import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async createMany(data: CreateManyUsersDto) {
    const newUsers: User[] = [];

    // CREATE QUERY RUNNER INSTANCE
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // CONNECT QUERY RUNNER TO DATASOURCE
      await queryRunner.connect();

      // START TRANSACTION
      await queryRunner.startTransaction();
    } catch {
      throw new RequestTimeoutException('Could not connect to the database');
    }

    try {
      for (const user of data.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }

      // IF SUCCESSFUL COMMIT
      await queryRunner.commitTransaction();
    } catch (error) {
      // IF UNSUCCESFUL ROLLBACK
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      await queryRunner.release();
    }

    return newUsers;
  }
}
