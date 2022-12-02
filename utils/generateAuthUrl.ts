import jwt from 'jsonwebtoken';
import type { User } from '../types/user';

export function generateAuthUrl(user: User) {
  const { JWT_SECRET, WEBSITE_URL } = process.env
  const token = jwt.sign({ id: user.id }, JWT_SECRET!);

  return `${WEBSITE_URL}?token=${token}&id=${user.id}&account=${user.account.replace('_GITHUB_AUTH', '')}`;
}