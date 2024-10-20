import { User, UserDoc } from '../models/user.model';
import { LoginPayload, UserPayload } from '../utils/interface';
import logger from '../utils/logger';
import { genPassword, issueJWT, validPassword } from '../utils/utils';
import crypto from 'crypto';

export default class UserService {
  async register(params: UserPayload) {
    const existingUser = await User.findOne({ email: params.email });
    if (existingUser) {
      logger.log('error', `email: ${params.email} - Email already in use`);
      throw new Error('Email in use');
    }
    const saltHash = genPassword(params.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const role = params.role;
    const userRole = role && role === 'ADMIN' ? 'ADMIN' : 'USER';
    const newUser = {
      name: params.name,
      email: params.email.toLowerCase(),
      registrationDate: new Date(),
      role: userRole,
      hash: hash,
      salt: salt,
    };
    const userObj = User.build(newUser);
    await userObj.save();
    return {
      message: 'Registration successful',
    };
  }

  async login(params: LoginPayload) {
    let { email, password } = params;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      logger.log('info', `email : ${email} not found`);
      throw new Error('User not found');
    }
    const isValid = validPassword(password, user.hash, user.salt);
    if (isValid) {
      const tokenObject = issueJWT(user);
      logger.log('info', `email : ${email} -logged in`);
      return this.sendUserObj(user, tokenObject);
    } else {
      logger.log('info', `email : ${email} - Password Incorrect`);
      throw new Error('Password Incorrect');
    }
  }

  private sendUserObj(
    user: UserDoc,
    tokenObject: { token: any; expires: any }
  ) {
    let respObj = {
      success: true,
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
      email: user.email,
      id: user.id,
    };
    return respObj;
  }
}
