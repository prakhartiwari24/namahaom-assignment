import express, { Request, Response } from 'express';
import { authenticateJWT } from '../middleware/isLoggedIn';
import { requireAdmin } from '../middleware/isAdmin';
import AdminService from '../../service/admin.service';

const router = express.Router();
const adminService = new AdminService();

router.delete(
  '/users/:userId',
  [authenticateJWT, requireAdmin],
  async (req: any, res: Response): Promise<void> => {
    const { userId } = req.params;
    const adminId = req.user?._id.toString();

    try {
      await adminService.deleteUser(adminId, userId);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
);

export { router as deleteUserRouter };
