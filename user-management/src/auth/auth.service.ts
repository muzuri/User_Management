import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JWTService } from './jwt.service';
import * as bcrypt from 'bcrypt';
import {default as config} from '../config';
import * as nodemailer from 'nodemailer';
import { ForgottenPassword } from './interfaces/forgottenpassword.interface';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private readonly jwtService: JWTService,
    ){
        
    }
    async login(){
        return await this.userService.findAll();
    }
    async validateLogin(email, password) {
        var userFromDb = await this.userService.findByEmail(email);
        if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        if(!userFromDb.isEmailValid) throw new HttpException('LOGIN.EMAIL_NOT_VERIFIED', HttpStatus.FORBIDDEN);
    
        var isValidPass = await bcrypt.compare(password, userFromDb.password);
    
        if(isValidPass){
          var accessToken = await this.jwtService.createToken(email, userFromDb.roles);
          return { token: accessToken, user: userFromDb}
        } else {
          throw new HttpException('LOGIN.ERROR', HttpStatus.UNAUTHORIZED);
        }
    
      }
      async getForgottenPasswordModel(newPasswordToken: string): Promise<ForgottenPassword> {
        return await this.userService.findPasswordToken(newPasswordToken);
      }
      async sendEmailVerification(email: string): Promise<boolean> {   
        var model = await this.userService.findByEmail(email);
    
        if(model && model.emailToken){
            let transporter = nodemailer.createTransport({
                host: config.mail.host,
                port: config.mail.port,
                secure: config.mail.secure, // true for 465, false for other ports
                auth: {
                    user: config.mail.user,
                    pass: config.mail.pass
                }
            });
        
            let mailOptions = {
              from: '"Irembo" <' + config.mail.user + '>', 
              to: config.mail.user,
              subject: 'Verify Email', 
              text: 'Verify Email', 
              html: 'Hi! <br><br> Thanks for your registration<br><br>'+
              '<a href='+ config.host.url + ':' + config.host.port +'/auth/email/verify/'+ model.emailToken + '>Click here to activate your account</a>'  // html body
            };
        
            var sent = await new Promise<boolean>(async function(resolve, reject) {
              return await transporter.sendMail(mailOptions, async (error, info) => {
                  if (error) {      
                    console.log('Message sent: %s', error);
                    return reject(false);
                  }
                  console.log('Message sent: %s', info.messageId);
                  resolve(true);
              });      
            })
    
            return sent;
        } else {
          throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
        }
      }
      async createEmailToken(email: string): Promise<boolean> {
        //var emailVerification = await this.userService.findByEmail(email); 
      
        // if (emailVerification && ( (new Date().getTime() - emailVerification.timestamp.getTime()) / 60000 < 15 )){
        //   throw new HttpException('LOGIN.EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
        // } else {
          var emailVerificationModel = await this.userService.updateEmailToken(email)
          
          return true;
        }
        async createForgottenPasswordToken(email: string): Promise<ForgottenPassword> {
           
            // if (forgottenPassword && ( (new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000 < 15 )){
            //   throw new HttpException('RESET_PASSWORD.EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
            // } else {
              var forgottenPasswordModel = await this.userService.updatePasswordToken(email)
              var forgottenPassword= await this.userService.findByEmail(email);
              if(forgottenPasswordModel){
                console.log(`This is the current password token${forgottenPassword.passwordToken}`)
                return forgottenPassword;
              } else {
                throw new HttpException('LOGIN.ERROR.GENERIC_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
              }
            }
            async sendEmailForgotPassword(email: string): Promise<boolean> {
              var userFromDb = await this.userService.findByEmail(email);
              if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
          
              var tokenModel = await this.createForgottenPasswordToken(email);
              if(tokenModel && tokenModel.passwordToken){
                  let transporter = nodemailer.createTransport({
                      host: config.mail.host,
                      port: config.mail.port,
                      secure: config.mail.secure, // true for 465, false for other ports
                      auth: {
                          user: config.mail.user,
                          pass: config.mail.pass
                      }
                  });
              
                  let mailOptions = {
                    from: '"Irembo" <' + config.mail.user + '>', 
                    to: email, // list of receivers (separated by ,)
                    subject: 'Forgotten Password', 
                    text: 'Forgot Password',
                    html: 'Hi! <br><br> If you requested to reset your password<br><br>'+
                    '<a href='+ config.host.url + ':' + 3001 +'/reset-password?token='+ tokenModel.passwordToken + '>Click here</a>'  // html body
                  };
              
                  var sent = await new Promise<boolean>(async function(resolve, reject) {
                    return await transporter.sendMail(mailOptions, async (error, info) => {
                        if (error) {      
                          console.log('Message sent: %s', error);
                          return reject(false);
                        }
                        console.log('Message sent: %s', info.messageId);
                        resolve(true);
                    });      
                  })
          
                  return sent;
              } else {
                throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
              }
            }
          

        async verifyEmail(token: string): Promise<boolean> {
            var emailVerif = await this.userService.findOneToken(token);
            if(emailVerif && emailVerif.email){
              var userFromDb = await this.userService.findByEmail(emailVerif.email);
              if (userFromDb) {
                var savedUser = await this.userService.verifyEmail(userFromDb.email);
                return !!savedUser;
              }
            } else {
              throw new HttpException('LOGIN.EMAIL_CODE_NOT_VALID', HttpStatus.FORBIDDEN);
            }
          }
          async checkPassword(email: string, password: string){
            var userFromDb = await this.userService.findByEmail(email);
            if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
        
            return await bcrypt.compare(password, userFromDb.password);
          }
        
          
          }
