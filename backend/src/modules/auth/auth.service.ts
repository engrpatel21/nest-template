import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  AuthResponse,
  AuthSignInRequest,
  AuthSignUpRequest,
} from './dto/auth.dt';
import {
  UserDbService,
} from '../../database/postgres/services/user.database.service';
import * as argon from 'argon2';
import { User } from '../user/dto/user.dto';
import { UserEntity } from '../../database/postgres/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userDbService: UserDbService) { }

  async signUp(singUpRequest: AuthSignUpRequest): Promise<AuthResponse> {
    const hash = await argon.hash(singUpRequest.password);
    const userToSaave: Partial<UserEntity> = {
      displayName: singUpRequest.displayName,
      firstName: singUpRequest.firstName,
      lastName: singUpRequest.lastName,
      email: singUpRequest.email,
      hash,
      phoneNumber: singUpRequest.phoneNumber,
    }
    const model = await this.userDbService.postUser(userToSaave);
    return model;
  }

  async signIn(signInRequest: AuthSignInRequest): Promise<User> {
    const userWithHash = await this.userDbService.getUserByUserName({ username: signInRequest.username });
    const isPasswordMatched = await argon.verify(
      userWithHash.hash,
      signInRequest.password,
    );
    if (!isPasswordMatched) {
      throw new UnauthorizedException(
        `Username and password combination do not Match`,
      );
    }
    return {
      userId: userWithHash.userId,
      displayName: userWithHash.displayName,
      userRole: userWithHash.userRole,
      email: userWithHash.email,
      firstName: userWithHash.firstName,
      lastName: userWithHash.lastName,
      phoneNumber: userWithHash.phoneNumber,
    };
  }
}
