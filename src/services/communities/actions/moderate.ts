import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
// import type { ObjectId } from 'mongodb'

import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerClientError } = MoleculerErrors;


type Params = {
  id: string,
  userTarget: string,
}

const params = {
  id: {
    type: 'string',
    required: true
  },
  userTarget: {
    type: 'string',
    required: true,
  },
}

export default {
  rest: 'POST /moderate',
  params,
  async handler(
    this: MicroService,
    ctx: Context & { params: Params }
  ) {
        
    try{

      const { id } = ctx.params;
      const user = this.extractUser(ctx);

      if (!user) {
        return Promise.reject(new MoleculerClientError('User not found',404,'communities'))
      }

      const community:any = await this._get(ctx, { id })
      if (!community) {
        return Promise.reject(new MoleculerClientError('Community not found',404,'communities'))
      }

      await this.moderate(ctx, id, user)

    } catch(err) {
      return Promise.reject(new MoleculerClientError('Error moderating community',500,'communities'))
    }
    
  },
};
