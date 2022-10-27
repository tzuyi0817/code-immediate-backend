import express from 'express';
import userController from '../controllers/userController';

const router = express.Router();

router.post('/api/login', userController.login);
router.post('/api/register', userController.register);
router.post('/api/logout', userController.logout);

export { router as userRouter };
