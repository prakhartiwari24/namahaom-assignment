import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateJWT } from '../middleware/isLoggedIn';
import { requireAdmin } from '../middleware/isAdmin';
import AdminService from '../../service/admin.service';

const router = express.Router();
const adminService = new AdminService();

router.post(
  '/users',
  [
    authenticateJWT,
    requireAdmin,
    body('email').isEmail().withMessage('Email must be valid'),
    body('name').notEmpty().withMessage('Name is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  async (req: any, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, role } = req.body;
    try {
      const result = await adminService.createUser({
        name,
        email,
        password,
        role,
      });
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

export { router as adminUserRouter };
