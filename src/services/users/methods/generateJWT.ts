import jwt from 'jsonwebtoken';
import type { MicroService } from '@/lib/microservice';

export default function generateJWT(
  this: MicroService,
  _ctx: any,
  user: any,
  expires: any
) {
  this.logger.info('Generating JWT', user, expires)

  const addTime = 60 * 10; // 10 MIN
  const today = new Date();

  const exp = (Math.floor(today.getTime() / 1000) + addTime) * 1000;

  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      exp: exp,
    },
    'myLittleSecret'
  );
}
