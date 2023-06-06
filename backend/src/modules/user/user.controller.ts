import { Body, Controller, Get, Put} from '@nestjs/common';
import { UserDbService } from '../../database/postgres/services/user.database.service';
import { LoggedIn } from '../../common/decorator/logged-in.decorator';
import { UserRoles } from './enums/user.enum';
import { LoggedInUser } from '../../common/decorator/logged-in-user.decorator';
import { User } from './dto/user.dto';


@LoggedIn()
@Controller('user')
export class UserController {
  constructor(private readonly userDbService: UserDbService) {}

  @Put('update-role')
  async updateUserRole(@LoggedInUser() user: User, @Body('userRole') newRole: UserRoles ){
    const response = await this.userDbService.updateUser({ user, newRole})
    return response
  }

  @Get('check-email')
  async checkEmail(@Body('email') email: string ): Promise<{ valid: boolean}>{
    const user = await this.userDbService.checkEmail({ email })
    const isValid = user ? false : true
    return  { valid: isValid }
  }
  @Get('')
  helloWorld(){
    return 'hello world'
  }
}
