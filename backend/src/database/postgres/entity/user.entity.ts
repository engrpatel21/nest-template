import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ProductEntity } from './product.entity';

export enum UserRoles {
  member = 'member',
  admin = 'admin',
  provider = 'provider'
}

enum ColumnNames {
  userId = 'userId',
  firstName = 'firstName',
  lastName = 'lastName',
  displayName = 'displayName',
  userRole = 'userRole',
  email = 'email',
  profilePic = 'profilePic',
  phoneNumber = 'phoneNumber',
  hash = 'hash',
  createAt = 'createdAt',
  updateAt = 'updatedAt',

}

@Entity({ name: 'user', schema: 'rento' })
@Unique('user_unique_email', [ColumnNames.email])
@Unique('user_unique_phone_number', [ColumnNames.phoneNumber])
@Unique('user_unique_display_name', [ColumnNames.displayName])
@Index('user_email_index', [ColumnNames.email])
@Index('user_phone_number_index', [ColumnNames.phoneNumber])
@Index('user_display_name_index', [ColumnNames.displayName])
export class UserEntity {

  public readonly ColumnName = ColumnNames

  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: '30'
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: '30'
  })
  lastName: string;
  @Column({
    name: 'display_name',
    type: 'varchar',
    length: '30'
  })
  displayName: string;
  @Column({
    name: 'user_role',
    type: 'enum',
    default: UserRoles.member,
    enum: UserRoles,
  })
  userRole: UserRoles;

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
  
  @Column({
    name: 'email',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  email: string;

  profilePic: string;
  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: '15',
    nullable: true,
  })
  phoneNumber: string;

  @Column({
    name: 'hash',
    type: 'varchar',
    length: '255',
  })
  hash: string;

  @OneToMany(() => ProductEntity, (product) => product.user)
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
