import type { AccountThis } from '../accounts.service';
import type { Context } from 'moleculer';


export interface ActionResetPasswordParams {
  username: string;
}

export default {
  rest: 'POST /change/password',
  cache: false,
  params: {
    username: { type: 'string' },
  },
  async handler(this: AccountThis, ctx: Context<ActionResetPasswordParams>): Promise<any> {
    
    const { username } = ctx.params;

    const user:any = await this.getByUsername(username, ctx);
    
    if (!user) throw new Error('User not found');

    return ctx
      .call('sessions.find', {
        query: {
          user: user._id,
        },
      })
      .then((sessions:any) => {
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
