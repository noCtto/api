
import jwt from 'jsonwebtoken';
import { Context } from 'moleculer';
import type { AccountThis } from '../accounts.service';

interface Params {
  token: string;
}

export default {
  params: {
    token: 'string',
  },
  async handler(this: AccountThis, ctx: Context<Params>): Promise<any> {
    const decoded = await new Promise((resolve) => {
      jwt.verify(ctx.params.token, this.settings.JWT_SECRET, (err:any, tokenDecoded:any) => {
        if (err) {
          this.logger.error(err.message);
          return resolve(tokenDecoded);
        }
        return resolve(tokenDecoded);
      });
    });
    return decoded;
  },
};
