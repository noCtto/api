import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';
import type { Params } from './params';
import type { Comment }from '@comments/entities'

import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerClientError } = MoleculerErrors;

export default async function handler(this: MicroService, ctx: Context<Params>) {
  
  const uid: ObjectId = this.extractUser(ctx);
  if (!uid) return Promise.reject(new MoleculerClientError('User not found', 404));

  const comment: Comment = await this._create(
    ctx,
    { ...ctx.params, uid }
    ).then( async (comment: Comment) => {
      
      await ctx.call('votes.create', {
        type: 'cid',
        target: comment._id,
        uid,
      });
      
      return comment;

  }).then((json: Comment) =>
    this.transformDocuments(
      ctx,
      { populate: ['votes', 'author', 'replies'] },
      json
    )
  );
  return comment;
};
