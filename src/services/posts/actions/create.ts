

import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import {Errors as MoleculerErrors} from 'moleculer';
import type { Context } from "moleculer";
import { PostThis } from '../posts.service';

const { MoleculerClientError } = MoleculerErrors;

export default {
  params: {
    title: { type: 'string', required: true },
    body: { type: 'string', optional: true },
    image: { type: 'string', optional: true },
    tags: { type: 'string', optional: true },
    labels: { type: 'string', optional: true },
    bid: { type: 'string' },
  },
  async handler(this:PostThis, ctx: Context & { params: any }) {
    const author:any = ctx.params.author ? new ObjectId(ctx.params.author) : this.extractUser(ctx);
        
    const { body } = ctx.params;

    if (!author) return Promise.reject('User not found');
    console.log('this params', ctx.params);
    
    const board = await ctx.call('boards.get', { id: ctx.params.bid }).catch(() => null);
    if (!board) return Promise.reject(new MoleculerClientError('Board not found', 404));

    const post:any = await this._create(ctx, {
      body,
      uid: author,
      bid: new ObjectId(ctx.params.bid),
      createdAt: dayjs().toDate(),
      image: ctx.params.image || null,
      title: ctx.params.title || null,
      tags: ctx.params.tags || null,
      labels: ctx.params.labels || null,
    });

    const thread:any = await ctx.call('threads.create', { pid: new ObjectId(post._id) });

    const votes:any = await ctx.call('votes.create', {
      voters: {
        [author]: 1,
      },
      pid: post._id,
      tid: thread._id,
      uid: author.toString(),
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
    }).then((json:any) =>
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
