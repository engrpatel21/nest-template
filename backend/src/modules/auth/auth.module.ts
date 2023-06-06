import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../../database/database.module';
import { SessionSerializer } from './utils/session-serializer.service';
import { LocalStrategy } from './strategy/local.strategy';

@Module({

  providers: [
    AuthService, 
    SessionSerializer,
    LocalStrategy,
  ],
  controllers: [AuthController],
  imports: [
    DatabaseModule, 

  ]
})
export class AuthModule {}
