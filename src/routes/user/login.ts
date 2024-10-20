import express from 'express';
import { Request, Response } from 'express';
const router = express.Router();
import { body, query, validationResult } from 'express-validator';
import UserService from '../../service/user.service';

const userService = new UserService();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    const { email, password } = req.body;
    try {
      const result = await userService.login({ email, password });
      res.status(200).send(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);

export { router as loginRouter };
