import MoleculerJs from 'moleculer';
import dayjs from 'dayjs';
import { ObjectId } from 'mongodb';
import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';

const { ValidationError } = MoleculerJs.Errors;

const vl = (currentVote:any, newVote:any) => {
  let votedState = 0;
  if (newVote) {
    votedState = currentVote ? 0 : 1;
  } else {
    votedState = currentVote ? -1 : 0;
  }
  return votedState;
};

export default function vote(this:MicroService, ctx: Context & { params: any }) {
  const { id, d } = ctx.params;
  const user = ctx.params.uid ? new ObjectId(ctx.params.uid) : this.extractUser(ctx);
  if (!user) return Promise.reject(new ValidationError('no user'));

  const dateTime = dayjs().unix();
  return this._get(ctx, { id }).then((card:any) => {
    if (!card) Promise.reject(new ValidationError('error', 'number'));
    const { voters } = card;

    const currentVote = voters[String(user)] || 0;

    return this._update(ctx, {
      id: card._id,
      voters: {
        ...voters,
        [String(user)]: vl(currentVote, d),
      },
      updatedAt: dayjs().toDate(),
    })
      .then((json:any) =>
        this.transformDocuments(
          ctx,
          {
            populate: ['votes', 'count'],
            fields: ['_id', 'count', 'pid', 'tid', 'cid'],
          },
          { ...json }
        )
      )
      .then((v:any) => ({ ...v, key: `${card._id}-${card.pid}-${dateTime}-${user}-vote` }));
  });
};
