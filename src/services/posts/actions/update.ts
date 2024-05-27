import type { Context } from 'moleculer';
import type { MicroService } from '../../../lib/microservice';
import type { Post } from '../entities';

export default {
  rest: 'PUT /:id',
  params: {
    id: {
      type: 'string',
      required: true,
    },
    title: {
      type: 'string',
      optional: true,
    },
    body: {
      type: 'string',
      optional: true,
    },
    image: {
      type: 'string',
      optional: true,
    },
  },
  async handler(
    this: MicroService,
    ctx: Context & { params: any  }
  ): Promise<string[]> {
    
    const { id } = ctx.params;
  
    const uid = this.extractUser(ctx);
    if (!uid) {
      return Promise.reject(new Error('User not found'));
    }


    const post: Post = await this.adapter.findById(id);
    
    if (!post) {
      return Promise.reject(new Error('Post not found'));
    }

    if (String(post.uid) !== String(uid)) {
      return Promise.reject(new Error('Unauthorized'));
    } 

    return this._update(ctx, {id, ...ctx.params, uid });
   
  },
};
