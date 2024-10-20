import express, { Request, Response } from 'express';
import { authenticateJWT } from '../middleware/isLoggedIn';
import { requireAdmin } from '../middleware/isAdmin';
import AdminService from '../../service/admin.service';
import { AuthenticatedRequest } from '../../utils/interface';

const router = express.Router();
const adminService = new AdminService();

router.get(
  '/users',
  [authenticateJWT, requireAdmin],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10, name, email, role } = req.query;
      const result = await adminService.getUsers({
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        name: name as string,
        email: email as string,
        role: role as string,
      });

      res.status(200).json(result);
    } catch (err: any) {
      res
        .status(500)
        .json({ message: 'An error occurred while fetching users' });
    }
  }
);

export { router as adminGetUsersRouter };
