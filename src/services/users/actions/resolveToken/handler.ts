import jwt from 'jsonwebtoken';
import { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import type { Params } from './params'

export default async function handler(this: MicroService, ctx: Context<Params>): Promise<any> {
  const decoded = await new Promise((resolve, reject) => {
    this.logger.debug('users.actions.resolveToken', ctx.params);
    jwt.verify(ctx.params.token, "myLittleSecret", (err: any, tokenDecoded: any) => {
      if (err) {
        this.logger.error('Error resolving token', err);
        return reject(tokenDecoded);
      }
      this.logger.error('Error resolving token');
      return resolve(tokenDecoded);
    });
  });
  this.logger.debug('Decoded', decoded);
  return decoded;
};
