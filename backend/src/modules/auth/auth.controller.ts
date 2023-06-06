import { Body, Controller, Get, Post,Session, Req } from '@nestjs/common';
import { AuthResponse,AuthSignUpRequest } from './dto/auth.dt';
import { AuthService } from './auth.service';
import { Auth } from '../../common/decorator/auth.decorator';
import { LoggedIn } from '../../common/decorator/logged-in.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('sign-up')
    async signUp( @Body() signUpRequest: AuthSignUpRequest): Promise<AuthResponse>{
        const model = await this.authService.signUp(signUpRequest)
        return model
    }

    @Auth()
    @Post('sign-in')
    async signIn(@Req() req,){
        return req.user
    }

    @LoggedIn()
    @Post('sign-out')
    async signOut(@Req() req) {
        await req.logout((err) => {
            if (err) throw new Error(err)
        })
        return { msg: 'Signed Out'}
    }

    @LoggedIn()
    @Get('test')
    getUser(@Req() req, @Session() session: Record<string, any>){
        return req.sessionID
    }
    
}
