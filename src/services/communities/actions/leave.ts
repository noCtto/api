import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import { ObjectId } from 'mongodb';


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
  rest: 'POST /leave',
  params,
  async handler(
    this: MicroService,
    ctx: Context & { params: Params }
  ) {
    const user = this.extractUser(ctx)
    const { id } = ctx.params;

    const subscriber:any = await ctx.call('subscribers.find', {
      query: {
        uid: user,
        target: new ObjectId(id),
      }
    });

    if (!subscriber) return "Ok!"
    return ctx.call('subscribers.remove', { id: subscriber[0]._id })
  },
};
