import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import type { Params } from './params';

import type { Community } from '@communities/entities';
import type { Post } from '@posts/entities/';
import type { Thread } from '@threads/entities';
import type { Vote } from '@votes/entities';

import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerClientError } = MoleculerErrors;

export default async function handler(this: MicroService, ctx: Context<Params>) {
  this.logger.debug('posts.actions.create', ctx.params )
  const uid: ObjectId = this.extractUser(ctx);

  if (!uid) return Promise.reject(new MoleculerClientError('user not found', 404));
  this.logger.debug('posts.actions.create.uid', uid);
  
  const community: Community = await ctx
    .call('communities.get', { id: ctx.params.cid })

    if (!community)
    return Promise.reject(new MoleculerClientError('community not found', 404));

  const post: Post = await this._create(ctx, { ...ctx.params, uid });
  
  this.logger.debug('posts.actions.create.post', post);
  if (!post) return Promise.reject(new MoleculerClientError('error creating post', 400 ,post))

  const thread: Thread = await ctx.call('threads.create', { pid: post._id });
  this.logger.debug('posts.actions.create.thread', thread)
  
  const votes: Vote = await ctx.call('votes.create', { 
    type: 'pid', 
    target: post._id,
  });

  this.logger.debug('posts.actions.create.votes', votes)

  return post;
};