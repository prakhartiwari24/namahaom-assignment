import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateJWT } from '../middleware/isLoggedIn';
import { requireAdmin } from '../middleware/isAdmin';
import AdminService from '../../service/admin.service';
import { AuthenticatedRequest } from '../../utils/interface';

const router = express.Router();
const adminService = new AdminService();

router.put(
  '/users/:userId',
  [
    authenticateJWT,
    requireAdmin,
    body('email').isEmail().optional().withMessage('Email must be valid'),
    body('name').notEmpty().optional().withMessage('Name is required'),
    body('role').optional().isIn(['USER', 'ADMIN']).withMessage('Invalid role'),
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { userId } = req.params;
    const { name, email, role } = req.body;

    try {
      const updatedUser = await adminService.updateUser(userId, {
        name,
        email,
        role,
      });
      res.status(200).json(updatedUser);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

export { router as updateUserRouter };
