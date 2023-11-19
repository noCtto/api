import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';


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

    return this._get(ctx, { id, populates: ['joined'] }).then((resp:any)=>{
      this.logger.debug('communities.actions.join.get.response', resp)

      if (!resp.subscribers) {
        resp.subscribers = {}
      }

      if (resp.subscribers && !resp.subscribers[String(user)]) {
        return this._update(ctx, {
          id: String(resp._id), 
          subscribers: {
            ...resp.subscribers,
            [String(user)]: new Date()
          },
        })
      }
      return resp
    }).then((community:any) => {

      const { subscribers } = community;
      community.subscribers = Object.keys(subscribers).length
      community.joined  = subscribers[String(user)] !== undefined

      return community
    })
  },
};
