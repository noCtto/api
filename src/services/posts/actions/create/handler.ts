import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';
import type { Params } from './params';

import type { Post } from '../../entities';

import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerClientError } = MoleculerErrors;

export default async function handler(this: MicroService, ctx: Context<Params>) {
  this.logger.debug('posts.actions.create', ctx.params )
  const uid: ObjectId = this.extractUser(ctx);

  if (!uid) return Promise.reject(new MoleculerClientError('user not found', 404));
  this.logger.debug('posts.actions.create.uid', uid);
  
    if (!this.community(ctx, ctx.params.cid)) return Promise.reject(new MoleculerClientError('community not found', 404));

  const post: Post = await this._create(ctx, { ...ctx.params, uid });
  
  this.logger.debug('posts.actions.create.post', post);
  if (!post) return Promise.reject(new MoleculerClientError('error creating post', 400 ,post))

  await this.new(ctx, post);

  return post;
};
