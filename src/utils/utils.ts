import dotenv from 'dotenv';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { UserDoc } from '../models/user.model';

dotenv.config();

function validPassword(password: string, hash: string, salt: string) {
  let hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
}

function genPassword(password: string) {
  let salt = crypto.randomBytes(32).toString('hex');
  let genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return {
    salt: salt,
    hash: genHash,
  };
}

function issueJWT(user: UserDoc) {
  let expiresIn = '2d';
  let JWT_KEY = process.env.JWT_KEY;
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
      expires: expiresIn,
    },
    JWT_KEY as string
  );

  return {
    token: userJwt,
    expires: expiresIn,
  };
}

export { validPassword, genPassword, issueJWT };
