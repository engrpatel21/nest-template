import {
  Inject,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmAsyncConfig } from './shared/tyeporm.config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { REDIS, SharedModule } from './shared/shared.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from './shared/config.service';
import { ProductsModule } from './modules/product/products.module';
import * as redis from 'redis'


@Module({
  imports: [

    ...typeOrmAsyncConfig.map((typeOrmConfig) => TypeOrmModule.forRootAsync(typeOrmConfig)),
    PassportModule.register({
      session: true,
    }),
    SharedModule,
    UserModule,
    DatabaseModule,
    AuthModule,
    ProductsModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly configService: ConfigService, @Inject(REDIS) private readonly client: redis.RedisClient) {
  }
}
