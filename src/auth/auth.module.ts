import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { FindOneUserByEmailProvider } from './providers/find-one-user-by-email.provider';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AccessTokenGuard } from './guards/access-token.guard';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    FindOneUserByEmailProvider,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    AuthenticationGuard,
    AccessTokenGuard,
  ],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [
    AuthService,
    HashingProvider,
    AuthenticationGuard,
    AccessTokenGuard,
  ],
})
export class AuthModule {}
