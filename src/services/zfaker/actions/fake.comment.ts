import faker from 'faker';
import { toDeepObjectId } from '../../../utils/func';
import { randomId } from '../../../utils/func';

export default {
  rest: 'POST /fake/comment',
  params: {
    num: {
      type: 'number',
      optional: true,
    },
  },
  async handler(ctx) {
    const num = ctx.params.num || 1;

    const users = await ctx.call('users.random', { num });
    const postsIds = await ctx.call('posts.random', { num });
    const posts = await ctx.call('posts.find', {
      query: { _id: { $in: toDeepObjectId(postsIds) } },
      fields: ['_id', 'tid'],
    });

    const data: any = [];
    while (data.length < num) {
      const post = posts[data.length];
      if (post) {
        const { _id, tid } = post;
        const comment = {
          uid: randomId(users.length, users),
          tid: tid.toString(),
          pid: _id.toString(),
          text: faker.lorem.lines(),
        };
        data.push(ctx.call('comments.create', comment));
      }
    }
    return Promise.all(data);
  },
};
