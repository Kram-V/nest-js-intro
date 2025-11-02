import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production', 'staging')
    .default('development'),
  DATABASE_NAME: Joi.string().default('nestjs-blog'),
  DATABASE_TYPE: Joi.string().default('postgres'),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_USERNAME: Joi.string().default('postgres'),
  DATABASE_PASSWORD: Joi.string().default('password123'),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_AUTOLOAD_ENTITIES: Joi.boolean().default(true),
  DATABASE_SYNC: Joi.boolean().default(true),
  PROFILE_API_KEY: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
});
