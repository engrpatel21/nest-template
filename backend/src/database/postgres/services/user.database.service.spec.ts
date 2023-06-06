import { Test, TestingModule } from "@nestjs/testing";
import { UserDbService } from "./user.database.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "../../database.module";
import { typeOrmAsyncConfig } from "../../../shared/tyeporm.config";
import { UserEntity } from "../entity/user.entity";
import { UserRoles } from "../../../modules/user/enums/user.enum";

describe('UserService', () => {
    let userDb: UserDbService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserDbService],
            imports: [
                DatabaseModule,
                ...typeOrmAsyncConfig.map((typeOrmConfig) => TypeOrmModule.forRootAsync(typeOrmConfig)),
                TypeOrmModule.forFeature([UserEntity])
            ],
        }).compile()
        userDb = module.get<UserDbService>(UserDbService);
    })

    it('should be defined', () => {
        expect(userDb).toBeDefined();
    });

    it('get user by userId', async () => { 
        const result = await userDb.getUserByUserId({userId: 1});
        expect(result.userId).toBe(1);
        expect(result.displayName).toBe('p');
        expect(result.firstName).toBe('p');
        expect(result.lastName).toBe('p');
        expect(result.email).toBe('test@test.com');
    })

    //unit test for updateUser
    it('update user', async () => {
        const user = await userDb.getUserByUserId({userId: 1});
        const result = await userDb.updateUser({user, newRole: UserRoles.provider});
        expect(result.userRole).toBe(UserRoles.provider);
    })

    //unit test for getUserByUserName
    it('get user by username', async () => {
        const result = await userDb.getUserByUserName({username: 'p'});
        expect(result.userId).toBe(1);
    })

    it('check email valid email', async () => {
        const testEmail = 'test@test.com'
        const result = await userDb.checkEmail({ email: testEmail})
        return expect(result.email).toBe(testEmail)
    })

    it('check email invalid email', async () => {
        const testEmail = 'asdf@asdf123.clom'
        const result = await userDb.checkEmail({ email: testEmail})
        return expect(result).toBe(null)
    })
});