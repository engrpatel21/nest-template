// db.module.ts
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDbService } from './postgres/services/user.database.service';
import { postgresEntities } from './postgres/entity';
import { ProductDbService } from './postgres/services/product.database.service';


const services = [UserDbService, ProductDbService]
@Global()
@Module({
  imports: [TypeOrmModule.forFeature(postgresEntities)],
  providers:  [...services],
  exports: [...services],
})
export class DatabaseModule {}
