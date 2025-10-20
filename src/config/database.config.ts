import { registerAs } from '@nestjs/config';

export default registerAs('databaseConfig', () => ({
  name: process.env.DATABASE_NAME || 'nestjs-blog',
  type: process.env.DATABASE_TYPE || 'postgres',
  port: process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password123',
  host: process.env.DATABASE_HOST || 'localhost',
  synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
  autoLoadEntities:
    process.env.DATABASE_AUTOLOAD_ENTITIES === 'true' ? true : false,
}));
