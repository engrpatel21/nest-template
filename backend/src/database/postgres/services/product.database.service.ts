import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { DeepPartial, Repository } from "typeorm";
import { Category, ProductDetailsWithPhotos } from "../../../modules/product/dto/product.dto";
import { CategoryEntity } from "../entity/product-category.entity";
import { ProductEntity } from "../entity/product.entity";
import { ProductPhotoEntity } from "../entity/product-photo.entity";

@Injectable()
export class ProductDbService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
        @InjectRepository(ProductPhotoEntity)
        private readonly productPhotoRepository: Repository<ProductPhotoEntity>,
    ) { }

    async saveProduct(product: Partial<ProductEntity>): Promise<ProductEntity> {
        const model = await this.productRepository.save(product)
        return model;
    }

    async getCategory(): Promise<Category[]> {
        const model = await this.categoryRepository.find()
        return model.map(category => this.mapCategoryToCategoryDto(category))
    }

    async saveProductPhoto(productPhotos: DeepPartial<ProductPhotoEntity>[]): Promise<ProductPhotoEntity[]> {
        const model = await this.productPhotoRepository.save(productPhotos)
        return model
    }

    async getProductByUserId({ userId }: { userId: number}): Promise<ProductDetailsWithPhotos[]>{
        const products = await this.productRepository.find({
            where: [{ userId }],
            relations: {
                productPhotos: true,
                category: true
            }
        })
        return products.map((product) => this.mapProductsAndPhotosToProductDetailsWithPhoto(product))
    }

    mapProductsAndPhotosToProductDetailsWithPhoto(productsWithPhotos: ProductEntity): ProductDetailsWithPhotos{
        return {
            category: productsWithPhotos.category.category,
            categoryId: productsWithPhotos.categoryId,
            description: productsWithPhotos.description,
            name: productsWithPhotos.name,
            price: productsWithPhotos.price,
            productId: productsWithPhotos.productId,
            productPhotos: productsWithPhotos.productPhotos.map((photo) => ({
                link: `${photo.s3Link}/${photo.s3Bucket}/${photo.s3Key}`,
                productPhotoId: photo.productPhotoId,
            })),
            userId: productsWithPhotos.userId,
            rating: null,
        }
    }

    mapCategoryToCategoryDto(category: CategoryEntity): Category {
        return {
            categoryId: category.categoryId,
            category: category.category
        }
    }


}