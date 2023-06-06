import { Test, TestingModule } from '@nestjs/testing';
import { ProductDbService } from './product.database.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../../database/database.module';
import { typeOrmAsyncConfig } from '../../../shared/tyeporm.config';
import { ProductEntity } from '../entity/product.entity';
import { ProductPhotoEntity } from '../entity/product-photo.entity';
import { CategoryEntity } from '../entity/product-category.entity';

describe('ProductService', () => {
  let productDb: ProductDbService;
  const productToSave: Partial<ProductEntity> = {
    name: 'test',
    description: 'test',
    price: 100,
    userId: 1,
    categoryId: 1
  }
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductDbService,],
      imports: [
        DatabaseModule,
        ...typeOrmAsyncConfig.map((typeOrmConfig) => TypeOrmModule.forRootAsync(typeOrmConfig)),
        TypeOrmModule.forFeature([ProductEntity, ProductPhotoEntity, CategoryEntity])
      ],
    }).compile()
    productDb = module.get<ProductDbService>(ProductDbService);
  });

  it('should be defined', () => {
    expect(productDb).toBeDefined();
  });

  it('get categories', async () => {
    const result = await productDb.getCategory()
    expect(result.length).toBeGreaterThan(0)
  })

  it('save product', async () => {
    const result = await productDb.saveProduct(productToSave)
    expect(result.categoryId).toBe(productToSave.categoryId)
    expect(result.userId).toBe(productToSave.userId)
    expect(result.productId).toBeDefined()
    expect(result.productId).toBeGreaterThan(0)
    expect(result.name).toBe(productToSave.name)
    expect(result.description).toBe(productToSave.description)
  })

  it('save product photo', async () => {
    const saveProduct = await productDb.saveProduct(productToSave)
    expect(saveProduct.productId).toBeDefined()
    expect(saveProduct.productId).toBeGreaterThan(0)
    const productPhotoToSave: Partial<ProductPhotoEntity>[] = [{
      productId: saveProduct.productId,
      s3Bucket: 'test',
      s3Key: 'test',
      s3Link: 'test',
    }]
    const result = await productDb.saveProductPhoto(productPhotoToSave)
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].productPhotoId).toBeDefined()
    expect(result[0].productPhotoId).toBeGreaterThan(0)
    expect(result[0].productId).toBe(saveProduct.productId)
  })

  it('get product by user id', async () => {
    const result = await productDb.getProductByUserId({ userId: 1 })
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].productId).toBeGreaterThan(0)
    expect(result[0].userId).toBe(1)
    expect(result[0].name).toBe(productToSave.name)
    expect(result[0].description).toBe(productToSave.description)
    expect(result[0].price).toBeDefined()
    expect(result[0].categoryId).toBe(productToSave.categoryId)
    expect(result[0].category).toBe('Farm')
    expect(result[0].productPhotos).toBeDefined()
    expect(result[0].productPhotos.length).toBeGreaterThan(0)
    expect(result[0].productPhotos[0].productPhotoId).toBeGreaterThan(0)
    expect(result[0].productPhotos[0].link).toBe('test/test/test')
  })

});
