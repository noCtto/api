import { ObjectId } from 'mongodb';
import { toDeepObjectId } from '@utils/func';

import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default {
  params: {
    type: {
      type: 'string',
      optional: false,
      enum: ['pid', 'cid'],
    },
    target: {
      type: 'objectID',
      ObjectID: ObjectId,
      optional: false,
      convert: true,
    },
    text: {
      type: 'string',
      optional: false,
    },
    createdAt: {
      type: 'date',
      optional: true,
      default: () => new Date(),
    },
  },
  async handler(this: MicroService, ctx: Context & { params: any }) {
    const uid: ObjectId = this.extractUser(ctx);
    if (!uid) return Promise.reject('User not found');

    const { type, target } = ctx.params;

    const votes: any = await ctx.call('votes.create', {
      voters: {
        [String(uid)]: 1,
      },
      type,
      target,
      uid,
    });

    const comment = await this._create(
      ctx,
      toDeepObjectId({ ...ctx.params, vid: votes._id, uid })
    ).then((json: any) =>
      this.transformDocuments(
        ctx,
        { populate: ['votes', 'author', 'replies'] },
        json
      )
    );
    return comment;
  },
};
