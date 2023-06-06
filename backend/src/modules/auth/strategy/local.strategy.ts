import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { IVerifyOptions, Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { AuthSignInRequest } from "../dto/auth.dt";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService: AuthService){
        super()
    }

    async validate(username: string, password:string){
        const user = await this.authService.signIn({ username, password})
        return user
    }
}