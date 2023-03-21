import type { Context } from "moleculer";
import { AccountThis } from '../accounts.service';
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
  async handler(this: AccountThis, ctx: Context<Params>): Promise<any> {
    const userId = ctx.params.uid1 || this.extractUser(ctx);
    const targetId = ctx.params.uid2;
    const user:any = await ctx.call('users.get', { id: targetId, fields: ['_id', 'followers'] });

    let following = false;
    if (!user.followers) {
      user.followers = {
        [userId]: 1,
      };
    } else {
      following = user.followers[userId];
      user.followers[userId] = following ? 0 : 1;
    }
    return this._update(ctx, {
      _id: user._id,
      followers: {
        ...user.followers,
      },
    });
  },
};
