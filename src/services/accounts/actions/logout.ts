import type { MicroService } from '@lib/microservice';
import type { Context } from 'moleculer';

interface Params {
  username: string;
}

export default {
  rest: 'POST /logout',
  cache: false,
  params: {
    username: { type: 'string' },
  },
  async handler(this: MicroService, ctx: Context<Params>): Promise<any> {
    const { username } = ctx.params;
    this.logger.info('Logout');
    const user = await this.getByUsername(ctx, username);
    if (!user) throw new Error('User not found');

    return ctx
      .call('sessions.find', {
        query: {
          user: user._id,
        },
      })
      .then((sessions: any) => {
        const session = sessions[0];
        if (!session) return this.resolve({ msg: 'Ok!' });
        return ctx
          .call('sessions.remove', {
            id: session._id,
          })
          .then((json) => {
            this.entityChanged('updated', json, ctx);
          });
      });
  },
};
