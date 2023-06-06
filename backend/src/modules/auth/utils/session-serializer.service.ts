import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserDbService } from "../../../database/postgres/services/user.database.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly userDbService: UserDbService) {
        super()
    }

    serializeUser(user: any, done: (err, user: any) => void) {
        done(null, user)
    }

    async deserializeUser(user: any, done: (err, user: any) => void) {
        const userModel = await this.userDbService.getUserByUserId({ userId: user.userId })
        return userModel ? done(null, user) : done(null, null)
    }
}