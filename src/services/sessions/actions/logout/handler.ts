import type { Context } from 'moleculer';
import { MicroService } from '@/lib/microservice';
import type { Params } from './params';

export default async function handler(this: MicroService, ctx: Context<Params>): Promise<any> {
  this.logger.debug('sessions.actions.logout', ctx.params )
  
  const { _id } = ctx.params;
  
  return this._remove( ctx, {
    query: { user: _id }
  })
}