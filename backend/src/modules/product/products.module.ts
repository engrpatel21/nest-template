import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [DatabaseModule]
})
export class ProductsModule {}
