
import { ObjectId } from 'mongodb';

export default function posts(ids, users, rule, ctx) {
  return this.Promise.all(
    users.map((user) =>
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
