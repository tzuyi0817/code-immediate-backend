import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';

const userController = {
  async login(req: Request, res: Response) {
    const { account, password } = req.body;

    if (!account || !password)
      return res.status(400).json({ status: 'error', message: 'Please enter account and password' });
    
    const user = await User.findOne({ account });

    if (!user)
      return res.status(400).json({ status: 'error', message: 'Could not find this user' });
    
    if (!bcrypt.compareSync(password, user.password))
      return res.status(400).json({ status: 'error', message: 'Incorrect password' });
  
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);

    return res.json({
      status: 'success',
      message: 'login success',
      resultMap: {
        token,
        user: {
          id: user.id,
          account: user.account,
        },
      },
    });
  },
  register(req: Request, res: Response) {
    const { account, password, confirmPassword } = req.body;

    if (!account || !password || !confirmPassword)
      return res.status(400).json({ status: 'error', message: 'missing information' });

    if (password !== confirmPassword)
      return res.status(400).json({ status: 'error', message: 'password and confirmPassword are not the same' });
    
    const newUser = new User({
      account,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });

    newUser
      .save()
      .then(() => res.json({ status: 'success', message: 'register success' }))
      .catch(error => res.status(400).json({ status: 'error', message: error.message }));
  },
  logout(req: Request, res: Response) {
    req.logout((error) => {
      return error
        ? res.status(400).json({ status: 'error', message: error.message })
        : res.json({ status: 'success', message: 'successfully logout' })
    });
  }
};

export default userController;