import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { ERROR_MAP, ErrorKey } from '../config/error';
import { generateAuthUrl } from '../utils/generateAuthUrl';

const userController = {
  async login(req: Request, res: Response) {
    const { account, password } = req.body;

    if (!account || !password)
      return res.status(400).json({ status: 'error', message: 'Please enter account and password' });
    
    const user = await User.findOne({ account });

    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(400).json({ status: 'error', message: 'Incorrect account or password' });

    return res.json({
      status: 'success',
      message: 'login success',
      resultMap: {
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET!),
        user: {
          id: user.id,
          account: user.account.replace('_GITHUB_AUTH', ''),
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
      .then(user => {
        return res.json({
          status: 'success',
          message: 'register success',
          resultMap: {
            token: jwt.sign({ id: user.id }, process.env.JWT_SECRET!),
            user: {
              id: user.id,
              account: user.account,
            },
          },
        })
      })
      .catch(error => {
        return res.status(400).json({
          status: 'error',
          message: ERROR_MAP[error.code as ErrorKey] ?? error.message,
        });
      });
  },
  logout(req: Request, res: Response) {
    req.logout((error) => {
      return error
        ? res.status(400).json({ status: 'error', message: ERROR_MAP[error.code as ErrorKey] ?? error.message })
        : res.json({ status: 'success', message: 'successfully logout' })
    });
  },
  async github(req: Request, res: Response) {
    if (!req.user) {
      return res.status(400).json({
        status: 'error',
        message: 'account or password incorrect',
      });
    }
    const { username } = req.user;
    const account = `${username}_GITHUB_AUTH`;
    const user = await User.findOne({ account });

    if (user) return res.redirect(generateAuthUrl(user));
  
    const randomPassword = Math.random().toString(36).slice(-8);

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(randomPassword, salt, async (err, hash) => {
        const newUser = new User({ account, password: hash });
        const user = await newUser.save();

        res.redirect(generateAuthUrl(user));
      })
    });
  }
};

export default userController;
