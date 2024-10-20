import mongoose from 'mongoose';
import crypto from 'crypto';

export interface UserAttrs {
  id?: string;
  name: string;
  email: string;
  role?: string;
  hash: string;
  salt: string;
  registrationDate: Date;
}

export interface UserDoc extends mongoose.Document {
  id: string;
  name: string;
  email: string;
  role?: string;
  hash: string;
  salt: string;
  registrationDate: Date;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomUUID(),
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    required: true,
  },
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.index({ '$**': 'text' });

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
