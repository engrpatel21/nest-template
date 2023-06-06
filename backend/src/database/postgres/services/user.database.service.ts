// users.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRoles } from '../entity/user.entity';
import { AuthResponse } from '../../../modules/auth/dto/auth.dt'
import { Repository } from 'typeorm';
import { User } from '../../../modules/user/dto/user.dto';

@Injectable()
export class UserDbService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  async postUser(user: Partial<UserEntity>): Promise<AuthResponse> {
    const model = await this.userRepository.save({
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      hash: user.hash,
      phoneNumber: user.phoneNumber,
    })
    return this.mapUserToAuthRespone(model)
  }

  async getUserByUserId({ userId }: { userId: number }): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail({ where: [{ userId: userId }]})
      return this.mapUserEntityToUserDto(user)
    } catch (error) {
      throw new UnauthorizedException(`Username and password combination do not Match, ${error}`)
    }
  }

  async updateUser({ user, newRole }: { user: Partial<UserEntity>, newRole: UserRoles}): Promise<User>{
    user.userRole = newRole;
    const model = await this.userRepository.save(user)
    return this.mapUserEntityToUserDto(model)
  }

  async getUserByUserName({ username }: { username: string }): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: [
          { email: username },
          { displayName: username },
          { phoneNumber: username },
        ]
      })
      return user
    } catch (error) {
      throw new UnauthorizedException(`Username and password combination do not Match`)
    }
  }

  async checkEmail({ email }: { email: string}): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: [{ email  }]})
    return user
  }

  mapUserEntityToUserDto(user: UserEntity): User {
    return {
      displayName: user.displayName,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      userId: user.userId,
      userRole: user.userRole,
    }
  }

  mapUserToAuthRespone(user: UserEntity): AuthResponse {
    return {
      displayName: user.displayName,
      role: user.userRole,
    }
  }
}
