import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import {User} from '../user/models/entity/user.entity'
import { CreateUserDto } from './models/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AccountVerificationDto } from 'src/auth/models/dto/account-verification.dto';
import { ProfilePhotDto } from './models/dto/change-profile.dto';
import { VerifyAccountDto } from './models/dto/verify-account.dto';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ){ }
    @Get()
    async Getall(
    ): Promise<User[]>{
        return this.userService.findAll();
    }
    @Get('valid/:email')
     async validEmail(@Param() email: string): Promise<any> {
    return await (await this.userService.findByEmail(email));
  }
    @Post()
    async create(
        @Body() body: CreateUserDto): Promise<User>{
        const saltorRounds = 12;
        const hashed_password = await bcrypt.hash(body.password, saltorRounds);
        return this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hashed_password,
            gender: body.gender,
            age: body.age,
            martalStatus: body.martalStatus,
            nationality: body.nationality,
            profile_image: body.profile_image,
            doc_image: body.doc_image,
            accountStatus: body.accountStatus,
            birthDate: body.birthDate,
            timestamp: new Date(Date.now()),
            isAccountVerified: false,
            isEmailValid: false

        });
    
    }
    @Post('submitDocument')
    async submitDocument(
        @Body() body: AccountVerificationDto): Promise<any>
    {
    return await this.userService.submitDocument(body);
        
    }
    @Post('accountUnverify')
    async accountUnverify(
        @Body() body: VerifyAccountDto): Promise<any>
    {
    return await this.userService.UnverifyAccount(body);
        
    }

    @Post('accountVerify')
    async accountVerify(
        @Body() body: VerifyAccountDto): Promise<any>
    {
    return await this.userService.verifyAccount(body);
        
    }
  
    @Get(':email')
    async get(@Param('email') email: string) {
        return await this.userService.findByEmail(email)
        
    }
    @Post('profile')
    async getProfile(@Body() body: ProfilePhotDto) {
        return await this.userService.updateProfile(body)
        
    }
    @Delete(':id')
    async DeleteUser(@Param('id') id: number){
        return await this.userService.deleteUser(id);
    }
}
