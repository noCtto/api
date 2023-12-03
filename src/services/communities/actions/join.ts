import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
// import type { ObjectId } from 'mongodb'

type Params = {
  id: string
}

const params = {
  id: {
    type: 'string',
    required: true
  }
}

export default {
  rest: 'POST /join',
  params,
  async handler(
    this: MicroService,
    ctx: Context & { params: Params }
  ) {
    const user = this.extractUser(ctx)
    const { id } = ctx.params;

    const community:any = await this._get(ctx, { id, populate:['join'] })

    if (!community) {
      return Promise.reject(Error('Community not found'))
    }

    if (community.joined) {
      return Promise.resolve(community.joined)
    }

    const join = await ctx.call('subscribers.create', { 
      target: id,
      uid: user
    })

    return join
    
  },
};
