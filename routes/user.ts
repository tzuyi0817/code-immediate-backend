import express from 'express';
import passport from '../config/passport';
import userController from '../controllers/userController';

const router = express.Router();

router.post('/api/login', userController.login);
router.get('/api/github', passport.authenticate('github'));
router.get('/api/github/callback', passport.authenticate('github', { session: false }), userController.github);
router.post('/api/register', userController.register);
router.post('/api/logout', userController.logout);

export { router as userRouter };
