import express from 'express';
const router = express.Router();
import { registerRouter, loginRouter, profileRouter } from './user';
import {
  adminUserRouter,
  adminGetUsersRouter,
  updateUserRouter,
  deleteUserRouter,
} from './admin';

router.use('/api', registerRouter);
router.use('/api', loginRouter);
router.use('/api', profileRouter);

router.use('/api/admin', adminUserRouter);
router.use('/api/admin', adminGetUsersRouter);
router.use('/api/admin', updateUserRouter);
router.use('/api/admin', deleteUserRouter);

router.get('/health', (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date(),
  };

  res.status(200).send(data);
});

router.all('*', async (req, res) => {
  res.status(404).send('Not found');
});

export { router };
