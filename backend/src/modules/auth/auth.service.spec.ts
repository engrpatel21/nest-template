//auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DatabaseModule } from '../../database/database.module';
import { typeOrmAsyncConfig} from '../../shared/tyeporm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionSerializer } from './utils/session-serializer.service';
import { LocalStrategy } from './strategy/local.strategy';
import { UserDbService } from '../../database/postgres/services/user.database.service';
import { UserRoles } from '../user/enums/user.enum';
import { AuthResponse, AuthSignInRequest, AuthSignUpRequest } from './dto/auth.dt';
import * as argon from 'argon2'
import { User } from '../user/dto/user.dto';

jest.mock('argon2', () => ({
  ...jest.requireActual('argon2'),
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let app: TestingModule
  let userDbService: UserDbService

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [AuthService, SessionSerializer, LocalStrategy],
      imports: [
        DatabaseModule,
        ...typeOrmAsyncConfig.map((typeOrmConfig) => TypeOrmModule.forRootAsync(typeOrmConfig))
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    userDbService = app.get(UserDbService)
    
  });

  // afterAll(async () => {
  //   app.close()
  // });
  

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('user signup', async () => {
    const mockPostUser = jest.spyOn(userDbService, 'postUser');
    const signUpRequest: AuthSignUpRequest = {
      displayName: 'John Doe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      phoneNumber: '1234567890',
    };

    const resolvedModel = {
      role: UserRoles.member,
      displayName: 'John Doe'
    }
    mockPostUser.mockResolvedValue(resolvedModel);
    const result: AuthResponse = await authService.signUp(signUpRequest);
    expect(mockPostUser).toHaveBeenCalledWith(expect.objectContaining({
      displayName: signUpRequest.displayName,
      firstName: signUpRequest.firstName,
      lastName: signUpRequest.lastName,
      email: signUpRequest.email,
      phoneNumber: signUpRequest.phoneNumber,
      hash: expect.any(String), // Ensure hash is generated
    }));
    expect(mockPostUser).toHaveBeenCalledTimes(1)
    expect(result).toBe(resolvedModel);

  })
  // it('should return a valid user when provided with correct credentials', async () => {
  //   // Mock the userDbService methods
  //   const mockGetUserHash = jest.spyOn(userDbService, 'getUserByUserName');
  //   const mockVerify = argon.verify as jest.Mock
  //   const mockGetUserByUserId = jest.spyOn(userDbService, 'getUserByUserId');

  //   // Mocked data
  //   const mockSignInRequest: AuthSignInRequest = {
  //     username: 'john.doe',
  //     password: 'password123',
  //   };
  //   const mockUserWithHash = {
  //     hash: 'hashedPassword',
  //     userId: 1,
  //   };
  //   const mockUser: User = {
  //     displayName: 'john.doe',
  //     email: expect.any(String),
  //     firstName: expect.any(String),
  //     lastName: expect.any(String),
  //     phoneNumber: expect.any(String),
  //     userId: 1,
  //     userRole: UserRoles.member
  //   };

  //   // Set up mock implementations and return values
  //   mockGetUserHash.mockResolvedValue(mockUserWithHash);
  //   mockVerify.mockResolvedValue(true);
  //   mockGetUserByUserId.mockResolvedValue(mockUser);

  //   // Call the signIn function
  //   const result: User = await authService.signIn(mockSignInRequest);

  //   // Expectations
  //   expect(mockGetUserHash).toHaveBeenCalledWith(mockSignInRequest);
  //   expect(mockVerify).toHaveBeenCalledWith(
  //     mockUserWithHash.hash,
  //     mockSignInRequest.password
  //   );
  //   expect(mockGetUserByUserId).toHaveBeenCalledWith({ userId: mockUserWithHash.userId });
  //   expect(result).toBe(mockUser);
  // });
});
