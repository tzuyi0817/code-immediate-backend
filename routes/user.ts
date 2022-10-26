import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/user/:id', (req: Request, res: Response) => {
  return res.send('get user');
});

router.post('/api/user/:id', (req: Request, res: Response) => {
  return res.send('post user');
});

export { router as userRouter };
