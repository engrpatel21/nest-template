import { Injectable } from '@nestjs/common';
import { ProductDbService } from '../../database/postgres/services/product.database.service';
import { AwsS3Service } from '../../shared/aws-s3.service';
import { AddProductRequest, ProductDetailsWithPhotos } from './dto/product.dto';
import { ProductPhotoEntity } from '../../database/postgres/entity/product-photo.entity';


@Injectable()
export class ProductService {
    constructor(
        private readonly productDbService: ProductDbService,
        private readonly s3service: AwsS3Service,
    ) { }

    async getCategory(){
        const categories = await this.productDbService.getCategory();
        return categories
    }

    async getMyProducts({ userId }: { userId: number}): Promise<ProductDetailsWithPhotos[]>{
        const products = await this.productDbService.getProductByUserId({ userId })
        return products
    }


    async saveProduct({ files , product }: { files: Express.Multer.File[], product: AddProductRequest}) {
        const productModel = await this.productDbService.saveProduct(product)
        const productPhotos: Partial<ProductPhotoEntity>[] = []
        for (const file of files) {
            const key = `user/${product.userId}/product/${productModel.productId}/${file.originalname}`
            await this.s3service.savePhotosToS3FromFile({ file, key })
            productPhotos.push({
                productId: productModel.productId,
                s3Bucket: this.s3service.productPhotoBucket,
                s3Key: key,
                s3Link: this.s3service.endpoint,
            })
        }
        const productPhotoModel = await this.productDbService.saveProductPhoto(productPhotos)
        return { productModel, productPhotoModel}
    }

    
}
