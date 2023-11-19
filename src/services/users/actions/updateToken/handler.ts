import { ObjectId } from 'mongodb';
import { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import type { Params } from './params'



export default async function handler(this: MicroService, ctx: Context<Params>): Promise<any> {
  this.logger.info('users.actions.updateToken', ctx.params );
  const { userId } = ctx.params;
  
  const query = {
    user: userId,
  };

  return this._find(ctx, {
    query: {
      _id: new ObjectId(userId),
    },
    populate: ['permissions', 'companies'],
  }).then(([user]: any) =>
    ctx
      .call('sessions.find', { query, sort: '-createdAt' })
      .then(async (sessions: any) => {
        if (sessions && sessions.length === 0)
          throw Error('You are not logged, try login again.');

        const addTime = 0;
        const now = new Date();
        const exp = (Math.floor(now.getTime() / 1000) + addTime) * 1000;
        const token = this.generateJWT(ctx, user._id, exp);

        const ss = await ctx
          .call('sessions.update', {
            _id: sessions[0]._id,
            token,
            expires: new Date(exp),
          })
          .then((json) => this.entityChanged('updated', json, ctx));

        return {
          s: ss,
          token,
        };
      })
  );
}