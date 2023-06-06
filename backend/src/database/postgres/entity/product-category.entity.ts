import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ProductEntity } from "./product.entity";


enum ColumnnName{
    categoryId = 'categoryId',
    category = 'category'
}

@Unique('categor_unique_name', [ColumnnName.category])
@Entity({ name: 'category', schema: 'rento'})
export class CategoryEntity{

  @PrimaryGeneratedColumn({ name: 'category_id'})
  categoryId: number;

  @Column({ name: 'category', type: 'varchar', length: 255})
  category: string

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: ProductEntity[];

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