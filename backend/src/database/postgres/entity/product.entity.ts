import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { CategoryEntity } from "./product-category.entity";
import { ProductPhotoEntity } from "./product-photo.entity";

enum ColumnName{
    productId = 'productId',
    name = 'name',
    price = 'price',
    description = 'description',
    isAvailable = 'isAvailable',
    userId = 'userId',
    categoryId = 'categoryId',
    createAt = 'createdAt',
    updateAt = 'updatedAt',
}

@Index('product_user_id_index', [ColumnName.userId])
@Index('product_price_index', [ColumnName.price])
@Entity({ name: 'product', schema: 'rento' })
export class ProductEntity {

    @PrimaryGeneratedColumn({ name: 'product_id'})
    productId: number

    @Column({ name: 'name', type: 'varchar', length: 255})
    name: string

    @Column({ name: 'user_id', type: 'integer'})
    userId: number;

    @Column({ name: 'category_id', type: 'integer'})
    categoryId: number;

    @Column({ name: 'price', type: 'decimal', scale: 2, precision: 10})
    price: number

    @Column({ name: 'description', type: 'text' })
    description: string

    @Column({ name: 'is_available', type: 'boolean', default: true })
    isAvailable: boolean;

    @ManyToOne(() => UserEntity, (user) => user.products)
    @JoinColumn({ name: 'user_id'})
    user: UserEntity
    
    @ManyToOne(() => CategoryEntity, (category) => category.products)
    @JoinColumn({ name: 'category_id'})
    category: CategoryEntity

    @OneToMany(() => ProductPhotoEntity, (productPhoto) => productPhoto.product)
    productPhotos: ProductPhotoEntity[];

    @Column({ 
        name: 'created_at',
        type: 'timestamp',
        default: () => 'now()'
    })
    createAt: Date;
  
    @Column({ 
      name: 'updated_at',
      type: 'timestamp',
      default: () => 'now()'
    })
    updatedAt: Date
}