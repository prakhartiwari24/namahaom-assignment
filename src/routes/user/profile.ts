import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();

import { authenticateJWT } from '../middleware/isLoggedIn';
import UserService from '../../service/user.service';
import { AuthenticatedRequest } from '../../utils/interface';

const userService = new UserService();

router.get(
  '/profile',
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      res.status(404).json({
        message: 'User not found',
      });
      return;
    }
    res.status(200).json({
      email: user.email,
      name: user.name,
      registrationDate: user.registrationDate,
    });
  }
);

export { router as profileRouter };
