import { ObjectId } from 'mongodb';
import { toDeepObjectId } from '../../../utils/func';

import type { Context } from "moleculer";
import { CommentThis } from '../comments.service';


export default {
  rest: 'POST /',
  params: {
    tid: {
      type: 'string',
      optional: false,
    },
    pid: {
      type: 'string',
      optional: false,
    },
    cid: {
      type: 'string',
      optional: true,
    },
    uid: {
      type: 'string',
      optional: true,
    },
    text: {
      type: 'string',
      optional: true,
    },
    createdAt: {
      type: 'date',
      optional: true,
      default: () => new Date(),
    },
  },
  async handler(this:CommentThis, ctx: Context & { params: any }) {
    const author:any = ctx.params.author ? new ObjectId(ctx.params.author) : this.extractUser(ctx);
    if (!author) return Promise.reject('User not found');

    const params = {
      ...ctx.params,
      uid: author,
    };

    if (!params.cid || params.cid === 'null') {
      delete params.cid;
    }

    const votes:any = await ctx.call('votes.create', {
      voters: {
        [author]: 1,
      },
      cid: params.cid,
      pid: params.pid,
      tid: params.tid,
      uid: author.toString(),
    });

    const comment = await this._create(ctx, toDeepObjectId({ ...params, vid: votes._id })).then(
      (json:any) => this.transformDocuments(ctx, { populate: ['votes', 'author', 'replies'] }, json)
    );
    return comment;
  },
};
