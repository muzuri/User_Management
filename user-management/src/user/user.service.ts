import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/models/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { AccountVerificationDto } from '../auth/models/dto/account-verification.dto';
import { ProfilePhotDto } from './models/dto/change-profile.dto';
import { VerifyAccountDto } from './models/dto/verify-account.dto';

const saltRounds = 10;
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){}

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
      }
    
      async findByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne({where: {email}});
      }
      
      async create(data){
        return await this.userRepository.save(data);
     }
     async deleteAll(data){
      return await this.userRepository.delete(data);
   }
   async update(id: number, data): Promise<any> {
    return this.userRepository.update(id, data)
}
async updateEmailToken(email: string ): Promise<any> {
  return  await this.userRepository.update(
    {
    email
     },

      { 
      email: email,
      emailToken: (Math.floor(Math.random() * (9000000)) + 1000000).toString(), //Generate 7 digits number
      },
)}
async updatePasswordToken(email: string ): Promise<any> {
  return await this.userRepository.update(
    {email},
    {
      email: email,
      passwordToken: (Math.floor(Math.random() * (9000000)) + 1000000).toString(), //Generate 7 digits number
    },
)}
async verifyEmail(email: string ): Promise<any> {
  return  await this.userRepository.update(
    {
    email
     },

      { 
      isEmailValid:true  //Generate 7 digits number
      },
)}
async findOneToken(token: string){
  return await this.userRepository.findOne({where: {emailToken: token}})
}
async findPasswordToken(token: string){
  return await this.userRepository.findOne({where: {passwordToken: token}})
}
async deleteUser(id: number){
  return await this.userRepository.delete({id})
}
isValidEmail (email : string){
  if(email){
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  } else return false
}

async setPassword(email: string, newPassword: string): Promise<boolean> { 
  var userFromDb = await this.findByEmail(email);
  if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
  
  userFromDb.password = await bcrypt.hash(newPassword, saltRounds);

  await this.userRepository.update(
    {
    email
     },

      { 
      password:userFromDb.password,
      passwordToken: null
      },
  
)
return true
}
async submitDocument(document: AccountVerificationDto): Promise<boolean> { 
  var userFromDb = await this.findByEmail(document.email);
  if(!userFromDb) throw new HttpException('_NOT_FOUND', HttpStatus.NOT_FOUND);

  await this.userRepository.update(
    {
    email: document.email
     },

      { 
      doc_image: document.doc_image,
      nationalIdNumber: document.nationalIdNumber,
      documentType: document.documentType
      },
  
)
return true
}
async verifyAccount(acoountVerify: VerifyAccountDto): Promise<boolean> { 
  var userFromDb = await this.findByEmail(acoountVerify.email);
  if(!userFromDb) throw new HttpException('_NOT_FOUND', HttpStatus.NOT_FOUND);

  await this.userRepository.update(
    {
    email: acoountVerify.email
     },

      { 
        isAccountVerified: true,
        accountStatus: 'VERIFIED'
      },
  
)
return true

}
async UnverifyAccount(acoountVerify: VerifyAccountDto): Promise<boolean> { 
  var userFromDb = await this.findByEmail(acoountVerify.email);
  if(!userFromDb) throw new HttpException('_NOT_FOUND', HttpStatus.NOT_FOUND);

  await this.userRepository.update(
    {
    email: acoountVerify.email
     },

      { 
        isAccountVerified: true,
        accountStatus: 'UNVERIFIED'
      },
  
)
return true
}
async updateProfile(profile: ProfilePhotDto ): Promise<any> {
  await this.userRepository.update(
    {email: profile.email},
    {
      profile_image: profile.photo_url
    },
)
return true
}
   
}
