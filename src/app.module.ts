import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaginationModule } from './common/pagination/pagination.module';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import environmentValidation from 'src/config/environment.validation';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { AccessTokenGuard } from './auth/guards/access-token.guard';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${ENV ? '.' + ENV : ''}`,
      load: [databaseConfig, appConfig],
      validationSchema: environmentValidation,
    }),
    UsersModule,
    PostsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: configService.get<'postgres' | 'mysql' | 'mariadb' | 'sqlite'>(
          'databaseConfig.type',
        )!,
        host: configService.get<string>('databaseConfig.host'),
        port: configService.get<number>('databaseConfig.port'),
        username: configService.get<string>('databaseConfig.username'),
        password: configService.get<string>('databaseConfig.password'),
        database: configService.get<string>('databaseConfig.name'),
        autoLoadEntities: configService.get<boolean>(
          'databaseConfig.autoLoadEntities',
        ),
        synchronize: configService.get<boolean>('databaseConfig.synchronize'),
      }),
    }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    TagsModule,
    MetaOptionsModule,
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
