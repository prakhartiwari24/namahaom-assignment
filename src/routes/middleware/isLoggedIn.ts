import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user.model';
import { AuthenticatedRequest } from '../../utils/interface';
import logger from '../../utils/logger';

export async function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({
      message: 'Access denied. No token provided',
    });
    return;
  }
  try {
    const JWT_TOKEN = process.env.JWT_KEY as string;
    const decoded: any = jwt.verify(token, JWT_TOKEN);
    const user = await User.findOne({ id: decoded.id });
    if (!user) {
      res.status(404).json({
        message: 'User not found',
      });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({
      message: 'Invalid token',
    });
    logger.info('Error', err);
  }
}
