import Moleculerjs from 'moleculer';
import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';
import type { Params } from './params';

const { MoleculerClientError } = Moleculerjs.Errors;

export default async function handler(
  this: MicroService,
  ctx: Context<Params>
): Promise<any> {
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
    .call('users.logout', { id: user._id })
    .then(() => ({
      msg: 'Ok!',
    }))
    .catch(() => ({ msg: 'Ok!' }));
}
