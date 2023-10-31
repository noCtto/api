import type { Context } from 'moleculer';
import { MicroService } from '@lib/microservice';
import type { Params } from './params';

export default async function handler(this: MicroService, ctx: Context<Params>): Promise<any> {
  
  const { user } = ctx.params;
  
  return this._find(ctx, {
    query: { user }
  }).then((sessions: any) => {
    const session = sessions[0];
    if (!session) return Promise.resolve(sessions);

    return this.remove({ id: session._id })
      .then((json: any) => this.entityChanged('updated', json, ctx) )
  })
}