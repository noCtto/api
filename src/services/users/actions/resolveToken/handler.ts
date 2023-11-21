import jwt from 'jsonwebtoken';
import { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';
import type { Params } from './params'

export default async function handler(this: MicroService, ctx: Context<Params>): Promise<any> {
  const decoded = await new Promise((resolve, reject) => {
    this.logger.debug('users.actions.resolveToken', ctx.params);
    jwt.verify(ctx.params.token, "myLittleSecret", (err: any, tokenDecoded: any) => {
      this.logger.info('users.actions.verify.response', err, tokenDecoded )
      if (err) {
        this.logger.error('users.actions.verify.response err:', err);
        return reject(tokenDecoded);
      }
      this.logger.info('users.actions.verify.response.decoded', tokenDecoded);
      return resolve(tokenDecoded);
    });
  });
  this.logger.debug('users.actions.verify.response.decoded.result', decoded);
  return decoded;
};
