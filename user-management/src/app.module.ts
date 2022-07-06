import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AuthModule, UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      username: 'muzuri',
      password: 'Jesus1234',
      database: 'user_management',
      autoLoadEntities: true,
      synchronize: true,

    }),
  ],
  
  controllers: [AppController],
  providers: [AppService],
  exports: [AuthModule, UserModule]
})
export class AppModule {}
