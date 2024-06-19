import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerClientError } = MoleculerErrors;

export default {
  rest: 'POST /leave',
  params: { id: { type: 'string', convert:true } },
  async handler(
    this: MicroService,
    ctx: Context & { params: { id: string } }
  ) {

    try {
        const user = this.extractUser(ctx)
        const { id } = ctx.params;
    
        if (!user) return Promise.resolve("Ok!")
        const community = await this._get(ctx, { id })
        if (!community) return Promise.resolve("Ok!")
    
        const subscriber = await this.subscribed(ctx, id, user)
        if (!subscriber) return Promise.resolve("Ok!")
    
        await this.unsubscribe(ctx, id, user)

    } catch (err) {
      return Promise.reject(new MoleculerClientError('Error leaving community',500,'communities'))
    }
  },
};
