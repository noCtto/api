

import { ObjectId } from 'mongodb';
import dayjs from 'dayjs';
import {Errors as MoleculerErrors} from 'moleculer';
import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';

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
  async handler(this:MicroService, ctx: Context & { params: any }) {
    const uid:any = this.extractUser(ctx);
    const { body } = ctx.params;

    if (!uid) return Promise.reject('User not found');
    
    const board = await ctx.call('boards.get', { id: ctx.params.bid }).catch(() => null);
    if (!board) return Promise.reject(new MoleculerClientError('Board not found', 404));

    const post:any = await this._create(ctx, {
      body,
      uid: new ObjectId(uid),
      bid: new ObjectId(ctx.params.bid),
      createdAt: dayjs().toDate(),
      image: ctx.params.image || null,
      title: ctx.params.title || null,
      tags: ctx.params.tags.split(',') || null,
      labels: ctx.params.labels || null,
    });

    const thread:any = await ctx.call('threads.create', { pid: new ObjectId(post._id) });

    const votes:any = await ctx.call('votes.create', {
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
