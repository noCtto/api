
import jwt from 'jsonwebtoken';
import { AccountThis } from '../accounts.service';

export default function generateJWT(this:AccountThis, _ctx: any, userId:any, expires:any) {  
  return jwt.sign(
    {
      id: userId,
      exp: expires,
    },
  'secret'
  );
};
