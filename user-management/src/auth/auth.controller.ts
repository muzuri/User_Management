import { Controller, Post, HttpStatus, HttpCode, Get, Body, Param, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Login } from './interfaces/login.interface';
import { ResponseSuccess, ResponseError } from '../common/dto/response.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { CreateUserDto } from '../user/models/dto/create-user.dto';
import { UserService } from '../user/user.service'
import { ResetPasswordDto } from './models/dto/reset-password.dto';
import * as bcrypt from 'bcrypt';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService
    ) {}
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() login: Login): Promise<IResponse> {
    try {
      var response = await this.authService.validateLogin(login.email, login.password);
      return new ResponseSuccess("LOGIN.SUCCESS", response);
    } catch(error) {
      return new ResponseError("LOGIN.ERROR", error);
    }
  }
 
  @Post('email/register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() body: CreateUserDto): Promise<any> {
    console.log(`this the console${body.password, body.birthDate}`);

    const saltorRounds = 12;
    const hashed_password = await bcrypt.hash(body.password, saltorRounds);
    console.log(`this the console${hashed_password}`);
   var newUser = await this.userService.create({
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
  
      await this.authService.createEmailToken(newUser.email);
      var sent = await this.authService.sendEmailVerification(newUser.email);
      if(sent){
        console.log('thos')
        return new ResponseSuccess("REGISTRATION.USER_REGISTERED_SUCCESSFULLY");
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    }
    // } catch(error){
    //   return new ResponseError("REGISTRATION.ERROR.GENERIC_ERROR", error);
    // }

  @Get('email/verify/:token')
  public async verifyEmail(@Param() params): Promise<IResponse> {
    try {
      var isEmailVerified = await this.authService.verifyEmail(params.token);
      return new ResponseSuccess("LOGIN.EMAIL_VERIFIED", isEmailVerified);
    } catch(error) {
      return new ResponseError("LOGIN.ERROR", error);
    }
  }

  @Get('email/resend-verification/:email')
  public async sendEmailVerification(@Param() params): Promise<IResponse> {
    try {
      await this.authService.createEmailToken(params.email);
      var isEmailSent = await this.authService.sendEmailVerification(params.email);
      if(isEmailSent){
        return new ResponseSuccess("LOGIN.EMAIL_RESENT", null);
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    } catch(error) {
      return new ResponseError("LOGIN.ERROR.SEND_EMAIL", error);
    }
  }

  @Get('email/forgot-password/:email')
  public async sendEmailForgotPassword(@Param() params): Promise<IResponse> {
    try {
      console.log(`hello${params.email}`)
      var isEmailSent = await this.authService.sendEmailForgotPassword(params.email);
      if(isEmailSent){
        return new ResponseSuccess("LOGIN.EMAIL_RESENT", null);
      } else {
        return new ResponseError("REGISTRATION.ERROR.MAIL_NOT_SENT");
      }
    } catch(error) {
      return new ResponseError("LOGIN.ERROR.SEND_EMAIL", error);
    }
  }

  @Post('email/reset-password')
  @HttpCode(HttpStatus.OK)
  public async setNewPassord(@Body() resetPassword: ResetPasswordDto): Promise<IResponse> {
    try {
      var isNewPasswordChanged : boolean = false;
      var isEmailValid = await this.userService.findByEmail(resetPassword.email);
      if(!isEmailValid) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
     if (resetPassword.newPasswordToken) {
        var forgottenPasswordModel = await this.authService.getForgottenPasswordModel(resetPassword.newPasswordToken);
        isNewPasswordChanged = await this.userService.setPassword(forgottenPasswordModel.email, resetPassword.newPassword);
        
      } else {
        return new ResponseError("RESET_PASSWORD.CHANGE_PASSWORD_ERROR");
      }
      return new ResponseSuccess("RESET_PASSWORD.PASSWORD_CHANGED", isNewPasswordChanged);
    } catch(error) {
      return new ResponseError("RESET_PASSWORD.CHANGE_PASSWORD_ERROR", error);
    }
  }

}