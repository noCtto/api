import type { MicroService } from '@/lib/microservice';
import type { Context } from 'moleculer';
import {Errors} from 'moleculer';
const { MoleculerClientError } = Errors;

interface Params {
  username: string;
}

export default  async function handler(this: MicroService, ctx: Context<Params>): Promise<any> {
  this.logger.debug('users.actions.logout', ctx.params );

  const user = await this.getByUsername(ctx);
  this.logger.info('users.actions.logout.user', user)
  if (!user) throw new MoleculerClientError('User not found', 404);

  return ctx
    .call('sessions.logout', {
      query: {
        user: user._id,
      },
    })
    .catch((err) => {
      this.logger.error('session.actions.logout.error:', err)
      return Promise.resolve(err)
    })
};
