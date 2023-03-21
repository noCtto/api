
import { ObjectId } from 'mongodb';
import type { AccountThis } from '../accounts.service';
import type { Context } from 'moleculer';

export default function posts(this:AccountThis, ids:any, users:any, rule:any, ctx:Context & { params: { page: number; pageSize: number } }) {
  return Promise.all(
    users.map((user:any) =>
      ctx
        .call('posts.list', {
          query: { author: new ObjectId(user._id) },
          fields: ['_id', 'title', 'text', 'createdAt', 'image', 'board', 'votes', 'author'],
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
};
