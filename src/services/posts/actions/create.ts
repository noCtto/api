import { ObjectId } from 'mongodb';
import { Errors as MoleculerErrors } from 'moleculer';
import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

const { MoleculerClientError } = MoleculerErrors;

export default {
  params: {
    title: { type: 'string', required: true },
    body: { type: 'string', optional: true },
    image: { type: 'string', optional: true },
    tags: { type: 'string', optional: true },
    labels: { type: 'string', optional: true },
    cid: { type: 'string' },
  },
  async handler(this: MicroService, ctx: Context & { params: any }) {
    const uid: any = this.extractUser(ctx);
    const { body } = ctx.params;

    if (!uid) return Promise.reject('User not found');
    console.log('uid', uid);
    const community = await ctx
      .call('communities.get', { id: ctx.params.cid })
      .catch(() => null);
    if (!community)
      return Promise.reject(new MoleculerClientError('community not found', 404));

    const post: any = await this._create(ctx, {
      body,
      uid: new ObjectId(uid),
      cid: new ObjectId(ctx.params.cid),
      image: ctx.params.image || null,
      title: ctx.params.title,
      tags: ctx.params.tags.split(',') || null,
      labels: ctx.params.labels || null,
    });

    const thread: any = await ctx.call('threads.create', {
      pid: new ObjectId(post._id),
    });

    const votes: any = await ctx.call('votes.create', {
      voters: {
        [uid]: 1,
      },
      type: 'pid',
      target: new ObjectId(post._id),
      uid: new ObjectId(uid),
    });

    await ctx.call('threads.update', {
      id: thread._id,
      pid: new ObjectId(post._id),
      vid: new ObjectId(votes._id),
    });
    return this._update(ctx, {
      id: post._id,
      vid: new ObjectId(votes._id),
      tid: new ObjectId(thread._id),
    }).then((json: any) =>
      this.transformDocuments(
        ctx,
        {
          populate: ['author', 'votes', 'voted', 'comments'],
        },
        json
      )
    );
  },
};
