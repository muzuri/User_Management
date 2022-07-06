import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JWTService } from './jwt.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';


@Module({
  imports: [UserModule],
  providers: [AuthService, JWTService],
  controllers: [AuthController]
})
export class AuthModule {}
