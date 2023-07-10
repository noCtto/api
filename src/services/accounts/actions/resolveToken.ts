import jwt from 'jsonwebtoken';
import { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

interface Params {
  token: string;
}

export default {
  params: {
    token: 'string',
  },
  async handler(this: MicroService, ctx: Context<Params>): Promise<any> {
    const decoded = await new Promise((resolve, reject) => {
      console.log('Resolving token', ctx.params);
      jwt.verify(ctx.params.token, 'secret', (err: any, tokenDecoded: any) => {
        if (err) {
          console.log('Error resolving token');
          this.logger.error(err.message);
          return reject(tokenDecoded);
        }
        console.log('Error resolving token');
        return resolve(tokenDecoded);
      });
    });
    console.log('Decoded', decoded);
    return decoded;
  },
};
