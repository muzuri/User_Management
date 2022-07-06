import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from '../user/models/entity/user.entity';
import { UserController } from './user.controller';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [UserService],
  exports: [UserModule, UserService],
  controllers: [UserController, UploadController]
})
export class UserModule {}
