
import type { Context } from 'moleculer';
import type { MicroService } from '@/lib/microservice';
import MoleculerJs from 'moleculer';
import { ObjectId } from 'mongodb';

const { ValidationError } = MoleculerJs.Errors;

export default {
  rest: 'POST /vote',
  params: {
    id: { 
      type: 'string'
    },
    d: {
      type: 'boolean',
      optional: false,
      convert: true,
    },
  },
  async handler(this: MicroService, ctx: Context & { params: any }) {
    this.logger.debug('votes.actions.vote', ctx.params )
    const { id, d } = ctx.params;

    const uid = this.extractUser(ctx);
    if (!uid) return Promise.reject(new ValidationError('no user'));

    const card = await this._get(ctx, { id: String(id), populate: ['result'] })

    if (!card) return Promise.reject(new ValidationError('error', 'not found'))

    
    const voted:any = await ctx.call('voters.voted', { target: card._id, uid });
    
    let vote:any = null;
    if (voted) {
      vote = await ctx.call('voters.update', { 
        id: new ObjectId(voted._id), 
        d: voted.d == d ? null : d,
        updatedAt: new Date()
      })
    } else {
      vote = await ctx.call('voters.create', { target: card._id, uid, d })
    }
    return this._get(ctx, {id: card._id , populate:['result']}).then((data:any) => {
      return { 
        ...vote, 
        result: data.result 
      }
    })
  },
};
