import { ObjectId } from 'mongodb';
import type { Context } from 'moleculer';
import type { MicroService } from '../../../../lib/microservice';
import type { Params } from './params';
import type { Comment }from '../../entities'

import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerClientError } = MoleculerErrors;



export default async function handler(this: MicroService, ctx: Context<Params>) {
  
  const uid: ObjectId = this.extractUser(ctx);
  if (!uid) return Promise.reject(new MoleculerClientError('User not found', 404));

  const { target, type } = ctx.params;

  if (!target || !type) return Promise.reject(new MoleculerClientError('Invalid params', 400));

  const comment: Comment = await this._create(ctx, { type, target, uid });

  return this.transformDocuments(
    ctx,
    { populate: ['votes', 'author', 'replies'] },
    comment
  );
};
