import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';

export default {
  rest: 'GET /:id',
  async handler(
    this: MicroService,
    ctx: Context & { params: any }
  ) {

    const { user } = ctx.params;
    
    if (!user) {
      throw new Error('User not found');
    }

    return this._find(ctx, { 
      uid: String(user), 
      fields: ['_id','balance'] 
    })
    .then(([wallet]:any)=> ({ id:wallet._id, balance: wallet.balance }) );
  },
};
