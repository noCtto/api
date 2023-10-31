import { ObjectId } from 'mongodb';
import type { MicroService } from '@lib/microservice';
import type { Context } from 'moleculer';

export default function posts(
  this: MicroService,
  _ids: any,
  users: any,
  _rule: any,
  ctx: Context & { params: { page: number; pageSize: number } }
) {
  return Promise.all(
    users.map((user: any) =>
      ctx
        .call('posts.list', {
          query: { author: new ObjectId(user._id) },
          fields: [
            '_id',
            'title',
            'text',
            'createdAt',
            'image',
            'community',
            'votes',
            'author',
          ],
          page: ctx.params.page || 1,
          pageSize: ctx.params.pageSize || 10,
          populate: ['votes'].join(','),
        })
        .then((res) => {
          user.posts = res;
          return user;
        })
    )
  );
}
