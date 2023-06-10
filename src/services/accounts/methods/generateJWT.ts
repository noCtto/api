
import jwt from 'jsonwebtoken';
import type { MicroService } from '@lib/microservice';

export default function generateJWT(this:MicroService, _ctx: any, userId:any, expires:any) {  
  return jwt.sign(
    {
      id: userId,
      exp: expires,
    },
  'secret'
  );
};
