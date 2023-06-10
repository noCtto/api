import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';
export interface Params {
	uid1?: string;
  uid2: string;
}

export default {
  rest: 'POST /follow',
  params: {
    uid1: {
      type: 'string',
      optional: true,
    },
    uid2: {
      type: 'string',
      required: true,
    },
  },
  async handler(this: MicroService, ctx: Context<Params>): Promise<any> {
    
    const userId = ctx.params.uid1 || this.extractUser(ctx);
    const targetId = ctx.params.uid2;
    
    const user:any = await ctx.call('accounts.get', { id: userId, fields: ['_id'] });
    const target:any = await ctx.call('accounts.get', { id: targetId, fields: ['_id', 'following'] });

    let following = false;
    if (!target.followers) {
      target.followers = {
        [user._id]: 1,
      };
    } else {
      following = target.followers[user._id] === 1;
      target.followers[user._id] = following ? 0 : 1;
    }
    return this._update(ctx, {
      _id: target._id,
      followers: {
        ...target.followers,
      },
    });
  },
};
