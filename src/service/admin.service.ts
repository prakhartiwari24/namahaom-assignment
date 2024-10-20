import { User, UserDoc } from '../models/user.model';
import { LoginPayload, UserPayload } from '../utils/interface';
import logger from '../utils/logger';
import { genPassword, issueJWT, validPassword } from '../utils/utils';
import crypto from 'crypto';

export default class AdminService {
  async createUser(params: UserPayload) {
    const existingUser = await User.findOne({ email: params.email });
    if (existingUser) {
      logger.log('error', `email: ${params.email} - Email already in use`);
      throw new Error('Email in use');
    }
    const role = params.role;
    const userRole = role && role === 'ADMIN' ? 'ADMIN' : 'USER';
    const saltHash = genPassword(params.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
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
      message: 'User created successfully',
    };
  }

  async getUsers({
    page = 1,
    limit = 10,
    name,
    email,
    role,
  }: {
    page?: number;
    limit?: number;
    name?: string;
    email?: string;
    role?: string;
  }) {
    const query: any = {};
    if (name) {
      query.name = { $regex: new RegExp(name, 'i') };
    }
    if (email) {
      query.email = { $regex: new RegExp(email, 'i') };
    }
    if (role) {
      query.role = role;
    }
    const pageNum = page || 1;
    const limitNum = limit || 10;
    console.log('🚀 ~ AdminService ~ query:', query);
    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-id -salt -hash -__v')
      .sort({ name: 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    return {
      totalUsers,
      totalPages: Math.ceil(totalUsers / limitNum),
      currentPage: pageNum,
      users,
    };
  }

  async updateUser(
    userId: string,
    updateData: { name?: string; email?: string; role?: string }
  ): Promise<any> {
    const { name, email, role } = updateData;

    if (email) {
      const existingUser = (await User.findOne({ email })) as UserDoc | any;
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new Error('Email already in user');
      }
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  async deleteUser(adminId: string, userId: string): Promise<void> {
    if (adminId === userId) {
      throw new Error('Admins cannot delete their own account');
    }
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('User not found');
    }
  }
}
