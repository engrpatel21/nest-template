import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { SharedModule } from './shared.module';
import { ConfigService } from './config.service';
import { postgresEntities } from '../database/postgres/entity';
import { DataSourceOptions } from 'typeorm';

const config = new ConfigService();



export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions[] = [
  {
    imports: [SharedModule],
    inject: [ConfigService],
    useFactory: async (
      config: ConfigService,
    ): Promise<TypeOrmModuleOptions> => {
      return {
        name: 'rento_postgres',
        type: 'postgres',
        host: config.get('DB_HOST'),
        database: config.get('DB_NAME'),
        port: parseInt(config.get('DB_PORT')),
        schema: 'rento',
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        entities: [...postgresEntities],
        migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
        extra: {
          charset: 'utf8mb4_unicode_ci',
        },
        synchronize: false,
        logging: true,
      };
    },
  },
];

export const postgreConfig: DataSourceOptions[] = [
  {
    name: 'rento_postgres',
    type: 'postgres',
    host: config.get('DB_HOST'),
    port: parseInt(config.get('DB_PORT')),
    username: config.get('DB_USERNAME'),
    database: config.get('DB_NAME'),
    password: config.get('DB_PASSWORD'),
    entities: [...postgresEntities],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    extra: {
      charset: 'utf8mb4_unicode_ci',
    },
    synchronize: false,
    logging: true,
  },
];
