import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import type { Post } from '../entities';
// import { ObjectId } from 'mongodb';

export default {
  rest: 'DELETE /:id',
  params: {
    id: {
      type: 'string',
      required: true,
    },
  },
  async handler(
    this: MicroService,
    ctx: Context & { params: any }
  ): Promise<string[]> {
    
    const { id } = ctx.params;
  
    const uid = this.extractUser(ctx);
    if (!uid) {
      return Promise.reject(new Error('User not found'));
    }
    
    const post: Post = await this._get(ctx, {id});
    if (!post) {
      return Promise.reject(new Error('Post not found'));
    }

    if (String(post.uid) !== String(uid)) {
      return Promise.reject(new Error('Unauthorized'));
    }
    return this._remove(ctx, { id: id });
  },
};
