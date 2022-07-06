import { Injectable } from '@nestjs/common';
import { User } from 'src/user/models/entity/user.entity';
import { UserService } from 'src/user/user.service';
import {default as config} from '../config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JWTService {
    constructor(
        private userService: UserService
        
        ) {}


  async createToken(email, roles) {
    const expiresIn = config.jwt.expiresIn,
      secretOrKey = config.jwt.secretOrKey;
    const userInfo = { email: email, roles: roles};
    const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token,
    };
  }

  async validateUser(signedUser): Promise<User> {
    var userFromDb = await this.userService.findByEmail(signedUser.email);
    if (userFromDb) {
        return userFromDb;
    }
    return null;
  }

}