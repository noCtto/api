import type { Context } from 'moleculer';
import type { MicroService } from '@lib/microservice';

export default function all(
  this: MicroService,
  ctx: Context & { params: any }
) {
  console.log('posts.hooks.before.all', ctx.params )
  ctx.params.sort = { _id: -1, comments: -1 };
  ctx.params.populate = ['votes', 'author', 'community']

}
