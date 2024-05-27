
import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import MoleculerJs from 'moleculer';

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

    const card = await this._get(ctx, { id: String(id) })

    if (!card) return Promise.reject(new ValidationError('error', 'voting card not found'))

    await this.vote(ctx, card, uid, d);

    return this._get(ctx, { id: String(id), populate: ['result'] })

  },
};
