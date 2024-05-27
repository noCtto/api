import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
// import type { ObjectId } from 'mongodb'
import { MoleculerClientError } from '../../../utils/error';

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
  rest: 'POST /join',
  params,
  async handler(
    this: MicroService,
    ctx: Context & { params: Params }
  ) {
    console.log( 'communities.actions.moderate' , ctx.params )
    
    try{

      const { id, userTarget } = ctx.params;
      const community:any = await this._get(ctx, { id })
  
      
      if (!community) {
        return Promise.reject(new MoleculerClientError('Community not found',404,'communities'))
      }

      const join = await ctx.call('moderators.create', { 
        target: id,
        userTarget: userTarget,
      })
      return join

    } catch(err) {
      console.log(err)
      return Promise.reject(err)
    }
    
  },
};
