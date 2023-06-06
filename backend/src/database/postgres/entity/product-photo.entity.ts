import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEntity } from "./product.entity";


@Entity({ name: 'product_photo', schema: 'rento'})
export class ProductPhotoEntity {

  @PrimaryGeneratedColumn({ name: 'product_photo_id' })
  productPhotoId: number

  @Column({ name: 'product_id', type: 'integer'})
  productId: number

   
  @Column({
    name: 's3_bucket',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  s3Bucket: string

  @Column({
    name: 's3_key',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  s3Key: string

  @Column({
    name: 's3_link',
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  s3Link: string

  @ManyToOne(() => ProductEntity, (product) => product.productPhotos)
  @JoinColumn({ name: 'product_id'})
  product: ProductEntity

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