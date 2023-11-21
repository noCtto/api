import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';
import type { Params } from './params';
import type { User } from '../../entities';

export default async function handler(
  this: MicroService,
  ctx: Context<Params>
): Promise<any> {
  const userId = ctx.params.uid1 || this.extractUser(ctx);
  const targetId = ctx.params.uid2;

  const user: User = await ctx.call('users.get', {
    id: userId,
    fields: ['_id'],
  });
  const target: User = await ctx.call('users.get', {
    id: targetId,
    fields: ['_id', 'following'],
  });

  let following = false;


  if (!target.subscribers) {
    target.subscribers = {
      [user._id]: true,
    };
  } else {
    following = target.subscribers[user._id] === true;
    target.subscribers[user._id] = following ? true : false;
  }
  return this._update(ctx, {
    _id: target._id,
    subscribers: {
      ...target.subscribers,
    },
  });
}
