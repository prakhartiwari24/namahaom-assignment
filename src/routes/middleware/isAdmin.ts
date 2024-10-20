import { Response, NextFunction } from 'express';

import { AuthenticatedRequest } from '../../utils/interface';

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({
      message: 'Access denied. Admins only',
    });
    return;
  }
  next();
}
