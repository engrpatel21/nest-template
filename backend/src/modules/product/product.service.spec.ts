import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../database/database.module';
import { typeOrmAsyncConfig } from '../../shared/tyeporm.config';
import { Readable } from 'typeorm/platform/PlatformTools';
import { AddProductRequest } from './dto/product.dto';
import { AwsS3Service } from '../../shared/aws-s3.service';

describe('ProductService', () => {
  let productService: ProductService;
  let s3Service: AwsS3Service;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, AwsS3Service],
      imports: [
        DatabaseModule,
        ...typeOrmAsyncConfig.map((typeOrmConfig) => TypeOrmModule.forRootAsync(typeOrmConfig))
      ],
    }).compile();
    productService = module.get<ProductService>(ProductService);
    s3Service = module.get<AwsS3Service>(AwsS3Service);
  }
  );

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  it('get categories', async () => {
    const result = await productService.getCategory()
    expect(result.length).toBeGreaterThan(0)
  })

  it('save product', async () => {

    //file buffer that reads 'hello world'
    const buffer = Buffer.from('hello world', 'utf-8')
    // mock an object of type Express.Multer.File
    const files: Express.Multer.File[] = [{
      fieldname: 'test',
      originalname: 'test',
      encoding: 'test',
      mimetype: 'test',
      size: 100,
      stream: new Readable(),
      destination: 'test',
      filename: 'test',
      path: 'test',
      buffer: buffer,
    }]

    
    const product: AddProductRequest = {
      name: 'test',
      description: 'test',
      price: 100,
      userId: 1,
      categoryId: 1

    }
    const result = await productService.saveProduct({ files, product })
    expect(result.productModel.categoryId).toBe(product.categoryId)
    expect(result.productModel.userId).toBe(product.userId)
    expect(result.productModel.productId).toBeDefined()
    expect(result.productModel.productId).toBeGreaterThan(0)
    expect(result.productModel.name).toBe(product.name)
    expect(result.productModel.description).toBe(product.description)
    expect(result.productPhotoModel.length).toBeGreaterThan(0)
    expect(result.productPhotoModel[0].productId).toBe(result.productModel.productId)
    expect(result.productPhotoModel[0].s3Bucket).toBe(s3Service.productPhotoBucket)
    expect(result.productPhotoModel[0].s3Key).toBe(`user/${product.userId}/product/${result.productModel.productId}/${files[0].originalname}`)
    expect(result.productPhotoModel[0].s3Link).toBe(s3Service.endpoint)
  })
});