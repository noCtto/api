import type { Context } from "moleculer";
import type { MicroService } from '@lib/microservice';

export default function update(this:MicroService, ctx:Context & { params: any }) {
  const { id } = ctx.params;
  const user = this.extractUser(ctx);
  return this._get(ctx, { id, fields: ['_id', 'author'] }).then((post:any) => {
    if (String(post.author) !== String(user))
      return Promise.reject('You are not the author of this post');
    return post;
  });
}
