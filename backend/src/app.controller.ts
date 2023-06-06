import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AwsS3Service } from './shared/aws-s3.service';
import { UserDbService } from './database/postgres/services/user.database.service';

@Controller()
export class AppController {
  constructor(
    private readonly s3service: AwsS3Service,
    private readonly userDb: UserDbService
  ) {

  }

  @Get()
  async downloadFile() {

    const result = await this.userDb.getUserByUserId({ userId: 1})
    console.log(result)
  }
}
