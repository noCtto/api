import Moleculerjs from 'moleculer';
import type { Context } from 'moleculer';
import type { AccountThis } from '../accounts.service';

const { MoleculerClientError } = Moleculerjs.Errors;

interface Params {
  username: string;
  password: string;
  environment: string;
  fingerprint?: string;
}

export default {
  rest: 'POST /forceLogout',
  cache: false,
  params: {
    username: { type: 'string' },
    password: { type: 'string', min: 35 },
    environment: { type: 'string' },
    fingerprint: {
      type: 'string',
      default: 'localhost',
      optional: true,
    },
  },
  async handler(this: AccountThis, ctx: Context<Params>): Promise<any> {
    const { username } = ctx.params;
    
    const user = await this._find(ctx, {
      query: {
        username: { $regex: username },
      },
    });

    if (!user) {
      throw new MoleculerClientError('No user found', 400, 'Error2');
    }

    return ctx
      .call('accounts.logout', { id: user._id })
      .then(() => ({
        msg: 'Ok!',
      }))
      .catch(() => ({ msg: 'Ok!' }));
  },
};
