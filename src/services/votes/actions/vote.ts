import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import dayjs from 'dayjs';
import MoleculerJs from 'moleculer';
const { ValidationError } = MoleculerJs.Errors;

export default {
  rest: 'POST /vote',
  params: {
    id: { type: 'objectID', ObjectID: ObjectId, optional: false },
    d: {
      type: 'boolean',
      optional: false,
      convert: true,
    },
  },
  async handler(this: MicroService, ctx: Context & { params: any }) {
    const { id, d } = ctx.params;

    const uid = this.extractUser(ctx);
    if (!uid) return Promise.reject(new ValidationError('no user'));

    const dateTime = dayjs().unix();
    return this._get(ctx, { id }).then((card: any) => {
      if (!card) Promise.reject(new ValidationError('error', 'number'));
      const { voters } = card;

      const currentVote = voters[String(uid)] || 0;

      return this._update(ctx, {
        id: card._id,
        voters: {
          ...voters,
          [String(uid)]: this.voteState(currentVote, d),
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
          key: `${card._id}-${card.pid}-${dateTime}-${uid}-vote`,
        }));
    });
  },
};
