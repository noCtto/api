import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
// import type { ObjectId } from 'mongodb'

import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerClientError } = MoleculerErrors;

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
  rest: 'POST /subscribe',
  params,
  async handler(
    this: MicroService,
    ctx: Context & { params: Params }
  ) {
    try{

      const user = this.extractUser(ctx)
      const { id } = ctx.params;
  
      const community:any = await this._get(ctx, { id, populate:['join'] })
  
      if (!community) {
        return Promise.reject(new MoleculerClientError('Community not found',404,'communities'))
      }
  
      if (community.joined) {
        return Promise.resolve({ success: community.joined })
      }
  
      await this.broadcast(ctx, 'subscribed', { target: id, uid: user })
      return Promise.resolve({ success: true })

    } catch (err) {
      return Promise.reject(new MoleculerClientError('Error subscribing to community',500,'communities'))
    }
  },
};
