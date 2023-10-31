import type { MicroService } from '@lib/microservice';
import type { Context } from 'moleculer';
// import {Errors} from 'moleculer';
// const { MoleculerClientError } = Errors;

interface Params {
  username: string;
}

export default  async function handler(this: MicroService, ctx: Context<Params>): Promise<any> {
  const { username } = ctx.params;
  this.logger.info('Logout', ctx.params);
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
      if (!session) return Promise.resolve(sessions);
      return ctx
        .call('sessions.remove', {
          id: session._id,
        })
        .then((json) => {
          this.entityChanged('updated', json, ctx);
        });
    });
};
