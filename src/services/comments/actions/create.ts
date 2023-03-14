import { ObjectId } from 'mongodb';
import { toDeepObjectId } from '../../../utils/func';

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
  async handler(ctx) {
    const author = ctx.params.author ? new ObjectId(ctx.params.author) : this.extractUser(ctx);
    if (!author) return this.Promise.reject('User not found');

    const params = {
      ...ctx.params,
      uid: author,
    };

    if (!params.cid || params.cid === 'null') {
      delete params.cid;
    }

    const votes = await ctx.call('votes.create', {
      voters: {
        [author]: 1,
      },
      cid: params.cid,
      pid: params.pid,
      tid: params.tid,
      uid: author.toString(),
    });

    const comment = await this._create(ctx, toDeepObjectId({ ...params, vid: votes._id })).then(
      (json) => this.transformDocuments(ctx, { populate: ['votes', 'author', 'replies'] }, json)
    );
    return comment;
  },
};
