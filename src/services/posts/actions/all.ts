import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default {
  rest: 'GET /all',
  async handler(this: MicroService, ctx: Context) {
    return this._list(ctx, {
      populate: ['comments', 'board', 'author', 'votes'],
      fields: [
        '_id',
        'votes',
        'author',
        'createdAt',
        'comments',
        'board',
        'body',
        'image',
      ],
      sort: '-createdAt',
      page: 1,
      pageSize: 10,
    });
  },
};
