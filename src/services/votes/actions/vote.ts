
import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import dayjs from 'dayjs';
import MoleculerJs from 'moleculer';
import type { Vote } from '@votes/entities';

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
    this.logger.info('votes.actions.vote', ctx.params )
    const { id, d } = ctx.params;

    const uid = this.extractUser(ctx);
    if (!uid) return Promise.reject(new ValidationError('no user'));

    const dateTime = dayjs().unix();
    return this._get(ctx, { id }).then((card: Vote) => {
      if (!card) Promise.reject(new ValidationError('error', 'number'));
      const { voters } = card;

      const currentVote = voters[String(uid)] || 0;
      const newVote = this.voteState(currentVote, d);
      
      return this._update(ctx, {
        id: card._id,
        voters: {
          ...voters,
          [String(uid)]: newVote,
        },
        updatedAt: dayjs().toDate(),
      })
        .then((json: any) =>
          this.transformDocuments(
            ctx,
            {
              populate: ['votes', 'count'],
              fields: ['_id', 'count', 'pid', 'tid', 'cid'],
            },
            { ...json }
          )
        )
        .then((v: any) => ({
          ...v,
          key: `${card._id}-${card.target}-${dateTime}-${uid}-vote`,
        }));
    });
  },
};
